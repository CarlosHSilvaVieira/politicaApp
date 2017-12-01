'use strict';

module.exports = function (app)
{
  var senadoresController = require('../controllers/senadoresController.js');

  app.route('/senadores')
  .get(senadoresController.getAllSenadores);

  app.route('/senadores/rank/:quant')
  .get(senadoresController.rank);

  app.route('/senador/analise/:nomeSenador')
  .get(senadoresController.analiseSentimento);

  app.route('/senador/tweets/:nomeSenador')
  .get(senadoresController.getTweets);

  app.route('/senador/:nomeSenador')
  .get(senadoresController.getSenador);
};
