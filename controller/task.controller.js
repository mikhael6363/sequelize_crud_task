const { Task } = require('../models');

module.exports.createTask = async (req, res, next) => {
  try {
    const { body, userInstance } = req;

    const task = await userInstance.createTask(body);

    res.send({ data: task });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserTasks = async (req, res, next) => {
  try {
    const { userInstance } = req;

    const tasks = await userInstance.getTasks();

    res.send({ data: tasks });
  } catch (err) {
    next(err);
  }
};

module.exports.updateTask = async (req, res, next) => {
  try {
    const {
      params: { taskId },
      body,
    } = req;

    const values = checkBody(body);

    const [count, [updatedTask]] = await Task.update(values, {
      where: { id: taskId },
      returning: true,
    });

    res.send({ data: updatedTask });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTask = async (req, res, next) => {
  try {
    const {
      params: { taskId },
    } = req;

    const deletedTask = await Task.destroy({ where: { id: taskId } });

    res.send({ data: deletedTask });
  } catch (err) {
    next(err);
  }
};
