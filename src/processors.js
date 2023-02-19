const starlimsFunctionSuffixes = [
  'OnInit',
  'OnLoad',
  'OnShow',
  'OnClose',
  'OnRowChange',
  'OnSelectionChanged',
  'OnClick',
  'OnContextMenuPopup',
  'OnCheckedChanged',
  'OnTabChanged',
];
const starlimsFunctionsPrefixes = ['cs', 'ESIG_', 'Audit_'];

const includeRegex = /(#include\s+.*)$/gm;

let offset = 0;

module.exports = {
  '.js': {
    supportsAutofix: true,
    // Define the function that preprocesses the code
    preprocess: function (text) {
      // Return the code with the #include statements changed to comments
      offset = text.match(includeRegex)?.length * 2;
      return [text.replaceAll(includeRegex, '//$1')];
    },

    //Define the function that postprocesses the code
    postprocess: function (fileMessages) {
      const ignoredMessages = [];
      fileMessages.forEach((messages) => {
        // If there is no messages for this file, return
        if (messages.length === 0) return;
        // If there is messages, loop through them
        messages.forEach((m) => {
          if(m.fix) m.fix.range = m.fix.range.map(r => r - offset)
          // Ignore the no-undef error for Starlims functions having the defined prefixes and suffixes
          if (m.ruleId === 'no-undef') {
            // Check if the message is an undefined prefixed Starlims function
            const hasPrefix = starlimsFunctionsPrefixes.some((prefix) => {
              const regex = new RegExp(
                `^'${prefix}[A-z0-9]*' is not defined.$`
              );
              return regex.test(m.message);
            });
            // Ignore the message if it has a Starlims function prefix
            if (hasPrefix) ignoredMessages.push(m);
          }

          if (m.ruleId === 'no-unused-vars') {
            // Check if the message is an undefined suffixed Starlims function
            const hasSuffix = starlimsFunctionSuffixes.some((suffix) => {
              const regex = new RegExp(
                `^'[A-z0-9]+_${suffix}' is defined but never used.$`
              );
              return regex.test(m.message);
            });
            // Ignore the message if it has a Starlims function suffix
            if (hasSuffix) ignoredMessages.push(m);
          }
        });
      });

      // Return the messages, filtering out the ignored messages
      return fileMessages.flat().filter((m) => !ignoredMessages.includes(m));
    },
  },
  starlimsFunctionsPrefixes,
  starlimsFunctionSuffixes
};
