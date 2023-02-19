module.exports = {
    'plugins': [
        'mocha',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:node/recommended',
        'plugin:mocha/recommended'
    ],
    'parserOptions': {
        // Only ESLint 6.2.0 and later support ES2020.
        'ecmaVersion': 2020
    },
    'rules': {
        'node/no-unpublished-require': 'off',
        'mocha/no-mocha-arrows': 'off',
        'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'dot-notation': 'warn',
    }
}
