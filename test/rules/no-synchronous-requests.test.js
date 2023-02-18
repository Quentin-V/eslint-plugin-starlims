const RuleTester = require('eslint').RuleTester;
const rule = require('../../src/rules/no-synchronous-requests');
const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
    }
});
const { expect } = require("chai");

expect(() => {
    ruleTester.run('no-synchronous-requests', rule, {
        valid: [
            'lims.CallServerAsync()',
            'lims.GetDataSetAsync()',
            'lims.GetDataAsync()',
        ],
        invalid: [
            {
                code: 'async function test() { lims.CallServer() }',
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.CallServerAsync() }'
            },
            {
                code: 'async function test() { lims.GetDataSet(); }',
                errors: [{
                    message: 'Avoid synchronous requests (GetDataSet), consider using async/await with an async function (lims.GetDataSetAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.GetDataSetAsync(); }'
            },
            {
                code: 'async function test() { lims.GetData(); }',
                errors: [{
                    message: 'Avoid synchronous requests (GetData), consider using async/await with an async function (lims.GetDataAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.GetDataAsync(); }'
            },
            {
                code: 'function test() { lims.CallServer(); }',
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.CallServerAsync(); }'
            },
            {
                code: 'function test() { lims.GetDataSet(); }',
                errors: [{
                    message: 'Avoid synchronous requests (GetDataSet), consider using async/await with an async function (lims.GetDataSetAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.GetDataSetAsync(); }'
            },
            {
                code: 'function test() { lims.GetData(); }',
                errors: [{
                    message: 'Avoid synchronous requests (GetData), consider using async/await with an async function (lims.GetDataAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.GetDataAsync(); }'
            }
        ]
    });
}).to.not.throw();
