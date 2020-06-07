const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
// const code = `const fn = () => {}`
const code = `function getUser() {}`

const ast = esprima.parseScript(code)
console.log("getUser -> ast", ast)

estraverse.traverse(ast, {
  // 只会遍历 type 属性
  enter(node) {
    console.log("enter -> node.type", node.type)
  },
  leave(node) {
    console.log("leave -> node.type", node.type)
  }
})

const result = escodegen.generate(ast)
// console.log("", result)
