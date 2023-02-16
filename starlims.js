module.exports = {
  processors: {
    "js": {
      // Define the function that preprocesses the code
      preprocess: function(text, filename) {
        // Return the code with the #import statements removed
        text = text.replace(/#import\s+["'].*["']/g, "");
        return [text];
      },
      
      //Define the function that postprocesses the code
      postprocess: function(problem, filename) {
        if(problem[0].length === 0) return problem[0];
        if(problem[0][0].message && problem[0][0].message === 'Parsing error: Unexpected token #import') problem[0][0].message = 'Your import statement seems to be wrong, please use `#import "Category.ScriptName"`'
        return problem[0];
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
      }
    }
  }
};