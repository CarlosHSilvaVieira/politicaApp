var express = require ("express");
var app = express();

const body_parser = require('body-parser');
app.use(body_parser.json());

var port = process.env.PORT || 3000;
app.listen(port);

var routes = require('./api/routes/deputadosRoutes.js');
routes(app);

console.log("API na porta "+ port);
