var express = require ("express");
var app = express();

var port = process.env.PORT || 3000;
app.listen(port);

var routes = require('./api/routes/deputadosRoutes.js');
routes(app);

console.log("API na porta "+ port);
