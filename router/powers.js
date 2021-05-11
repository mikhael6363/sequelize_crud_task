const powerRouter = require('express').Router({ mergeParams: true });
const PowerController = require('../controller/superpower.controller');

powerRouter
  .route('/')
  .get(PowerController.getHeroPowers)
  .post(PowerController.addPowerToHero);

powerRouter.delete('/:powerId', PowerController.deleteSuperpower);

module.exports = powerRouter;