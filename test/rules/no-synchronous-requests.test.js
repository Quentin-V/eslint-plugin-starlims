const RuleTester = require('eslint').RuleTester;
const rule = require('../../src/rules/no-synchronous-requests');
const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
    }
});
const { expect } = require('chai');

expect(() => {
    ruleTester.run('no-synchronous-requests', rule, {
        valid: [
            'lims.CallServerAsync()',
            'lims.GetDataSetAsync()',
            'lims.GetDataAsync()',
        ],
        invalid: [
            {
                name: 'In async function',
                code: `
                    async function testCS() { lims.CallServer(); }
                    async function testGDS() { lims.GetDataSet(); }
                    async function testGD() { lims.GetData(); }
                `,
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                },
                {
                    message: 'Avoid synchronous requests (GetDataSet), consider using async/await with an async function (lims.GetDataSetAsync)',
                    type: 'CallExpression'
                },
                {
                    message: 'Avoid synchronous requests (GetData), consider using async/await with an async function (lims.GetDataAsync)',
                    type: 'CallExpression'
                }],
                output: `
                    async function testCS() { await lims.CallServerAsync(); }
                    async function testGDS() { await lims.GetDataSetAsync(); }
                    async function testGD() { await lims.GetDataAsync(); }
                `
            },
            {
                name: 'In synchronous function',
                code: `
                    function testCA() { lims.CallServer(); }
                    function testGDS() { lims.GetDataSet(); }
                    function testGD() { lims.GetData(); }
                `,
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                },
                {
                    message: 'Avoid synchronous requests (GetDataSet), consider using async/await with an async function (lims.GetDataSetAsync)',
                    type: 'CallExpression'
                },
                {
                    message: 'Avoid synchronous requests (GetData), consider using async/await with an async function (lims.GetDataAsync)',
                    type: 'CallExpression'
                }],
                output: `
                    async function testCA() { await lims.CallServerAsync(); }
                    async function testGDS() { await lims.GetDataSetAsync(); }
                    async function testGD() { await lims.GetDataAsync(); }
                `
            },
            {
                name: 'Outside function',
                code: 'lims.CallServer();',
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                }],
                output: 'lims.CallServerAsync();'
            },
            {
                name: 'In async function, already with await',
                code: 'async function test() { await lims.CallServer(); }',
                errors: [{
                    message: 'Avoid synchronous requests (CallServer), consider using async/await with an async function (lims.CallServerAsync)',
                    type: 'CallExpression'
                }],
                output: 'async function test() { await lims.CallServerAsync(); }'
            }
        ]
    });
}).to.not.throw();
