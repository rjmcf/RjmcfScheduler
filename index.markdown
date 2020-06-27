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

    <input type="button" value="Submit" onclick="submit()" id="submitButton"/>
    <p id="emailReport"></p>

    <script>
      const firstDay = new Date(2020, 5, 28);
      const numDays = 12;
      const dayIndicesToSkip = [1, 3, 10];
      const disableEmails = false;
      const printToConsole = true;
    </script>

    <!-- Script allows me to send emails using frontend js only -->
    <script src="https://smtpjs.com/v3/smtp.js"></script>  
    <script src="{{ site.baseurl }}/assets/js/main.js"></script>
  </body>
</html>
