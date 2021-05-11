const createError = require('http-errors');
const { Superhero, Superpower, Image } = require('../models');
const { checkBody } = require('../utils/checkBody');

module.exports.createSuperhero = async (req, res, next) => {
  try {
    const { body, files } = req;
    const values = checkBody(body);

    const createdSuperhero = await Superhero.create(values);

    if (!createdSuperhero) {
      return next(createError(400));
    }

    if (files?.length) {
      const images = files.map(file => ({
        path: file.filename,
        heroId: createdSuperhero.id,
      }));
      await Image.bulkCreate(images, {
        returning: true,
      });
    }

    if (body?.superpowers?.length) {
      const powers = body.superpowers.map(power => ({
        name: power,
        heroId: createdSuperhero.id,
      }));

      await SuperPower.bulkCreate(powers, {
        returning: true,
      });
    }

    const heroWithData = await Superhero.findAll({
      where: {
        id: createdSuperhero.id,
      },
      include: [
        {
          model: Superpower,
          attributes: ['id', 'name'],
          as: 'superPowers',
        },
        {
          model: Image,
          attributes: ['id', 'path'],
          as: 'images',
        },
      ],
    });

    res.status(201).send({ data: heroWithData });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllSuperheroes = async (req, res, next) => {
  try {
    const { pagination = {} } = req;

    const superheroes = await Superhero.findAll({
      ...pagination,
    });

    if (!superheroes.length) {
      return next(createError(404, `Superheroes don't exist!`));
    }

    res.status(200).send({ data: superheroes });
  } catch (err) {
    next(err);
  }
};

module.exports.getSuperhero = async (req, res, next) => {
  try {
    const {
      params: { heroId },
    } = req;

    const superhero = await Superhero.findByPk(heroId);

    if (!superhero) {
      return next(createError(404, `Superhero doesn't exist!`));
    }

    res.send({ data: superhero });
  } catch (err) {
    next(err);
  }
};

module.exports.updateSuperhero = async (req, res, next) => {
  try {
    const {
      body,
      params: { heroId },
    } = req;

    const values = checkBody(body);

    const [rowsCount, [updatedSuperhero]] = await Superhero.update(values, {
      where: { id: heroId },
      returning: true,
    });

    if (rowsCount !== 1) {
      return next(createError(400));
    }

    res.send({ data: updatedSuperhero });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSuperhero = async (req, res, next) => {
  try {
    const {
      params: { heroId },
    } = req;

    const rowsCount = await Superhero.destroy({
      where: { id: heroId },
    });

    if (rowsCount !== 1) {
      return next(createError(404, `Superhero doesn't exist!`));
    }

    res.send({ data: rowsCount });
  } catch (err) {
    next(err);
  }
};
