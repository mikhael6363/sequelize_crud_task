const router = require('express').Router();
const heroRouter = require('./superhero');
const powerRouter = require('./superpower');

router.use('/superheroes', heroRouter);
router.use('/superpowers', powerRouter);

module.exports = router;
