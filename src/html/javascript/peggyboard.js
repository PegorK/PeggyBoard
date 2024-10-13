//==========================================
// Title:  settings.js
// Author: Pegor Karoglanian
// Date:   8/15/23
// Notes:  This javascript handles all the main UI for PeggyBoard
//========================================== 

var _mainBackend = "main_backend.php"
var _screenSize = {
    width: 0,
    height: 0
};
var _holdMode = "handHold"; //default
var _currentProblem = []; //Array of objects.
var _routeSelected = false;
var _currentSelected = 0;
var _selectedIndex = 0;
var _messageTimer = null;
var _sortOrder = 1;
var global_Climbs = new Array;
var global_Grades = new Array;

const _maxStartingHand = 2;
const _maxFinishingHand = 2;
var _currentStarting;
var _current

//let there be light.
initPage();

function initPage() {
    generateWallLayout();
    loadRoutes();
    initSwipeEvents();
    setScreenSize();
    getVersion();
}

function setScreenSize() {
    _screenSize.width = $(window).width();
    _screenSize.height = $(window).height();

    var footerTop = $("#footerArea").offset().top;
    var footerHeight = $("#footerArea").height();
    var footerBottom = footerTop + footerHeight;
    var scale = 1;
    var increment = 0.01;
    if (footerBottom > _screenSize.height) {
        while ((footerBottom - 40) >= _screenSize.height) {
            footerTop = $("#footerArea").offset().top;
            footerHeight = $("#footerArea").height();
            footerBottom = footerTop + footerHeight;
            scale = scale - increment;
            $("#mainScreen").css("transform", "scale(" + scale + ")");
        }
    } else if (footerBottom < _screenSize.height) {
        while ((footerBottom + 40) <= _screenSize.height) {
            footerTop = $("#footerArea").offset().top;
            footerHeight = $("#footerArea").height();
            footerBottom = footerTop + footerHeight;
            scale = scale + increment;
            $("#mainScreen").css("transform", "scale(" + scale + ")");
        }
    }
}

function initSwipeEvents() {
    //add event listeners for swipe actions.
    var area = document.getElementById("interactionArea");
    area.addEventListener('swiped-left', function() {
        loadRoute(1);
    });
    area.addEventListener('swiped-right', function() {
        loadRoute(-1);
    });
}

function generateWallLayout() {
    //This is a bit funky, but it is to generate a table in a zig-zag pattern
    // to make it easier for the neopixels to light up in a simple manner.
    // simply put, it generates a tables with layout like so:
    //
    //    18|--|53|--|...|368
    //    --|19|--|54|...|--
    //    17|--|52|--|...|367
    //    --|20|--|55|...|--
    //    16|--|51|--|...|366
    //    --|21|--|56|...|--
    //    15|--|50|--|...|365
    //    --|22|--|57|...|--
    //    ~~~~~~~~~~~~~~~~~~~
    //     1|--|36|--|...|351
    //
    // Excuse the hardcoded values :/

    var table = $("<table id='gridTable'>").addClass('wallTable')
    var holdCount = 1;
    var first_offset_y_count = 0;
    var second_offset_y_count = 0;
    var global_x = 0;
    var numbers = ['18', '', '17', '', '16', '', '15', '', '14', '', '13', '', '12', '', '11', '', '10', '', '9', '', '8', '', '7', '', '6', '', '5', '', '4', '', '3', '', '2', '', '1']
    var letters = ['A', '', 'B', '', 'C', '', 'D', '', 'E', '', 'F', '', 'G', '', 'H', '', 'I', '', 'J', '', 'K'];
    for (y = 0; y < 36; y++) {
        var patternedCount_1 = 17;
        var patternedCount_2 = 18;
        var row = $('<tr>');
        for (x = 0; x < 22; x++) {
            var col = $('<td>');
            var cont = $('<div>');
            if ((x == 0) && (y % 2 == 0)) {
                patternedCount_1 = patternedCount_1 - first_offset_y_count;
                cont = $('<div>').addClass('wallNumbering').text(numbers[y]);
            } else if ((y == 35) && ((x + 1) % 2 == 0)) {
                cont = $('<div>').addClass('wallLettering').text(letters[x - 1]);
            } else if ((x == 0) || (y == 35)) {
                patternedCount_2 = patternedCount_2 + second_offset_y_count;
            } else if (y % 2 == 0) {
                if ((x + 1) % 2 == 0) {
                    $(row).addClass("borderSideOffset1")
                    cont = $('<div id=hold' + patternedCount_1 + ' onclick="addHold(' + patternedCount_1 + ')">').addClass('wallHoldClickable wallHoldOffset1');
                    patternedCount_1 = patternedCount_1 + 35;
                }
            } else if ((y + 1) % 2 == 0) {
                if ((x) % 2 == 0) {
                    cont = $('<div id=hold' + patternedCount_2 + ' onclick="addHold(' + patternedCount_2 + ')">').addClass('wallHoldClickable wallHoldOffset2');
                    patternedCount_2 = patternedCount_2 + 35;
                }
            }

            if (letters[x] == 'F') {
                $(col).addClass("borderSideOffsetMiddle");
            } else if (x % 2 == 0) {
                $(col).addClass("borderSideOffset1");
            } else {
                $(col).addClass("borderSideOffset2");
            }

            if (numbers[y] == '9') {
                $(col).addClass("borderBottomOffsetMiddle");
            } else if (y % 2 == 0) {
                $(col).addClass("borderBottomOffset1");
            } else {
                $(col).addClass("borderBottomOffset2");
            }

            col.append(cont);
            row.append(col);
        }

        if (y % 2 == 0) {
            first_offset_y_count = first_offset_y_count + 1;
        } else if ((y + 1) % 2 == 0) {
            second_offset_y_count = second_offset_y_count + 1;
        }

        table.append(row);
    }

    $('#interactionArea').append(table);
}

function addHold(id) {
    var type = 'startingHand';
    var plainText = 'Starting Hold';
    var color = '00FF00';

    //Check if max amount of starting and ending hand holds has reached.
    var maxStartingReached = (_currentProblem.filter(function(obj) {
        return obj.type === "startingHand"
    }).length >= _maxFinishingHand ? true : false);
    var maxFinishingReached = (_currentProblem.filter(function(obj) {
        return obj.type === "finishingHand"
    }).length >= _maxFinishingHand ? true : false);

    //Check if a hold currently exists this position.
    try {
        var currentType = _currentProblem.filter(function(obj) {
            return obj.hold == id
        })[0].type;
    } catch {
        var currentType = undefined;
    }

    if (currentType != undefined) {
        $("#hold" + id).removeClass(currentType);
        var removeHold = _currentProblem.map(function(item) {
            return item.hold;
        }).indexOf(id);
        _currentProblem.splice(removeHold, 1);

        switch (currentType) {
            case "startingHand":
                type = "handHold";
                plainText = 'Hand Hold';
                color = "6600FF";
                break;
            case "handHold":
                type = "footHold";
                plainText = 'Foot Hold';
                color = "FF0000";
                break;
            case "footHold":
                if (!maxFinishingReached) {
                    type = "finishingHand";
                    plainText = 'Finishing Hold';
                    color = "0000FF";
                } else {
                    type = "none";
                }
                break;
            case "finishingHand":
                type = "none";
                break;
            default:
                type = "handHold";
                color = "6600FF";
        }
    } else {
        if (type == "startingHand" && maxStartingReached) {
            type = "handHold";
            plainText = 'Hand Hold';
            color = "6600FF";
        }
    }

    if (type != "none") {
        var holdOffset = $("#hold" + id).offset();
        $("#displayMessage").text(plainText);
        $("#messageArea").css("top", holdOffset.top - 10);
        $("#messageArea").css("left", holdOffset.left + 10);
        $("#messageArea").show();
        clearTimeout(_messageTimer);
        _messageTimer = setTimeout(function() {
            $("#displayMessage").text("");
            $("#messageArea").hide();
        }, 500);
        $("#hold" + id).addClass(type);
        _currentProblem.push({
            hold: id,
            type: type,
            color: color
        });
    }
}

function remove_hold(id) {
    try {
        var currentType = _currentProblem.filter(function(obj) {
            return obj.hold == id
        })[0].type;
        $("#hold" + id).removeClass(currentType);
        var removeHold = _currentProblem.map(function(item) {
            return item.hold;
        }).indexOf(id);
        _currentProblem.splice(removeHold, 1);
    } catch {
        console.error("Can't remove a hold that doesn't exist!")
    }
}

function lightCurrent() {
    if (_currentProblem.length > 0) {
        $.ajax({
            url: _mainBackend,
            data: {
                function: 'setLeds',
                parameter: JSON.stringify(_currentProblem)
            },
            type: 'POST',
            success: function(output) {
                if (typeof(callback) != "undefined") {
                    callback();
                    console.log('Setting LEDs was successful!');
                }
            },
            dataType: 'json'
        });
    } else {
        console.log("No holds to light.");
    }
}

function clearAll(bypass = false, callback) {
    if (!bypass) {
        var warnDialog = confirm("Are you sure you would like to clear the current problem?");
    }
    if (bypass || warnDialog == true) {
        // Clear the current problem.
        console.log("Clearing problem.");

        var holdIDs = []
        _currentProblem.forEach(hold => holdIDs.push(hold.hold));
        for (var i = 0; i < holdIDs.length; i++) {
            remove_hold(holdIDs[i]);
        }

        if (!bypass) {
            _routeSelected = false;
            $("#route" + _currentSelected).removeClass('climb_selected');
        }
        // Make sure all LEDs are off
        $.ajax({
            url: _mainBackend,
            data: {
                function: 'clearLeds'
            },
            type: 'POST',
            success: function(output) {
                if (typeof(callback) != "undefined") {
                    callback();
                    console.log('Clearing LEDs was successful!');
                }
            },
            dataType: 'json'
        });

        $("#selectedRouteName").text(""); //clear the name if there was one;
    } else {
        console.log("Clear Canceled.")
    }
}

function saveRoute() {
    var options = {
        name: $("#routeName").val(),
        grade: $("#routeGrade").val(),
        author: $("#routeAuthor").val(),
        problem: JSON.stringify(_currentProblem)
    };

    if (options.name == "" || options.grade == "" || options.author == "" || options.problem == "") {
        alert("ERROR: Please ensure all fields are filled.")
        return;
    }

    // escape any quote and apostrophes so database doesn't break.
    options.name = options.name.replace(/'/g, "\\'");
    options.author = options.author.replace(/'/g, "\\'");

    console.log("Saving Route.");
    $("#saveFormStatus").show().addClass("saveForm-container-status-loading");

    var callback = function(output) {
        setTimeout(() => {
            $("#saveFormStatus").removeClass("saveForm-container-status-loading");
            $("#saveFormStatus").addClass("saveForm-container-status-success");
            setTimeout(function() {
                $("#saveFormStatus").hide().removeClass("saveForm-container-status-success");
                $("#saveFormBg").hide();
            }, 2000);
            loadRoutes(output); //refresh list.
        }, 2000);
    }

    $.ajax({
        url: _mainBackend,
        data: {
            function: 'saveRoute',
            parameter: options
        },
        type: 'POST',
        success: function(output) {
            if (output != -1) {
                if (typeof(callback) != "undefined") {
                    callback(output);
                    console.log('Saving was successful!');
                }
            } else {
                $("#saveFormStatus").removeClass("saveForm-container-status-loading");
                $("#saveFormStatus").addClass("saveForm-container-status-error");
            }
        },
        error: function(ajaxContext) {
            console.error(ajaxContext.responseText)
            $("#saveFormStatus").removeClass("saveForm-container-status-loading");
            $("#saveFormStatus").addClass("saveForm-container-status-error");
            setTimeout(function() {
                $("#saveFormStatus").hide().removeClass("saveForm-container-status-error");
                $("#saveFormBg").hide();
            }, 2000);
        },
        dataType: 'json',
    });
}

function openSaveForm() {
    if (_currentProblem.length > 0) {
        document.getElementById("saveFormBg").style.display = "block";
    }
}

function closeSaveForm() {
    document.getElementById("saveFormBg").style.display = "none";
}


function getRoutes(sortType, sortOrder, callback) {
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
                global_Climbs[i] = JSON.parse(output[i]);
            }
            if (typeof(callback) != "undefined") {
                callback(global_Climbs);
                console.log('getRoutes was successful!');
            }
        },
        dataType: 'json'
    });
}

function populateClimb(id, redirect = false) {
    if (global_Climbs.length > 0) {
        //add active class to the selected and remove from old one if any.
        $("#route" + _currentSelected).removeClass('climb_selected');
        $("#route" + id).addClass('climb_selected')
        _currentSelected = id;
        _selectedIndex = global_Climbs.findIndex(x => x.id == id);
        var route = global_Climbs.filter(x => x.id == id)[0];
        if (route != undefined) {
            _routeSelected = true; //Flag to not allow interaction area to be used when a route is active.
            var holds = JSON.parse(route.holds);
            if (_currentProblem.length > 0) {
                clearAll(true); //bypass warning and clear the canvas/lights.
            }
            _currentProblem = holds; //set the new current to loaded one.
            $("#selectedRouteName").text(route.name + ', V' + route.grade);
            for (hold in holds) {
                $("#hold" + holds[hold].hold).addClass(holds[hold].type);
            }
            if (redirect) {
                toggleLoadSelection();
            }
        }
    }
}

function toggleLoadSelection() {
    if ($("#loadIcn").hasClass("loadActive")) {
        $("#tableOfClimbs").hide();
        $("#interactionArea").show();
        $("#loadIcn").removeClass("loadActive");
    } else {
        $("#interactionArea").hide();
        $("#tableOfClimbs").show();
        $("#loadIcn").addClass("loadActive");
    }
}

function toggleMenuSelection() {
    if ($("#menuItems").is(":visible")) {
        $("#menuItems").hide();
    } else {
        $("#menuItems").show();
        document.addEventListener("click", function(event) {
            if (event.target.id == "menuButton" || event.target.className == "menuItem") {
                //do nothing
            } else {
                $("#menuItems").hide();
            }
        });
    }
}

function loadRoutes(show) {
    var callback = function(DATA) {
        generateListOfClimbs(DATA);
        if (show != undefined) {
            populateClimb(show);
        }
    }
    getRoutes("NAME", "ASC", callback);
}

function generateListOfClimbs(DATA) {
    $("#climbsTable").empty()
    var sortButtons = $(["<div class='sort_options' id='sortOptions'>",
        " <div class='sort_by_name' id='sortByName' onclick='sortList(\"name\")'>",
        "   <span>Name</span>",
        " </div>",
        " <div class='sort_by_grade' id='sortByGrade' onclick='sortList(\"grade\")'>",
        "   <span>Grade</span>",
        " </div>",
        "</div>"
    ].join("\n"))
    $("#climbsTable").append(sortButtons);
    for (y = 0; y < DATA.length; y++) {
        var details = $(["<div class='main_wrap' id='route" + DATA[y].id + "' onclick='populateClimb(" + DATA[y].id + ", true)'>",
            "  <div class='left_content'>",
            "    <div style='display:inline-block'>",
            "     <div class='climb_title'>" + DATA[y].name + "</div>",
            "     <div class='climb_desc'>" + DATA[y].author + "</div>",
            "     <div class='climb_date'>" + DATA[y].date.split(' ')[0] + "</div>",
            "    </div>",
            "  </div>",
            "  <div class='right_content'>",
            "    <div class='climb_grade'>V" + DATA[y].grade + "</div>",
            "  </div>",
            "</div>"
        ].join("\n"))

        $("#climbsTable").append(details);
    }
    console.log("Done loading climbs.")
}

function loadRoute(direction) {
    if (_routeSelected == false) {
        //don't allow for swipe while creating a climb.
        return;
    }
    if (direction == 1) {
        var newIndex = _selectedIndex + 1;
        if (newIndex <= global_Climbs.length - 1) {
            populateClimb(global_Climbs[newIndex].id);
            crappyEffect();
        }
    } else if (direction == -1) {
        if (_selectedIndex > 0) {
            populateClimb(global_Climbs[_selectedIndex - 1].id);
            crappyEffect();
        }
    } else {
        console.error("Error occured on swipe.")
    }
}

//shitty effect to give feedback for swiping through problems.
function crappyEffect() {
    $("#gridTable").css('opacity', 0.3);
    setTimeout(function() {
        $("#gridTable").css('opacity', '');
    }, 200);
}

function searchForRoute() {
    var key = $("#searchBar").val();
    //clear current results
    var data = filterByValue(global_Climbs, key);
    generateListOfClimbs(data);
}

function filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o["name"].toLowerCase().includes(string.toLowerCase())));
}

function sortList(type) {
    var callback = function(DATA) {
        generateListOfClimbs(DATA);
    }
    var order;
    _sortOrder = _sortOrder * (-1); //flip flop the sort order shenanigans
    if (_sortOrder < 0) {
        order = "ASC";
    } else {
        order = "DESC";
    }
    if (type == 'name') {
        console.log('Sorting by name: ' + order);
        getRoutes("NAME", order, callback);
    } else if (type == 'grade') {
        console.log('Sorting by grade: ' + order);
        getRoutes("GRADE", order, callback);
    } else {
        console.error("Invalid sort type.");
    }
}

function openAbout(show) {
    if (show) {
        $("#aboutPage").show();
    } else {
        $("#aboutPage").hide();
    }
}

function getVersion() {
    $.ajax({ url: _mainBackend,
        data: {function: 'getVersion'},
        type: 'POST',
        success: function(output) {
                    output = output.trim();
                    $("#versionDiv").html("v:" + output.slice(0,7));
                },
        error: function (ajaxContext) {
                console.error("Something went wrong...");
            },
    });
}