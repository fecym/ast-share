const code = `import { NavBar, Icon, Grid, GridItem, List } from "vant"`
const babel = require('@babel/core')
const t = require('@babel/types')

const extractImport = {
  visitor: {
    ImportDeclaration(path) {
      const node = path.node
      // console.log(node.specifiers);
      const specifiers = node.specifiers
      const elements = specifiers.map(item => {
        return t.identifier(item.imported.name)
      })
      const ArrayExpression = t.ArrayExpression(elements)
      const ExpressionStatement = t.ExpressionStatement(ArrayExpression)
      // console.log("ImportDeclaration -> ExpressionStatement", ExpressionStatement)
      path.replaceWith(ExpressionStatement)
    }
  }
}

const result = babel.transform(code, {
  plugins: [extractImport]
})
console.log(result.code);
