const babylon = require('babylon')
// 使用 babel 提供的包，traverse 和 generator 都是被暴露在 default 对象上的
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')

const code = `const arr = [ ...arr1, ...arr2 ]` // var arr = [].concat(arr1, arr2)

const ast = babylon.parse(code, {
  sourceType: 'module'
})

// 转换树
traverse(ast, {
  VariableDeclaration(path) {
    const node = path.node
    const declarations = node.declarations
    console.log("VariableDeclarator -> declarations", declarations)
    const kind = 'var'
    // 边界判定
    if (node.kind !== kind && declarations.length === 1 && t.isArrayExpression(declarations[0].init)) {
      // 取得之前的 elements
      const args = declarations[0].init.elements.map(item => item.argument)
      const callee = t.memberExpression(t.arrayExpression(), t.identifier('concat'), false)
      const init = t.callExpression(callee, args)
      const declaration = t.variableDeclarator(declarations[0].id, init)
      const variableDeclaration = t.variableDeclaration(kind, [declaration])
      path.replaceWith(variableDeclaration)
    }
  }
})

const result = generator(ast)
console.log(result.code);