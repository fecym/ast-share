// let arr = [ ...arr1, ...arr2 ]
// var arr = [].concat(arr1, arr2)

const babel = require('@babel/core')
const t = require('@babel/types')

const code = `let arr = [ ...arr1, ...arr2 ]`
// const code = `var arr = [].concat(arr1, arr2)`

const arrayTransformPlugin = {
  visitor: {
    VariableDeclaration(path) {
      const node = path.node
      const declarations = node.declarations
      const kind = 'var'
      // console.log(declarations)
      if (node.kind !== kind && declarations.length === 1 && t.isArrayExpression(declarations[0].init)) {
        const args = declarations[0].init.elements.map(item => t.identifier(item.argument.name))
        // console.log(t.identifier('concat'))
        const callee = t.memberExpression(t.arrayExpression([]), t.identifier('concat'), false)
        const init = t.callExpression(callee, args)
        // console.log(declarations[0].id)
        const declaration = t.variableDeclarator(declarations[0].id, init)
        const VariableDeclaration = t.variableDeclaration(kind, [declaration])
        path.replaceWith(VariableDeclaration)
      }
    }
  }
}

const result = babel.transform(code, {
  plugins: [arrayTransformPlugin]
})

console.log(result.code)
