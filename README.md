# Starlims ESLint Plugin
### This plugin provides custom rules for Starlims.

## How to use
### Installation
- Create a new project with `npm init` in the root folder of your Starlims project
- Install ESLint with npm: `npm install eslint --save-dev`
- Install the plugin with npm: `npm install eslint-plugin-starlims --save-dev`
- Create a new file named `.eslintrc.js` in the root folder of your Starlims project
- Add the following content to the file:
```js
module.exports = {
    "plugins": ['starlims'],
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        'starlims/env': true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}

```
You can customize your ESLint configuration as you wish. For more information, please refer to the [ESLint documentation](https://eslint.org/docs/user-guide/configuring).

You should now be able to use the plugin in your Starlims project.

### Usage   
Use the following command to lint your Starlims project:
```bash
npx eslint .
```
You can also install the ESLint extension for Visual Studio Code to get real-time linting. [ESLint extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## List of customizations
- Do not create parsing errors for #include statements
- Allow usage of Starlims global variables such as:
    - 'form'
    - 'lims'
    - 'Shell'
    - 'Starlims'

## Contributing
Any contributions are welcome. Please follow the steps below to contribute:
- Fork the repository
- Create a new branch
- Make your changes
- Create a pull request

If you have any questions or suggestions, please contact me at quentin.vauthier@starlims.com or create an issue.

### Future plans
- Add warnings rules for functions that are not recommended to use
- Add more rules for Starlims specific code
- Add more global variables