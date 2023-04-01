const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const csvtojson = require('csvtojson');
const fs = require("fs");
const path = require("path");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/databazeeshop", (req, res) => {
  csvtojson({ headers: ['jmeno', 'prijmeni', 'email', 'ulice', "mesto", "odebrani"] }).fromFile(path.join(__dirname,
    'data/databaze.csv'))
    .then(data => {
      console.log(data);
      res.render('index', { nadpis: "Databáze na eshopu", zapisy: data });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { nadpis: "Chyba v aplikaci", chyba: err });
    });
});
app.post('/savedata', urlencodedParser, (req, res) => {
  let str = `"${req.body.jmeno}","${req.body.prijmeni}","${req.body.email}","${req.body.ulice}","${req.body.mesto}","${req.body.odebrani}"\n`;
  fs.appendFile(path.join(__dirname, 'data/databaze.csv'), str, function (err) {
  if (err) {
       console.error(err);
        return res.status(400).json({
        success: false,
        message: "Objevila se chaby, zkuste znovu"
      });
    }
  });
  res.redirect(301, '/');
});
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.listen(port, () => {
  console.log(`Server funguje ${port}`);
});