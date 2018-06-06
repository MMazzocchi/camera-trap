var join = require("path").join;
var express = require("express");
var app = express();
var http = require("http").Server(app);

const PORT = 9221;
const HOST = "0.0.0.0";

app.use("/", express.static(join(__dirname, "client")));

http.listen(PORT, HOST, function() {
  console.log("Listening on "+HOST+": "+PORT);
});
