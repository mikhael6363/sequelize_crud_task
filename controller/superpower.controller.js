const createError = require('http-errors');
const { Superpower, Superhero } = require('../models');

module.exports.createSuperpower = async (req, res, next) => {
  try {
    const { body } = req;

    const createdSuperpower = await Superpower.create(body);

    if (!createdSuperpower) {
      return next(createError(400));
    }

    res.status(201).send({ data: createdSuperpower });
  } catch (err) {
    next(err);
  }
};

module.exports.getSuperpowers = async (req, res, next) => {
  try {
    const { pagination = {} } = req;

    const superpowers = await Superpower.findAll({
      ...pagination,
    });

    if (!superpowers.length) {
      return next(createError(404, `Superpowers don't exist!`));
    }

    res.status(200).send({ data: superpowers });
  } catch (err) {
    next(err);
  }
};

module.exports.getSuperpower = async (req, res, next) => {
  try {
    const {
      params: { powerId },
    } = req;

    const superpower = await Superpower.findByPk(powerId);

    if (!superpower) {
      return next(createError(404, `Superpower doesn't exist!`));
    }

    res.send({ data: superpower });
  } catch (err) {
    next(err);
  }
};

module.exports.updateSuperpower = async (req, res, next) => {
  try {
    const {
      body,
      params: { powerId },
    } = req;

    const [rowsCount, [updatedSuperpower]] = await Superpower.update(body, {
      where: { id: powerId },
      returning: true,
    });

    if (rowsCount !== 1) {
      return next(createError(400));
    }

    res.send({ data: updatedSuperpower });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSuperpower = async (req, res, next) => {
  try {
    const {
      params: { powerId },
    } = req;

    const rowsCount = await Superpower.destroy({
      where: { id: powerId },
    });

    if (rowsCount !== 1) {
      return next(createError(404, `Superpower doesn't exist!`));
    }

    res.send({ data: rowsCount });
  } catch (err) {
    next(err);
  }
};

//----------------------------------------------------------------------

module.exports.addPowerToHero = async (req, res, next) => {
  try {
    const {
      params: { heroId },
      body: { powerId },
    } = req;

    const superhero = await Superhero.findByPk(heroId);
    const superpower = await Superpower.findByPk(powerId);

    await superhero.addSuperpower(superpower);

    const heroWithPowers = await Superhero.findByPk(heroId, {
      include: [
        {
          model: Superpower,
          through: {
            attributes: [['name', 'power']],
          },
        },
      ],
    });

    if (!heroWithPowers) {
      return next(createError(404));
    }

    res.send({ data: heroWithPowers });
  } catch (err) {
    next(err);
  }
};

module.exports.getHeroPowers = async (req, res, next) => {
  try {
    const {
      params: { heroId },
    } = req;

    const heroWithPowers = await Superhero.findAll({
      where: { id: heroId },
      include: [
        {
          model: Superpower,
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!heroWithPowers) {
      return next(createError(404));
    }

    res.send(heroWithPowers);
  } catch (err) {
    next(err);
  }
};
