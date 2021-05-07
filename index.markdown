---
layout: page
---
<html>
  <head>
    <link href="css/common.css" rel="stylesheet">
  </head>
  <body>   

  <p style = "margin-bottom: 1cm">
    Enter Name
    <input type = "text" id = "nameInput">
  </p>

  <div class="table-wrapper">
    <table style="table-layout:fixed; min-width:800px;" id="dateTable">
      <tr>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
        <th>Sun</th>
      </tr>
    </table>
  </div>

  <div>
    <label for="comments">Comments:</label>
    <div>
      <textarea id="comments" name="comments" rows="5" style="width: 100%; max-width: 100%;"></textarea>
    </div>
  </div>

    <input type="button" value="Submit" onclick="submit()" id="submitButton"/>
    <p id="emailReport"></p>

    <!-- Dialog to allow users to duplicate days -->
    <div id="duplicateDayModal" class="modal">
      <div class="modal-content">
        <span id="duplicateDayModalCloseButton" class="close">&times;</span>
        <div id="duplicateDayModalContent">
        </div>
      </div>
    </div>

    <script>
      const firstDay = new Date(2021, 4, 10);
      const numDays = 14;
      const dayIndicesToSkip = [];
      const disableEmails = false;
      const printToConsole = true;
    </script>

    <!-- Script allows me to send emails using frontend js only -->
    <script src="https://smtpjs.com/v3/smtp.js"></script>  
    <script src="{{ site.baseurl }}/assets/js/main.js"></script>
  </body>
</html>
