<?php

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
        case 'setLeds'  : setLeds($parameter);break;
        case 'clearLeds': clearAll();break;
        case 'saveRoute': saveRoute($parameter); break;
        case 'getRoutes': getRoutes($parameter, $parameters2); break;
        case 'deleteRoute': deleteRoute($parameter); break;
        case 'getVersion': getVersion(); break;
    }
  }

  function setLeds ($leds){
    $problem =  base64_encode(($leds));
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh doLed PROBLEM $problem");
    $output = shell_exec($command);
    echo $output;
  }

  function clearAll () {
    $command = escapeshellcmd("sudo ../custom_scripts/runRoot.sh doLed CLEAR 0");
    $output = shell_exec($command);
    echo $output;
  }

  function saveRoute($options){
    // build the sql request
    if(strlen($options['name'])>24 || strlen($options['author'])>24) {
      echo json_encode("Error: input too big.");
      echo json_encode(-1);
      return false;
    }

    $sql = "INSERT INTO `routes` (`routename`, `grade`, `author`, `holds`) VALUES ('$options[name]', '$options[grade]', '$options[author]', '$options[problem]')";
    // send the sql request
    $db = openDatabase();
    if ($db ->connect_error) {
      echo ("ERROR: Could not open database!");
    } else {
      if ($db->query($sql) === TRUE) {
        echo json_encode($db->insert_id);
      } else {
        echo json_encode(-1);
      }
      $db->close();
    }
  }

  // Not a good idea to store password here!
  // But for fun and demonstration purposes it'll do :) 
  function openDatabase() {
    $servername = "localhost";
    $username = "master";
    $password = "climbhard";
    $dbname = "peggyboardDB";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    return $conn;
  }

  function getRoutes($sortType = "GRADE", $sortOrd = "ASC") {
    switch($sortType) {
      case "NAME" : $sortType = "routename"; break;
      case "GRADE" : $sortType = "grade"; break;
      case "DATE" : $sortType = "date"; break;
      default: $sortType = "routename";
    }
    switch($sortOrd) {
      case "ASC" : $sortOrd = "ASC"; break;
      case "DESC" : $sortOrd = "DESC"; break;
      default: $sortOrd = "ASC";
    }

    $db = openDatabase();
    if ($db ->connect_error) {
      echo ("ERROR: Could not open database!");
    } else {
      $i = 0;
      $sql = "SELECT id, routename, grade, author, date, holds FROM routes ORDER BY $sortType $sortOrd";
      $res = $db->query($sql);
      while ($row = $res->fetch_array(MYSQLI_ASSOC)) {
          $jsonObj = new stdClass();//create a new 
          $jsonObj->id = $row['id'];
          $jsonObj->name = $row['routename'];
          $jsonObj->grade = $row['grade'];
          $jsonObj->author = $row['author'];
          $jsonObj->date = $row['date'];
          $jsonObj->holds = $row['holds'];

          $climbs[$i] = json_encode($jsonObj);
          $i++;
      }
      if (is_null($climbs) == false) {
        echo json_encode($climbs);
      }
      $db->close();
    } else {
      echo ("ERROR: Could not retrieve climbs!");
    }
  }

  function deleteRoute($routeId) {
    $sql = "DELETE FROM `routes` WHERE id=$routeId";
    // send the sql request
    $db = openDatabase();
    if ($db ->connect_error) {
      echo ("ERROR: Could not open database!");
    } else {
      if ($db->query($sql) === TRUE) {
        echo json_encode("True");
      } else {
        echo json_encode("False");
      }
      $db->close();
    }
  }

  function getVersion() {
    $command = escapeshellcmd('sudo ../custom_scripts/runRoot.sh getVersion');
    $output = shell_exec($command);
    echo $output;
  }
?>
