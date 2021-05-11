const _ = require('lodash');

module.exports.checkBody = body =>
  _.pick(body, ['nickname', 'realName', 'originDescription', 'catchPhrase']);
