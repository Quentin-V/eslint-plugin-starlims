const RuleTester = require('eslint').RuleTester;
const rule = require('../../src/rules/check-unconverted-functions');
const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
    }
});
const { expect } = require('chai');

expect(() => {
    ruleTester.run('check-unconverted-functions', rule, {
        valid: [
            'lims.CallServerAsync()',
            'const a = "Ahh"; console.log(a.length);',
            'parseInt("123")',
        ],
        invalid: [
            {
                name: 'Convert.ToInt32() to parseInt()',
                code: `Convert.ToInt32("123")`,
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'parseInt'.`,
                    type: 'CallExpression'
                }],
                output: `parseInt("123")`
            },
            {
                name: 'Convert.ToInt32() to parseInt() with variable',
                code: `Convert.ToInt32(sNumber)`,
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'parseInt'.`,
                    type: 'CallExpression'
                }],
                output: `parseInt(sNumber)`
            },
            {
                name: 'lims.AAdd() to array.push()',
                code: 'lims.AAdd(arr, 1)',
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'arr.push(1)'.`,
                    type: 'CallExpression'
                }],
                output: `arr.push(1)`
            },
            {
                name: 'lims.AAdd() to array.push() with multiple arguments',
                code: 'lims.AAdd(arr, 1, 2, 3)',
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'arr.push(1, 2, 3)'.`,
                    type: 'CallExpression'
                }],
                output: 'arr.push(1, 2, 3)'
            },
            {
                name: 'lims.AAdd() to array.push() with variable',
                code: 'lims.AAdd(arr, 1, 2, 3)',
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'arr.push(1, 2, 3)'.`,
                    type: 'CallExpression'
                }],
                output: 'arr.push(1, 2, 3)'
            },
            {
                name: 'lims.AAdd() to array.push() with variable and values',
                code: 'lims.AAdd(arr, one, 2, 3)',
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'arr.push(one, 2, 3)'.`,
                    type: 'CallExpression'
                }],
                output: 'arr.push(one, 2, 3)'
            },
            {
                name: 'int() to parseInt()',
                code: 'int(3)',
                errors: [{
                    message: `This function is a legacy function, in HTML you should use 'parseInt'.`,
                    type: 'CallExpression'
                }],
                output: 'parseInt(3)'
            }
        ]
    });
}).to.not.throw();
