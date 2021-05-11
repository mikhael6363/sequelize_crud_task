const { Image, Superhero } = require('../models');
const createError = require('http-errors');

module.exports.createImage = async (req, res, next) => {
  try {
    const {
      file: { filename },
      params: { heroId },
    } = req;

    const image = await Image.create({
      name: filename,
      superheroId: heroId,
    });

    if (!image) {
      return next(createError(400));
    }

    res.send(image);
  } catch (err) {
    next(err);
  }
};

module.exports.getHeroImages = async (req, res, next) => {
  try {
    const {
      params: { heroId },
      pagination = {},
    } = req;

    const images = await Image.findAll({
      where: { id: heroId },
      ...pagination,
    });

    if (!images.length) {
      return next(createError(404));
    }

    res.send({ data: images });
  } catch (err) {
    next(err);
  }
};

module.exports.addHeroImages = async (req, res, next) => {
  try {
    const {
      params: { heroId },
      files,
    } = req;

    const images = files.map(file => ({ path: file, heroId }));
    const newImages = await Image.bulkCreate(images, {
      returning: true,
    });

    res.status(201).send({ data: newImages });
  } catch (err) {
    next(err);
  }
};

module.exports.getImage = async (req, res, next) => {
  try {
    const {
      params: { heroId, imageId },
    } = req;

    const image = await Image.findOne({
      where: { heroId, id: imageId },
    });

    if (!image) {
      return next(createError(404));
    }

    res.status(200).send({ data: image });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteImage = async (req, res, next) => {
  try {
    const {
      params: { heroId, imageId },
    } = req;

    const rowsCount = await Image.destroy({
      where: { heroId, id: imageId },
    });

    if (rowsCount === 0) {
      return next(createError(404));
    }

    res.status(200).send({ data: rowsCount });
  } catch (err) {
    next(err);
  }
};
