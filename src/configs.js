module.exports = {
    default: {
        env: {
            'browser': true,
            'commonjs': true,
            'es2021': true,
            '@quintaaa/starlims/forms': true
        },
        extends: 'eslint:recommended',
        parserOptions: {
            'ecmaVersion': 'latest'
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
            'prefer-const': 'warn',
            'dot-notation': 'warn',
            '@quintaaa/starlims/no-synchronous-requests': 'warn',
            '@quintaaa/starlims/check-server-functions': 'warn',
            '@quintaaa/starlims/check-unconverted-functions': 'error',
        }
    },
};