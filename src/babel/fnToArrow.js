const babel = require('@babel/core')
const t = require('@babel/types')

const code = `const fn = function(a, b) { return a + b }`
// `const fn = (a, b) => { return a + b}`

const fnToArrowPlugin = {
  visitor: {
    FunctionExpression(path) {
      const { params, body } = path.node
      const arrowFunctionExpression = t.arrowFunctionExpression(params, body)
      path.replaceWith(arrowFunctionExpression)
    }
  }
}

const r = babel.transform(code, {
  plugins: [fnToArrowPlugin]
})

console.log(r.code);
