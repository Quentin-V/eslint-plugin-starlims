module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow synchronous requests like lims.CallServer() or lims.GetDataSet()',
            recommended: true
        },
        fixable: 'whitespace'
    },
    create(context) {
        const synchronousRequests = ['CallServer', 'GetDataSet', 'GetData'];
        const syncToAsyncFunction = {
            CallServer: 'lims.CallServerAsync',
            GetDataSet: 'lims.GetDataSetAsync',
            GetData: 'lims.GetDataAsync',
        }
        return {
            CallExpression(node) {
                if (node.callee?.object?.name === 'lims' && synchronousRequests.includes(node.callee?.property?.name)) {
                    context.report({
                        node,
                        message: 'Avoid synchronous requests ({{ function }}), consider using async/await with an async function ({{ asyncFunction }})',
                        data: {
                            function: node.callee.property.name,
                            asyncFunction: syncToAsyncFunction[node.callee.property.name],
                        },
                        fix: function(fixer) {
                            const fixes = []
                            if(!isInAsyncFunction(node)) fixes.push(fixer.insertTextBefore(getParentFunction(node), 'async '));
                            fixes.push(fixer.replaceText(node, (node?.parent.type === 'AwaitExpression' ? '' : 'await ') + syncToAsyncFunction[node.callee.property.name] + '(' + node.arguments.map(arg => context.getSourceCode().getText(arg)).join(', ') + ')'));
                            return fixes;
                        }
                    });
                }
            }
        }
    }
};

const isInAsyncFunction = (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') return node.async;
    if (node.parent) return isInAsyncFunction(node.parent);
    return false;
};

const getParentFunction = (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') return node;
    if (node.parent) return getParentFunction(node.parent);
    return null;
}