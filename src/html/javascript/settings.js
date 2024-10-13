//==========================================
// Title:  settings.js
// Author: Pegor Karoglanian
// Date:   8/15/23
// Notes:  This javascript handles almost all the functions for the UI on the main controller.
//==========================================

var _availableWifi = new Array();
var _pBoard = new PeyBoard_alpha("wifiKeyboard", "wifiPassword", opts = {});
var _time = null;
var _settingsBackend = "settings_backend.php"
var _mainBackend = "main_backend.php"

var _selectedWifi = {ssid:"", bssid:""};
var _connectedWifi = "";
var _ledState = false;
var _routeDatabase = new Array();
var _selectedRoute = "";
var _screenSaverTimer = null;

const _screenSaverDelay       = 300000;// 5 min
const _checkOnlineTimeout     = 5000;  // 5 seconds
const _updateTimeTimeout      = 60000; // 60 seconds
const _touchActionTimeout     = 100;   // 0.1 second
const _connectSuccessTimeout  = 1500;  // 1.5 seconds
const _connectFailTimeout     = 2500;  // 2.5 seconds

// Climbs shall be had.
initPage();

function initPage() {
    getCurrentWifi();
    checkOnline();  // start network check if online
    updateTime();   // start clock
    getCurrentIp();
    getRoutes("NAME", "ASC");
    resetScreenSaverTimer();
    getVersion();
}

function checkWifiPassword() {
    if($("#wifiPassword").val().length == 0) {
        $("#connectButton").prop( "disabled", true );
    } else {
        $("#connectButton").prop( "disabled", false );
    }
}

function createWifiList(availableWifiConnections) {
    _availableWifi = availableWifiConnections;
    var connectionList = "";

    if(_availableWifi == null) {
        return;
    }

    for (var x = 0; x<availableWifiConnections.length; x ++ ) {
        if (availableWifiConnections[x].essid == "") {
            continue;
        }
        var signal = Math.round((parseInt(availableWifiConnections[x].signal_quality) / parseInt(availableWifiConnections[x].signal_total)*100));        
        var signalClass = "weakWifiSignal";
        if (signal >= 70) {
            signalClass = "strongWifiSignal";
        } else if (signal >= 40) {
            signalClass = "mediumWifiSignal";
        }

        var wifiName = availableWifiConnections[x].essid;
        if(wifiName.length > 20) {
            wifiName = wifiName.substring(0, 17) + "...";
        }

        if(_connectedWifi == availableWifiConnections[x].mac) {
            var firstItem = ""; //Set the connected to top of list;
            firstItem += "<div id='connectedWifi' class='connectionItem activeConnection' onclick='expandWifiConnection("+ x +")'>";
            firstItem +=   "<div class='wifiSignalBase "+ signalClass +"'></div>";
            firstItem +=   "<div class='connectionName'>" + wifiName + "</div>";
            firstItem +=   "<div id='connectedWifiString' class='connectedString'>CONNECTED</div>";
            firstItem += "</div>";
            connectionList = firstItem + connectionList;
        } else {
            connectionList += "<div class='connectionItem' onclick='expandWifiConnection("+ x +")'>";
            connectionList +=   "<div class='wifiSignalBase "+ signalClass +"'></div>";
            connectionList +=   "<div class='connectionName'>" + wifiName + "</div>";
            connectionList += "</div>";
        }
    }
    var generateWifiListHtml = "<div class='connectionList'>";
    generateWifiListHtml += connectionList;
    generateWifiListHtml += "</div>";
    $("#availableConnections").html(generateWifiListHtml);
}

function expandWifiConnection(conn) {
    $("#wifiPassword").val('')
    var selectedWifi = _availableWifi[conn];
    var name = selectedWifi.essid;
    if (name.length > 20) {
        name = name.substring(0, 17) + "...";
    }
    $("#wifiSelectTitle").html(name);
    if (selectedWifi.frequency) {
        $("#freqTitle").show();
        $("#wifiSelectFreq").show();
        $("#wifiSelectFreq").html(selectedWifi.frequency + " " + selectedWifi.frequency_units);
    } else {
        $("#freqTitle").hide();
        $("#wifiSelectFreq").hide();
    }
    $("#wifiSelectMac").html(selectedWifi.mac);

    _selectedWifi.ssid = selectedWifi.essid;
    _selectedWifi.bssid = selectedWifi.mac;

    openSettings("wifi-select");
}

function checkOnline() {
    //check the network status and update icon accordingly
    $.ajax({ url: _settingsBackend,
        data: {function: 'checkOnline'},
        type: 'POST',
        success: function(output) {
                    if(output.trim() == "True") {
                        $("#wifiStatus").removeClass("statusBarWifiOffline");
                        $("#wifiStatus").addClass("statusBarWifiOn");

                        $("#connectedWifi").removeClass("networkIssues");
                        $("#connectedWifiString").html("CONNECTED");

                        $("#wifiStatusMenu").html("Connected");
                    } else if ((output.trim() == "False") && (_connectedWifi !="")) {
                        $("#wifiStatus").removeClass("statusBarWifiOn");
                        $("#wifiStatus").addClass("statusBarWifiOffline");

                        $("#connectedWifi").addClass("networkIssues");
                        $("#connectedWifiString").html("NO INTERNET");

                        $("#wifiStatusMenu").html("Connected - No Internet");
                    } else {
                        $("#wifiStatus").removeClass("statusBarWifiOn");
                        $("#wifiStatus").removeClass("statusBarWifiOffline");
                        $("#wifiStatusMenu").html("Not Connected");
                    }
                },
        error: function (ajaxContext) {
                console.error("Something bad happened");
            },
    });
    setTimeout(checkOnline, _checkOnlineTimeout);
}

function updateTime() {
    _time = new Date();
    $("#currentTime").html(_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    $("#currentDate").html(_time.toLocaleDateString('en-US'));

    setTimeout(updateTime, _updateTimeTimeout);
}

function openSettings(page) {
    _pBoard.hide();
    switch (page) {
        case 'wifi':
            $("#wifiSettingsPage").show();
        break;
        case 'wifi-select':
            $("#selectedWifiPage").show();
            _pBoard.show();
        break;
        case 'database':
            $("#routeDatabasePage").show();
        break;
        case 'route-select':
            $("#selectedRoutePage").show();
        break;
        case 'about':
            $("#aboutPage").show();
        break;
        case 'reboot':
            $("#rebootAlert").show();
        break;
        case 'shutdown':
            $("#shutdownAlert").show();
        break;
        case 'main':
        default:
            $("#mainSettingsPage").show('slide', {direction: 'down'});
        break;
    }
}

function closeSettings(page) {
    _selectedWifi.ssid = "";
    _selectedWifi.bssid = "";

    switch (page) {
        case 'wifi':
            $("#wifiSettingsPage").hide();
        break;
        case 'wifi-select':
            $("#selectedWifiPage").hide();
        break;
        case 'database':
            $("#routeDatabasePage").hide();
        break;
        case 'route-select':
            $("#selectedRoutePage").hide();
        break;
        case 'about':
            $("#aboutPage").hide();
        break;
        case 'main':
        default:
            $("#mainSettingsPage").hide('slide', { direction: "down" });
        break;
    }
}

function refreshPage() {
    location.reload();
}

function systemReboot(reboot) {
    $("#rebootAlert").hide();
    if (reboot) {
        $("#loadingSpinner").show();
        $.ajax({ url: _settingsBackend,
            data: {function: 'systemReboot'},
            type: 'POST',
            success: function(output) {
                        console.log("Goodbye!");
                    },
            error: function (ajaxContext) {
                    console.error("Something bad happened")
                    $("#loadingSpinner").hide();
                },
        });
    }
}

function systemShutdown(shutdown) {
    $("#shutdownAlert").hide();
    if (shutdown) {
        $("#loadingSpinner").show();
        $.ajax({ url: _settingsBackend,
            data: {function: 'systemShutdown'},
            type: 'POST',
            success: function(output) {
                        console.log("Goodbye!");
                    },
            error: function (ajaxContext) {
                    console.error("Something bad happened")
                    $("#loadingSpinner").hide();
                },
        });
    }
}

// for animations on touchscreen.
function touchAction(action) {
    switch (action) {
        case 'settings':
            $("#settings").addClass("iconActive");
            openSettings("main");
        break;
        case 'refresh':
            refreshPage();
        break;
        default:
            refreshPage();
        break;
    }

    setTimeout(clearActiveIcon, _touchActionTimeout);
}

function clearActiveIcon() {
    $("#pour").removeClass("iconActive");
    $("#settings").removeClass("iconActive");
    $("#info").removeClass("iconActive");
}

async function getWifi() {
    $('#loadingSpinnerWifi').show();
    var connections = new Array();
    $.ajax({ url: _settingsBackend,
        data: {function: 'getAvailableWifi'},
        type: 'POST',
        success: function(output) {
                        connections=JSON.parse(output);
                        createWifiList(connections);
                        $('#loadingSpinnerWifi').hide();
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
                $('#loadingSpinnerWifi').hide();
            },
        dataType: 'json'
    });
}

async function refreshWifi() {
    $('#loadingSpinnerWifi').show();
    $.ajax({ url: _settingsBackend,
        data: {function: 'refreshAvailableWifi'},
        type: 'POST',
        success: function(output) {
                    getCurrentWifi();
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
            },
    });
}

async function connectToWifi() {

    if ((_selectedWifi.ssid == "") || (_selectedWifi.bssid == "") || ($("#wifiPassword").val().length == 0)) {
        console.error("Wifi configuration not selected or password not entered.");
        return;
    }

    $('#loadingSpinner').show();

    var options = {
        ssid: _selectedWifi.ssid,
        bssid: _selectedWifi.bssid,
        psk: $("#wifiPassword").val()
    };
    
    // escape any quote and apostrophes so database doesn't break.
    options.ssid = options.ssid.replace(/'/g,"\\'");
    options.psk = options.psk.replace(/'/g,"\\'");

    $.ajax({ url: _settingsBackend,
        data: {function: 'connectToWifi', parameter: options},
        type: 'POST',
        success: function(output) {
                    if(output.trim()=="SUCCESS") {
                        $('#loadingSpinner').hide();
                        $('#successMsg').show();
                        getCurrentWifi();
                        getCurrentIp();
                        setTimeout(function() {
                            $('#successMsg').hide();
                            closeSettings('wifi-select');
                        }, _connectSuccessTimeout)
                    } else {
                        $('#loadingSpinner').hide();
                        $('#errorMsg').show();
                        getCurrentWifi();
                        setTimeout(function() {$('#errorMsg').hide();}, _connectFailTimeout);
                    }
                    console.log(output)
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
                $('#loadingSpinner').hide();
                $('#errorMsg').show();
                setTimeout(function() {$('#errorMsg').hide();}, _connectFailTimeout);
            },
    });
}

function getCurrentWifi() {
    $.ajax({ url: _settingsBackend,
        data: {function: 'getCurrentWifi'},
        type: 'POST',
        success: function(output) {
                    _connectedWifi = output.trim();

                    getWifi();   // get all the available networks
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
                _connectedWifi = "";
                getWifi();   // get all the available networks
            },
    });
}

function getCurrentIp() {
    $.ajax({ url: _settingsBackend,
        data: {function: 'getCurrentIp'},
        type: 'POST',
        success: function(output) {
                _currentIp = output.trim();
                $("#currentIp").html(_currentIp);
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
                _currentIp = ""
                $("#currentIp").html("not connected");
            },
    });
}

function showPassword() {
    var x = document.getElementById("wifiPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function getRoutes(sortType, sortOrder) {
    _routeDatabase = [];
    $.ajax({
        url: _mainBackend,
        data: {
            function: 'getRoutes',
            parameter: sortType,
            parameter2: sortOrder
        },
        type: 'POST',
        success: function(output) {
            for (i = 0; i < output.length; i++) {
                _routeDatabase[i] = JSON.parse(output[i]);
            }

            createDatabaseList(_routeDatabase);
        },
        dataType: 'json'
    });
}

function createDatabaseList(routes) {
    var routeList = "";

    if(routes == null) {
        return;
    }

    for (var x = 0; x<routes.length; x ++ ) {
        var routeName = routes[x].name;
        var routeGrade = routes[x].grade;

        routeList += "<div class='connectionItem' onclick='expandRouteInfo("+ x +")'>";
        routeList +=   "<div class='connectionName'> (V" + routeGrade + ")</div>";
        routeList +=   "<div class='connectionName'>" + routeName + "</div>";
        routeList += "</div>";
    }
    var generatedListHtml = "<div class='connectionList'>";
    generatedListHtml += routeList;
    generatedListHtml += "</div>";
    $("#savedRoutes").html(generatedListHtml);
}

function expandRouteInfo(route) {
    _selectedRoute = _routeDatabase[route];
    var name = _selectedRoute.name;
    if (name.length > 20) {
        name = name.substring(0, 17) + "...";
    }
    $("#routeSelectTitle").html(name);
    $("#routeSelectName").html(_selectedRoute.name);
    $("#routeSelectGrade").html("V" + _selectedRoute.grade);
    $("#routeSelectDate").html(_selectedRoute.date);
    $("#routeSelectAuthor").html(_selectedRoute.author);

    openSettings("route-select");
}

function popupDeleteRoute() {
    $("#deleteAlert").show();
}

function deleteRoute(delete_route) {
    $("#deleteAlert").hide();
    if (delete_route) {
        $("#loadingSpinner").show();
        $.ajax({ url: _mainBackend,
            data: {
                function: 'deleteRoute',
                parameter: _selectedRoute.id
            },
            type: 'POST',
            success: function(output) {
                        $('#loadingSpinner').hide();
                        $('#successMsg').show();
                        getRoutes("NAME", "ASC");
                        setTimeout(function() {
                            closeSettings('route-select');
                            $('#successMsg').hide();
                        }, 1000);
                    },
            error: function (ajaxContext) {
                    console.error("Something bad happened")
                    $('#loadingSpinner').hide();
                    $('#errorMsg').show();
                    setTimeout(function() {
                        $('#errorMsg').hide();
                    }, 2000);
                },
        });
    }

}

function refreshRoutes() {
    $('#loadingSpinner').show();
    getRoutes("NAME", "ASC", setTimeout(function(){$('#loadingSpinner').hide();}, 1000));
}

function checkUpdates() {
    $('#updateAlert').show();
    $.ajax({ url: _settingsBackend,
        data: {function: 'updateSystem'},
        type: 'POST',
        success: function(output) {
                    output = output.trim();
                    if (output != "False") {
                        $("#updateHeader").html("Updated!");
                        $("#updateMsg").html("Version: " + output.slice(30,));
                    } else {
                        $("#updateHeader").html("Already up to date.");
                    }
                    setTimeout(function(){$("#updateButtonContainer").show()}, 1000);
                },
        error: function (ajaxContext) {
                $("#updateHeader").html("ERROR");
                $("#updateMsg").html("An error occurred. Please try again.");
                console.error("Something went wrong...");
                setTimeout(function(){$("#updateButtonContainer").show()}, 1000);
            },
    });
}

function getVersion() {
    $.ajax({ url: _mainBackend,
        data: {function: 'getVersion'},
        type: 'POST',
        success: function(output) {
                    output = output.trim();
                    $("#versionSpan").html("Version: " + output.slice(30,));
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
            },
    });
}

function screenSaverTimer() {
    $("#screenSaver").fadeIn(3000);
}

function resetScreenSaverTimer() {
    clearTimeout(_screenSaverTimer);
    $("#screenSaver").fadeOut();
    _screenSaverTimer = setTimeout(screenSaverTimer, _screenSaverDelay);
}

