const express = require('express');
const app = express();
const path = require('path');

// ... other app configurations ...

app.get('/timetable', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'timetable.html'));
});

// ... other routes and app.listen() ...
