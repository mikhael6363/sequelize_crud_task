module.exports = async (err, req, res, next) => {
  const code = err.status || 500;
  res.status(code).send({
    errors: [{ message: err || 'Server error' }],
  });
};
