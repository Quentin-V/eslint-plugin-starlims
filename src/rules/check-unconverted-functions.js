const xfdToHtmlFunctions = {
    Convert: {
        ToInt: [() => 'parseInt', (node) => getReplaceCalleeFixer(node, 'parseInt')],
        ToInt32: [() => 'parseInt', (node) => getReplaceCalleeFixer(node, 'parseInt')],
        ToDecimal: [() => 'parseFloat', (node) => getReplaceCalleeFixer(node, 'parseFloat')],
        ToDouble: [() => 'parseFloat', (node) => getReplaceCalleeFixer(node, 'parseFloat')],
    },
    lims: {
        AAdd: [(node) => `${node.arguments[0].name}.push(${node.arguments.slice(1).map(a => a.name ?? a.value).join(', ')})`, (node) => (fixer) => {
            const fixes = [];
            fixes.push(fixer.replaceText(node.callee, `${node.arguments[0].name}.push`));
            const firstArgument = node.arguments[0];
            const secondArgument = node.arguments[1];
            fixes.push(fixer.replaceTextRange([firstArgument.range[0], secondArgument.range[0]], ''));
            return fixes;
        }],
    },
    int: [() => 'parseInt', (node) => getReplaceCalleeFixer(node, 'parseInt')]
}

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Find XFD functions that have not been converted to HTML',
            recommended: true
        },
        fixable: 'whitespace'
    },
    create(context) {
        return {
            CallExpression(node) {
                const replacement = findReplacement(node.callee, xfdToHtmlFunctions);
                if(!replacement) return;
                const fixerFunction = replacement[1](node, replacement[0]);
                context.report({
                    node,
                    message: `This function is a legacy function, in HTML you should use '{{ replacement }}'.`,
                    data : {
                        replacement: replacement[0](node)
                    },
                    fix: fixerFunction
                });
            }
        }
    }
};

function findReplacement(node, functionReplacementObject) {
    if(!functionReplacementObject) return;
    if(Array.isArray(functionReplacementObject[node.name])) return functionReplacementObject[node.name];
    if(node.type === 'Identifier') return functionReplacementObject[node.name];
    if(node.object.type === 'Identifier') return findReplacement(node.property, functionReplacementObject[node.object.name]);
    if(node.object.type === 'MemberExpression') return findReplacement(node.property, findReplacement(node.object, functionReplacementObject));
}

function fixSimpleReplace(fixer, node, replacement) {
    return fixer.replaceText(node, replacement);
}

function getReplaceCalleeFixer(node, replacement) {
    return (fixer) => fixSimpleReplace(fixer, node.callee, replacement)
}