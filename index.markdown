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
    <button onclick="submit()">Submit</button>

    <script>
      const firstDay = new Date(2020, 4, 22);
      const numDays = 14;
    </script>

    <script src="{{ site.baseurl }}/assets/js/main.js"></script>
  </body>
</html>
