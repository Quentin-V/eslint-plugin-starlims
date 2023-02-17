module.exports = {
  processors: {
    ".js": {
      // Define the function that preprocesses the code
      preprocess: function(text, filename) {
        // Return the code with the #include statements removed
        text = text.replace(/#include\s+["'].*["']/g, "");
        return [text];
      },
      
      //Define the function that postprocesses the code
      postprocess: function(fileMessages, filename) {
        const starlimsFunctionSuffixes = ['OnLoad', 'OnRowChange', 'OnSelectionChanged'];
        const starlimsFunctionsPrefixes = ['cs'];
        const ignoredMessages = [];
        fileMessages.forEach((messages) => {
          // If there is no messages for this file, return
          if(messages.length === 0) return;
          // If there is messages, loop through them
          messages.forEach(m => {
            if(m.message === 'Parsing error: Unexpected token #include')
              m.message = 'Your include statement seems to be wrong, please use `#include "Category.ScriptName"`'

            // Ignore the no-undef error for Starlims functions having the defined prefixes and suffixes
            if(m.ruleId === 'no-undef') {
              // Check if the message is an undefined prefixed Starlims function
              const hasPrefix = starlimsFunctionsPrefixes.some(prefix => {
                const regex = new RegExp(`^'${prefix}[A-z0-9]*' is not defined.$`);
                return regex.test(m.message);
              })
              // Ignore the message if it has a Starlims function prefix
              if(hasPrefix) ignoredMessages.push(m);
            }

            if(m.ruleId === 'no-unused-vars') {
              // Check if the message is an undefined suffixed Starlims function
              const hasSuffix = starlimsFunctionSuffixes.some(suffix => {
                const regex = new RegExp(`^'[A-z0-9]+_${suffix}' is defined but never used.$`);
                return regex.test(m.message);
              })
              // Ignore the message if it has a Starlims function suffix
              if(hasSuffix) ignoredMessages.push(m);
            }
          });
        });
        
        // Return the messages, filtering out the ignored messages
        return fileMessages.flat().filter(m => !ignoredMessages.includes(m));
      }
    }
  },
  environments: {
    env: {
      // Define the global variables that are available in the code
      globals: {
        lims: true,
        form: true,
        Shell: true,
        Starlims: true,
        System: true,
        Menu: true,
      }
    }
  }
};