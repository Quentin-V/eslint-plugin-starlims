const RuleTester = require('eslint').RuleTester;
const rule = require('../../src/rules/check-server-functions');
const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
    }
});
const { expect } = require("chai");

expect(() => {
    ruleTester.run('check-server-functions source and params', rule, {
        valid: [
            'alert("Nothing to see here")',
            'console.log("Nothing to see here")',
            'lims.GetDataSource("Categ.Name")',
            'lims.GetDataSource("Categ.Name", [1, 2, 3])',
            'lims.CallServer("Categ.Name", [1, 2, 3], true)',
            'const source = "Categ.Name"; lims.CallServer(source)',
            'const source = "Categ.Name"; lims.CallServer(source, [1, 2, 3])',
            'const source = "Categ.Name"; lims.CallServer(source, [1, 2, 3], true)',
            'const source = "Categ.Name"; const copySource = source; lims.CallServer(copySource)',
            'const source = "Categ.Name"; const copySource = source; lims.CallServer(copySource, [1, 2, 3])',
            'const source = "Categ.Name"; const copySource = source; lims.CallServer(copySource, [1, 2, 3], true)',
            'lims.CallServer(notDefined, notDefined)'
        ],
        invalid: [
            {
                name: 'No parameters',
                code: 'lims.GetDataSource()',
                errors: [{
                    message: `This function must have at least the source argument (e.g. 'Category.Name')`,
                    type: 'CallExpression'
                }]
            },
            {
                name: 'Invalid source',
                code: 'lims.GetDataSource("Invalid")',
                errors: [{
                    message: `The first argument of this function must be a source string (e.g. 'Category.Name')`,
                    type: 'Literal'
                }]
            },
            {
                name: 'Invalid `parameters` parameter',
                code: 'lims.GetDataSource("Categ.Name", "Invalid")',
                errors: [{
                    message: `Parameters must be an array`,
                    type: 'Literal'
                }]
            },
            {
                name: 'Both parameters are invalid',
                code: 'lims.GetDataSource("Invalid", "Invalid")',
                errors: [
                    {
                        message: `The first argument of this function must be a source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `Parameters must be an array`,
                        type: 'Literal'
                    }
                ]
            },
            {
                name: 'Invalid source taken from a variable',
                code: 'const source = "Invalid"; lims.GetDataSource(source)',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid source taken from a variable, valid parameters',
                code: 'const source = "Invalid"; lims.GetDataSource(source, [1, 2, 3])',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid source taken from a variable, valid parameters taken from a variable',
                code: 'const source = "Invalid"; const params = [1, 2, 3]; lims.GetDataSource(source, params)',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid source taken from a variable, source reassigned to an invalid value (Flag both)',
                code: 'let s = "Invalid"; s = "StillInvalid"; lims.GetDataSource(s)',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Valid source reassigned to invalid value (Flag wrong)',
                code: 'let s = "Categ.Name"; s = "Invalid"; lims.GetDataSource(s, [1, 2, 3])',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name')`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid source taken from a variable assigned to another variable',
                code: 'let s = "Invalid"; let ss = s; lims.GetDataSource(ss)',
                errors: [
                    {
                        message: `This variable used as a source string must always be a valid source string (e.g. 'Category.Name') - variable s is not always a valid source string`,
                        type: 'Identifier'
                    },
                    {
                        message: `This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid params taken from a variable',
                code: 'const params = "Invalid"; lims.GetDataSource("Categ.Name", params)',
                errors: [
                    {
                        message: `This variable used as a parameters array must be an array, please check the errors on this variable assignments`,
                        type: 'Literal'
                    },
                    {
                        message: `The parameter argument must be an array, please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid params taken from a variable, params reassigned to an invalid value (Flag both)',
                code: 'let p = "Invalid"; p = "StillInvalid"; lims.GetDataSource("Categ.Name", p)',
                errors: [
                    {
                        message: `This variable used as a parameters array must be an array, please check the errors on this variable assignments`,
                        type: 'Literal'
                    },
                    {
                        message: `This variable used as a parameters array must be an array, please check the errors on this variable assignments`,
                        type: 'Literal'
                    },
                    {
                        message: `The parameter argument must be an array, please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Valid params reassigned to invalid value (Flag wrong)',
                code: 'let p = [1, 2, 3]; p = "Invalid"; lims.GetDataSource("Categ.Name", p)',
                errors: [
                    {
                        message: `This variable used as a parameters array must be an array, please check the errors on this variable assignments`,
                        type: 'Literal'
                    },
                    {
                        message: `The parameter argument must be an array, please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
            {
                name: 'Invalid params taken from a variable assigned to another variable',
                code: 'let p = "Invalid"; let pp = p; lims.GetDataSource("Categ.Name", pp)',
                errors: [
                    {
                        message: `This variable used as a parameters array must be an array, please check the errors on this variable assignments - variable p is not always array`,
                        type: 'Identifier'
                    },
                    {
                        message: `The parameter argument must be an array, please check the errors on this variable assignments`,
                        type: 'Identifier'
                    }
                ]
            },
        ]
    });

    ruleTester.run('check-server-functions cs include', rule, {
        // All include statements are commented because the processor will output them commented
        valid: [
            '// not an include statement',
            '//#include "Valid_Source.Under_Score"',
            '//#include "Categ.Name"',
            '//#include    "Categ.Name"',
            '//#include    "Categ.Name"    ',
        ],
        invalid: [
            {
                name: 'Invalid include source',
                code: '//#include "Invalid"',
                errors: [{
                    message: "Your include statement seems to be wrong, please use `#include 'Category.ScriptName'`",
                    type: 'Line'
                }]
            },
            {
                name: 'Semicolumn at the end of include',
                code: '//#include "Categ.Name";',
                errors: [{
                    message: `Your include statement seems to be wrong, please remove the semicolon at the end`,
                    type: 'Line'
                }]
            },
        ]
    });
}).to.not.throw();
