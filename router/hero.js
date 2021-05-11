
const heroRouter = require('express').Router();
const imageRouter = require('./image');
const powerRouter = require('./powers');
const HeroController = require('../controller/superhero.controller');
const { uploadImages } = require('../middlewares/file.upload');
const paginate = require('../middlewares/paginate.mw');

heroRouter
  .route('/')
  .get(paginate, HeroController.getAllSuperheroes)
  .post(uploadImages, HeroController.createSuperhero);

heroRouter
  .route('/:heroId')
  .get(HeroController.getSuperhero)
  .put(HeroController.updateSuperhero)
  .delete(HeroController.deleteSuperhero);

heroRouter.use('/:heroId/images/', imageRouter);
heroRouter.use('/:heroId/powers/', powerRouter);

module.exports = heroRouter;