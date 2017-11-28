'use strict';

module.exports = function (app)
{
  var coletorController = require('../controllers/coletorController.js');

  app.route('/coletor/senadores')
  .get(coletorController.coletaTweetsSenadores);

  app.route('/coletor/senadores/sem')
  .get(coletorController.coletaTweetsSenadoresSemTweets);

  app.route('/coletor/deputados')
  .get(coletorController.coletaTweetsDeputados);

  app.route('/coletor/deputados/sem')
  .get(coletorController.coletaTweetsDeputadosSemTweets);

  app.route('/coletor/senador/:nomeSenador')
  .get(coletorController.coletaTweetsSenador);

  app.route('/coletor/deputado/:nomeDeputado')
  .get(coletorController.coletaTweetsDeputado);
};
