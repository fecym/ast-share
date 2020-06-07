const babel = require('@babel/core')
const t = require('@babel/types')
// const code = `const fn = (a, b) => a + b`
const code = `const fn = (a, b) => { return a + b}`
// const fn = function(a, b) { return a + b }
const arrowFnPlugin = {
  // 访问者模式
  visitor: {
    // 当访问到某个路径的时候进行匹配
    ArrowFunctionExpression(path) {
      // 拿到节点然后替换节点
      const node = path.node
      console.log("ArrowFunctionExpression -> node", node)
      // 拿到函数的参数
      const params = node.params
      let body = node.body
      // 判断是不是 blockStatement，不是的话让他变成 blockStatement
      if (!t.isBlockStatement(body)) {
        body = t.blockStatement([body])
      }
      const functionExpression = t.functionExpression(null, params, body)
      // 替换原来的函数
      path.replaceWith(functionExpression)
    }
  }
}

const r = babel.transform(code, {
  plugins: [arrowFnPlugin]
})

console.log(r.code);
