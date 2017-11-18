'use strict';

module.exports = function (app)
{
  var coletorController = require('../controllers/coletorController.js');

  app.route('/senador/:nomeSenador')
  .get(coletorController.coletaTweetsSenador);

  app.route('/deputado/:nomeDeputado')
  .get(coletorController.coletaTweetsDeputado);
};
