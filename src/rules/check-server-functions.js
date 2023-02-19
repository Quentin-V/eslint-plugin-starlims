const sourceRegex = /[A-z]+\.[A-z]+/;
module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Check links syntax such as ClientScripts, ServerScripts, DataSources, etc.',
            recommended: true
        }
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        const includeComment = /^#include\s+/;
        const includeEndingWithSemicolon = /^#include\s+.*;\s*$/;
        const validIncludeComment = /^#include\s+['"][A-z]+\.[A-z]+['"]\s*$/;
        return {
            Program() {
                for (const comment of sourceCode.getAllComments()) {
                    // Only trigger on include statements
                    if(!includeComment.test(comment.value)) return;
                    if(validIncludeComment.test(comment.value)) return; // If the source string is valid, don't report it

                    // If the include statement ends with a semicolon, report it
                    if(includeEndingWithSemicolon.test(comment.value))
                        context.report({
                            node: comment,
                            message: "Your include statement seems to be wrong, please remove the semicolon at the end"
                        });
                    else
                        context.report({
                            node: comment,
                            message: "Your include statement seems to be wrong, please use `#include 'Category.ScriptName'`"
                        });
                }
            },
            CallExpression(node) {
                // Only trigger on MemberExpressions (e.g. lims.GetDataSource)
                if(node.callee.type !== 'MemberExpression') return;

                // Only trigger on linkFunctions (e.g. lims.GetDataSource, lims.CallServer, etc.)
                const { object, property } = node.callee;
                if(object.name !== 'lims' || !linkFunctions.includes(property.name)) return;

                const { arguments: funcArgs } = node;

                // Check if the function has the right number of arguments
                if(funcArgs.length === 0) {
                    return context.report({
                        node,
                        message: "This function must have at least the source argument (e.g. 'Category.Name')"
                    });
                }

                // Check if the first argument is a valid source string
                const source = funcArgs[0];
                if(source.type === 'Identifier') {
                    const invalidRefs = getInvalidRefs(source.name, context.getScope());
                    invalidRefs.forEach(invalidRef => {
                        context.report({
                            node: invalidRef,
                            message: "This variable used as a source string must always be a valid source string (e.g. 'Category.Name')" + (invalidRef.type === 'Identifier' ? ` - variable ${invalidRef.name} is not always a valid source string` : '')
                        });
                    });
                    if(invalidRefs.length > 0)
                        context.report({
                            node: source,
                            message: "This variable must be a valid source string (e.g. 'Category.Name'), please check the errors on this variable assignments"
                        });
                }else if(source.type !== 'Literal' || !sourceRegex.test(source?.value)) { // If the first argument is not a variable, it must be the source string literal
                    context.report({
                        node: source,
                        message: "The first argument of this function must be a source string (e.g. 'Category.Name')"
                    });
                }

                const params = funcArgs[1];
                if(!params) return; // If there's no second argument, everything is fine (e.g. lims.GetDataSource('Category.Name'))

                // If the second argument is an array, everything is fine
                if(params.type === 'ArrayExpression') return;

                // If the second argument is a variable, check if it's an array
                if(params.type === 'Identifier') {
                    const nonArrayAssignments = getNonArrayAssignments(params.name, context.getScope());
                    nonArrayAssignments.forEach(assignment => {
                        context.report({
                            node: assignment,
                            message: "This variable used as a parameters array must be an array, please check the errors on this variable assignments" + (assignment.type === 'Identifier' ? ` - variable ${assignment.name} is not always array` : '')
                        });
                    });
                    if(nonArrayAssignments.length > 0)
                        context.report({
                            node: params,
                            message: "The parameter argument must be an array, please check the errors on this variable assignments"
                        });
                }else {
                    context.report({
                        node: params,
                        message: "Parameters must be an array"
                    });
                }
            }
        }
    }
};

const linkFunctions = [
    'GetDataSource',
    'CallServer',
    'CallServerAsync',
    'GetDataSet',
    'GetDataSetAsync',
    'GetData',
    'GetDataAsync',
    'GetBinarySource',
    'GetFormSource',
    'GetReportSource'
];

const getNonArrayAssignments = (variableName, scope) => {
    let varScope = scope;
    let variable = null;
    do { // Search for the variable in the scope chain going up
        variable = varScope.set.get(variableName);
        varScope = varScope.upper;
    }while(!variable && varScope !== null);

    if(!variable) return []; // Variable is not defined, handled by undefined-variable rule
    const references = variable.references;
    if(!references) return []; // Variable is not defined, handled by undefined-variable rule

    return references.filter(ref => {
        const type = ref.identifier.parent.type;
        if(!['VariableDeclarator', 'AssignmentExpression'].includes(type)) return false; // Only check variable assignments
        const writeExpr = ref.writeExpr;
        if(!writeExpr) return false; // Only check variables that are being assigned, not the ones that are being read
        // If the variable is referring to another variable, check if that variable is a valid source string
        if(writeExpr.type === 'Identifier') return getNonArrayAssignments(writeExpr.name, scope).length > 0;
        // If the variable is not an array, it's not valid
        return writeExpr.type !== 'ArrayExpression';
    }).flat().map(ref => ref.writeExpr);
}

const getInvalidRefs = (variableName, scope) => {
    let varScope = scope;
    let variable = null;
    do { // Search for the variable in the scope chain going up
        variable = varScope.set.get(variableName);
        varScope = varScope.upper;
    }while(!variable && varScope !== null);
    if(!variable) return []; // Variable is not defined, handled by undefined-variable rule
    const references = variable.references;
    if(!references) return []; // Variable is not defined, handled by undefined-variable rule

    return references.filter(ref => {
        const type = ref.identifier.parent.type;
        if(!['VariableDeclarator', 'AssignmentExpression'].includes(type)) return false; // Only check variable assignments
        const writeExpr = ref.writeExpr;
        if(!writeExpr) return false; // Only check variables that are being assigned, not the ones that are being read
        // If the variable is referring to another variable, check if that variable is a valid source string
        if(writeExpr.type === 'Identifier') return getInvalidRefs(writeExpr.name, scope).length > 0;
        // If the variable is not a valid source string, it's not valid
        return !sourceRegex.test(writeExpr.value);
    }).flat().map(ref => ref.writeExpr);
}