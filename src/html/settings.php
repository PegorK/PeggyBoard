<?php require "settings_backend.php"; ?>
<?php require "main_backend.php"; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>
      PeggyBoard
    </title>
    <link href="css/settings.css?v=1" rel="stylesheet">
    <link href="css/peyBoardStyle.css?v=1" rel="stylesheet">
    <script src="jquery/jquery.min.js" type="text/javascript"></script>
    <script src="jquery/jquery-ui.min.js" type="text/javascript"></script>
  </head>
  <body onclick="resetScreenSaverTimer()">
    <div id="statusBar">
      <div class="statusBarDate" id="currentDate"></div>
      <div class="statusBarTime" id="currentTime"></div>
      <div class="statusBarWifiOff" id="wifiStatus"></div>
    </div>
    <div id="mainSettingsPage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('main')"></div>
        <div class="menuTitle">Settings</div>
      </div>
      <div class="settingsItem" onclick="openSettings('wifi')">
        <div class="settingsItemTitle">Wi-Fi Setup</div>
        <div class="settingsItemStatus" style="font-weight: bold;" id="wifiStatusMenu">Not Connected</div>
      </div>
      <div class="settingsItem" onclick="openSettings('database')">
        <div class="settingsItemTitle">Route Database</div>
        <div class="settingsItemStatus" id="databaseMenu"></div>
      </div>
      <div class="settingsItem" onclick="checkUpdates()">
        <div class="settingsItemTitle">Check For Updates</div>
      </div>
      <div class="settingsItem" onclick="openSettings('about')">
        <div class="settingsItemTitle">About</div>
      </div>
      <div class="settingsItem" onclick="openSettings('reboot')">
        <div class="settingsItemTitle">Reboot</div>
      </div>
      <div class="settingsItem" onclick="openSettings('shutdown')">
        <div class="settingsItemTitle">Shutdown</div>
      </div>
    </div>
    <div id="wifiSettingsPage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('wifi')"></div>
        <div class="menuTitle">Wi-Fi Setup</div>
        <div class="refreshButton" onclick="refreshWifi()"></div>
      </div>
      <div id="loadingSpinnerWifi" class="spinnerBackground">
        <div class="loadingSpinner"></div>
        <div class="overlayMsg">Scanning...</div>
      </div>
      <div class="settingsItemList" id="availableConnections"></div>
    </div>
    <div id="selectedWifiPage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('wifi-select')"></div>
        <div class="menuTitle" id="wifiSelectTitle"></div>
      </div>
      <div class="settingsItem">
        <div class="networkInfo">
          <div id="freqTitle">Frequency:</div>
          <div id="wifiSelectFreq"></div>
        </div>
        <div class="networkInfo">
          <div>MAC:</div>
          <div id="wifiSelectMac"></div>
        </div>
        <div class="settingsItemContent">    
          <label style="display: block; font-weight: bold; font-size:20px;" for="wifiPassword">Password:</label>
          <input style="display: block; font-size: 28px; user-select:none;" disabled type="password" id="wifiPassword" name="password" required>
          <input type="checkbox" id="showPassword" onclick="showPassword()">
          <label for="showPassword">Show Password</label>
        </div>
        <div class="settingsItemContent">
          <button id="connectButton" type="button" class="connectWifiButton" onclick="connectToWifi()" disabled>Connect</button>
        </div>
      </div>
      <div id="wifiKeyboard"></div>
    </div>
    <div id="routeDatabasePage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('database')"></div>
        <div class="menuTitle">Route Database</div>
        <div class="refreshButton" onclick="refreshRoutes()"></div>
      </div>
      <div class="settingsItemList" id="savedRoutes"></div>
    </div>
    <div id="selectedRoutePage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('route-select')"></div>
        <div class="menuTitle" id="routeSelectTitle"></div>
      </div>
      <div class="settingsItem">
        <div class="settingsItemContent">    
          <div class="routeInfo">
            <div>Name:</div>
            <div id="routeSelectName"></div>
          </div>
          <div class="routeInfo">
            <div>Grade:</div>
            <div id="routeSelectGrade"></div>
          </div>
          <div class="routeInfo">
            <div>Date Created:</div>
            <div id="routeSelectDate"></div>
          </div>
          <div class="routeInfo">
            <div>Author:</div>
            <div id="routeSelectAuthor"></div>
          </div>
        </div>
        <div class="settingsItemContent">
          <button id="deleteButton" type="button" class="deleteRouteButton" onclick="popupDeleteRoute()">Delete</button>
        </div>
      </div>
    </div>
    <div id="aboutPage" class="settingsPage">
      <div class="menuHeader">
        <div class="backButton" onclick="closeSettings('about')"></div>
        <div class="menuTitle">About</div>
      </div>
      <div class="settingsItem" style="text-align:center">
        Made by Pegor Karoglanian (devPegor@gmail.com)
        <br>
        <span id="versionSpan" onclick="refreshPage()"></span>
      </div>
    </div>
    <div id="loadingSpinner" class="spinnerBackground">
      <div class="loadingSpinner"></div>
    </div>
    <div id="successMsg" class="spinnerBackground">
      <div class="successIcon"></div>
      <div class="overlayMsg">SUCCESS!</div>
    </div>
    <div id="errorMsg" class="spinnerBackground">
      <div class="errorIcon"></div>
      <div class="overlayMsg">ERROR! <br> Something went wrong! Please try again.</div>
    </div>
    <div id="rebootAlert" class="spinnerBackground">
      <div class="overlayMsgTop">Are you sure you would like to reboot the system?</div>
      <div class="buttonContainer">
          <button type="button" class="buttonAccept" onclick="systemReboot(true)" >YES</button>
          <button type="button" class="buttonCancel" onclick="systemReboot(false)" >CANCEL</button>
      </div>
    </div>
    <div id="shutdownAlert" class="spinnerBackground">
      <div class="overlayMsgTop">Are you sure you would like to shutdown the system?</div>
      <div class="buttonContainer">
          <button type="button" class="buttonAccept" onclick="systemShutdown(true)" >YES</button>
          <button type="button" class="buttonCancel" onclick="systemShutdown(false)" >CANCEL</button>
      </div>
    </div>
    <div id="deleteAlert" class="spinnerBackground">
      <div class="overlayMsgTop">Are you sure you would like to delete this route?</div>
      <div class="buttonContainer">
          <button type="button" class="buttonAccept" onclick="deleteRoute(true)" >YES</button>
          <button type="button" class="buttonCancel" onclick="deleteRoute(false)" >CANCEL</button>
      </div>
    </div>
    <div id="updateAlert" class="spinnerBackground">
      <div class="overlayMsgTop" id="updateHeader">Checking for updates...</div> 
      <div class="overlayMsg" id="updateMsg"></div>
      <div class="buttonContainer" id="updateButtonContainer" hidden>
          <button type="button" class="buttonAccept" onclick="location.reload(true)">OK</button>
      </div>
    </div>
    <div id="screenSaver">
      <div id="screenSaverContent"></div>
    </div>
    <div id="mainScreen">
      <table id="buttonsTable">
        <tr>
          <td>
            <div class="networkInfoBubble">
              <div class="networkInfoHeader">CURRENT ADDRESS:</div>
              <div class="networkInfoDetails" id="currentIp">not connected</div>
            <div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="icon" id="settings" onclick="touchAction('settings')">
              <span class="settingsIcon"></span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
<script src="javascript/peyBoard_alpha.js?v=1" type="text/javascript"></script>
<script src="javascript/settings.js?v=3" type="text/javascript"></script>

