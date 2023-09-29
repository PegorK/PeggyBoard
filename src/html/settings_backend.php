<?php
  //==========================================
  // Title:  settings_backend.php
  // Author: Pegor Karoglanian
  // Date:   8/10/23
  // Notes:  All ajax calls for main panel get routed through here.
  //==========================================

  // Call function depending on what frontend wants.
  if(isset($_POST['function']) && !empty($_POST['function'])) {
    $function = $_POST['function'];
    if(isset($_POST['parameter']) && !empty($_POST['parameter'])) {
      $parameter = $_POST['parameter'];
    }
    if(isset($_POST['parameter2']) && !empty($_POST['parameter2'])) {
      $parameters2 = $_POST['parameter2'];
    }
    switch($function) {
        case 'updateSystem': updateSystem(); break;
        case 'getVersion': getVersion(); break;
        case 'getAvailableWifi': getAvailableWifi();break;
        case 'refreshAvailableWifi': refreshAvailableWifi();break;
        case 'connectToWifi': connectToWifi($parameter);break;
        case 'getCurrentWifi': getCurrentWifi(); break;
        case 'getCurrentIp': getCurrentIp(); break;
        case 'checkOnline': checkOnline(); break;
        case 'systemReboot': systemReboot(); break;
        case 'systemShutdown': systemShutdown(); break;
    }
  }

  function updateSystem() {
    $command = escapeshellcmd('sudo ../custom_scripts/runRoot.sh doUpdate');
    $output = shell_exec($command);
    echo $output;
  }

  function getVersion() {
    $command = escapeshellcmd('sudo ../custom_scripts/runRoot.sh getVersion');
    $output = shell_exec($command);
    echo $output;
  }

  function getAvailableWifi() {
    $command = escapeshellcmd('cat ../custom_scripts/wifiNames.json');
    $output = shell_exec($command);
    echo json_encode($output);
  }

  function refreshAvailableWifi() {
    $command = escapeshellcmd('sudo ../custom_scripts/runRoot.sh updateWifiList');
    $output = shell_exec($command);
    echo $output;
  }

  function connectToWifi($options) {
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh loginWifi \"$options[ssid]\" \"$options[bssid]\" \"$options[psk]\"");
    $output = shell_exec($command);
    echo $output;
  }

  function getCurrentWifi() {
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh getWifi");
    $output = shell_exec($command);
    echo $output;
  }

  function getCurrentIp() {
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh getIp");
    $output = shell_exec($command);
    echo $output;
  }

  function checkOnline() {
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh checkOnline");
    $output = shell_exec($command);
    echo $output;
  }

  function systemReboot() {
    system("sudo ../custom_scripts/runRoot.sh systemReboot");
    echo "Done";
  }

  function systemShutdown() {
    system("sudo ../custom_scripts/runRoot.sh systemShutdown");
    echo "Done";
  }
?>
