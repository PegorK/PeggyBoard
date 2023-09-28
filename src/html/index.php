<?php
require "main_backend.php";

// HTML ?>
<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1.0,  minimum-scale=1.0, user-scalable=no">  
  <head>
    <title>
      PeggyBoard
    </title>
    <link href="css/main.css?v=1" rel="stylesheet">
    <script src="jquery/jquery.min.js" type="text/javascript"></script>
    <script src="javascript/swipe-event.js" type="text/javascript"></script>
  </head>
  <body>
    <!-- Save form only visible when saving. -->
    <div class="saveFormBg" id="saveFormBg">
      <div class="saveForm" id="saveForm">
        <div class="saveForm-container">
          <div class="saveForm-container-status" id="saveFormStatus"></div>
          <h1 style="text-align:center">Save Route</h1>

          <label for="routeName"><b>Route Name</b></label>
          <input type="text" id="routeName" placeholder="Enter Name" name="routeName" maxlength="24" required>

          <label for="routeGrade"><b>Grade</b></label>
          <select name="routeGrade" id="routeGrade" required>
            <option value="0">V0</option>
            <option value="1">V1</option>
            <option value="2">V2</option>
            <option value="3">V3</option>
            <option value="4">V4</option>
            <option value="5">V5</option>
            <option value="6">V6</option>
            <option value="7">V7</option>
            <option value="8">V8</option>
            <option value="9">V9</option>
            <option value="10">V10</option>
            <option value="11">V11</option>
            <option value="12">V12</option>
            <option value="13">V13</option>
            <option value="14">V14</option>
            <option value="15">V15</option>
          </select>

          <label for="routeAuthor"><b>Author</b></label>
          <input type="text" id="routeAuthor" placeholder="Author Name" name="routeAuthor"  maxlength="24" required>

          <button type="submit" class="btn" onclick="saveRoute()">Save</button>
          <button type="submit" class="btn cancel" onclick="closeSaveForm()">Close</button>
        </div>
      </div>
    </div>
    <div class="saveFormBg" id="aboutPage">
      <div class="saveForm">
        <div class="saveForm-container">
        <p>PeggyBoard is an interactive climbing wall powered by a Raspberry Pi.</p>
        <p>This project is open source and can be found on <a href="https://github.com/PegorK/PeggyBoard">GitHub</a>.</p>
        <p>Enjoy and get stronk!!</p>
        <p>Developed by Pegor Karoglanian (devPegor@gmail.com) July 2020</p>
        <p>~Product of the Coronavirus~</p>
        <button type="submit" class="btn cancel" onclick="openAbout(false)">Close</button>
        </div>
      </div>
    </div>
    <div id="mainScreen">
      <div class="headerArea">
        <div class="logoText"></div>
      </div>
      <div id="interactionArea" class="wallLayoutArea">
        <div class="nameArea">
          <!-- only visible if a saved route is selected -->
          <span id="selectedRouteName"></span>
        </div>
        <div id="messageArea" class="messageArea" hidden>
          <span id="displayMessage"></span>
        </div>
        <!-- Table is Generated -->
      </div>
      <div id="tableOfClimbs" class="wallLayoutArea" hidden>
        <div id="searchAndSort" class="searchAndSort">
          <span class="searchIcn"></span>
          <input type="text" id="searchBar" oninput="searchForRoute()"/>
        </div>
        <div id="climbsTable" class="climbsTable">
          <!-- Content is Generated -->
        </div>
      </div>
      <div id="footerArea" class="footerArea">
      <div class="bottomButtons">
        <div class="dropup">
          <span id="menuButton" class="menuIcn" onclick="toggleMenuSelection()"></span>
          <div id="menuItems" class="dropup-content">
            <a class="menuItem" onclick="openAbout(true)">About</a>
          </div>
        </div>
        <span id="loadIcn" class="loadIcn" onclick="toggleLoadSelection()"></span>
        <span class="lightIcn" onclick="lightCurrent()"></span>
        <span class="saveIcn" onclick="openSaveForm()"></span>
        <span class="clearIcn" onclick="clearAll()"></span>
      </div>
      </div>
      <div class="versionNumber" id="versionDiv"></div>
  </div>
  </body>
</html>
<script src="javascript/peggyboard.js?v=1" type="text/javascript"></script>