const babel = require('@babel/core')

/**
 * @babel/types 作用
 * 1. 判断是不是这个树
 * 2. 生成一个新的树
 */
const t = require('@babel/types')

// 转换前
// class Person {
//   constructor(type) {
//     this.type = type
//   }
//   getType() {
//     return this.type
//   }
// }

/**

// 转换后
function Person(type) {
  this.type = type
}
Person.prototype.getType = function() {
  return this.getType
}

 */

const code = `
  class Person {
    constructor(type) {
      this.type = type
    }
    getType(a, b) {
      return this.type
    }
  }
`

/**
 * 首先要匹配到 ClassDeclaration  转换成 FunctionDeclaration
 * 构造函数的 kind 是 constructor
 * 普通函数的 kind 是 method
 */
const classToEs5Plugin = {
  visitor: {
    ClassDeclaration(path) {
      const { node } = path
      // 此时 body 是个数组，是两个节点，对应所有的函数节点，此时需要把函数节点进行转换
      const body = node.body.body
      // 当前类的名字 Identifier
      const { id } = node
      // console.log(id)
      const methods = body.map(method => {
        // 此时要区分是构造函数函数还是普通函数
        if (method.kind === 'constructor') {
          // 构构造函数要转成函数声明
          return t.functionDeclaration(id, method.params, method.body)
        } else {
          // 第二个是表达式语句 ExpressionStatement 分左边和右边
          // Person.prototype
          let left = t.memberExpression(id, t.identifier('prototype'))
          // Person.prototype.getType
          left = t.memberExpression(left, method.key)
          // function() { return this.getType }
          const right = t.functionExpression(null, method.params, method.body)
          // 让右边等于左边
          return t.assignmentExpression('=', left, right)
        }
      })
      console.log(JSON.stringify(methods))
      // 替换多个需要用到 replaceWithMultiple 方法
      path.replaceWithMultiple(methods)
    }
  }
}
const result = babel.transform(code, {
  plugins: [classToEs5Plugin]
})
console.log(result.code)
