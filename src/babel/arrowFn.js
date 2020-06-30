const babel = require('@babel/core');
const t = require('@babel/types');
const code = `const fn = (a, b) => a + b`;
// const fn = function(a, b) { return a + b }
const arrowFnPlugin = {
  // 访问者模式
  visitor: {
    // 当访问到某个路径的时候进行匹配
    // 没有return的方式
    // ArrowFunctionExpression(path) {
    //   // 拿到节点然后替换节点
    //   const node = path.node;
    //   // 拿到函数的参数
    //   const params = node.params;
    //   const expressionStatement = t.expressionStatement(node.body);
    //   const blockStatement = t.blockStatement([expressionStatement]);
    //   const functionExpression = t.functionExpression(null, params, blockStatement);
    //   // 替换原来的函数
    //   path.replaceWith(functionExpression);
    // },
    // 有return的情况
    ArrowFunctionExpression(path) {
      // 拿到节点然后替换节点
      const node = path.node;
      // 拿到函数的参数
      const params = node.params;
      const returnStatement = t.returnStatement(node.body);
      const blockStatement = t.blockStatement([returnStatement]);
      const functionExpression = t.functionExpression(null, params, blockStatement);
      // 替换原来的函数
      path.replaceWith(functionExpression);
    },
  },
};

const r = babel.transform(code, {
  plugins: [arrowFnPlugin],
});

console.log(r.code);
