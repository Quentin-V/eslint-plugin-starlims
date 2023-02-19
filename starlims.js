const processors = require('./src/processors');
const formsenv = require('./src/envs/forms');
const rules = require('./src/rules');
const configs = require('./src/configs');

module.exports = {
  configs: configs,
  processors: processors,
  environments: {
    forms: formsenv,
  },
  rules: rules,
};