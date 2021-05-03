const { User } = require('../models');

module.exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const createdUser = await User.create(body);
    res.status(201).send({
      data: createdUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { pagination = {} } = req;
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
      ...pagination,
    });
    res.status(200).send({
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });

    res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const [rowsCount, [updatedUser]] = await User.update(body, {
      where: { id },
      returning: true,
    });

    updatedUser.password = undefined;

    res.send({ data: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserInstance = async (req, res, next) => {
  try {
    const { body, userInstance } = req;

    const updateduserInstance = await userInstance.update(body, {
      returning: true,
    });

    updateduserInstance.password = undefined;

    res.send({ data: updateduserInstance });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const user = await User.findByPk(id);

    const result = await user.destroy();
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};
