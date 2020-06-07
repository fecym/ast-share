const code = `import { NavBar, Icon, Grid, GridItem, List } from "vant"`
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const t = require('@babel/types')

const ast = babylon.parse(code, {
  sourceType: 'module'
})
// console.log("ast", ast)
traverse(ast, {
  ImportDeclaration(path) {
    const node = path.node
    // console.log(node.specifiers);
    const specifiers = node.specifiers
    const elements = specifiers.map(item => {
      // return t.identifier(item.imported.name)
      return t.stringLiteral(item.imported.name)
    })
    const ArrayExpression = t.ArrayExpression(elements)
    const ExpressionStatement = t.ExpressionStatement(ArrayExpression)
    // console.log("ImportDeclaration -> ExpressionStatement", ExpressionStatement)
    path.replaceWith(ExpressionStatement)
  }
})

const result = generator(ast)
console.log(result.code);
