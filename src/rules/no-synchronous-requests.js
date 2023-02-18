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
                            fixes.push(fixer.replaceText(node.callee, syncToAsyncFunction[node.callee.property.name]));
                            const parentFunction = getParentFunction(node)
                            if(parentFunction){
                                if(!parentFunction.async) fixes.push(fixer.insertTextBefore(parentFunction, 'async '));
                                fixes.push(fixer.insertTextBefore(node, (node?.parent.type === 'AwaitExpression' ? '' : 'await ')));
                            }
                            return fixes;
                        }
                    });
                }
            }
        }
    }
};

const getParentFunction = (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') return node;
    if (node.parent) return getParentFunction(node.parent);
    return null;
}