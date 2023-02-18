const processors = require("./src/processors");
const formsenv = require("./src/envs/forms");
const rules = require("./src/rules");

module.exports = {
  processors: processors,
  environments: {
    forms: formsenv,
  },
  rules: rules,
};