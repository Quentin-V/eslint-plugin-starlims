const processors = require("./src/processors");
const starlimsenv = require("./src/envs/forms");
const rules = require("./src/rules");

module.exports = {
  processors: processors,
  environments: {
    forms: starlimsenv,
  },
  rules: rules,
};