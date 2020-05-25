---
layout: page
---
<html>
  <head>
    <link href="css/common.css" rel="stylesheet">
  </head>
  <body>   

    <table style="table-layout:fixed;width:100%" id="dateTable">
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

    Enter Name <input type = "text" id = "nameInput">
    <br>
    <!--<form method="post">-->
		<input type="button" value="Submit" onclick="submit()"/>
	<!--</form>-->

    <script>
      const firstDay = new Date(2020, 4, 22);
      const numDays = 14;
      const dayIndicesToSkip = [0,1,2,3,4,5,6,7,8,9,10];
      const testing = false;
    </script>

    <!-- Script allows me to send emails using frontend js only -->
    <script src="https://smtpjs.com/v3/smtp.js"></script>  
    <script src="{{ site.baseurl }}/assets/js/main.js"></script>
  </body>
</html>
