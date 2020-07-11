const babel = require('@babel/core');
const t = require('@babel/types');
// let res = await asyncFn()
// res = await asyncFn2()
const code = `
  async function func() {
    const r = await asyncFn1()
    res = await asyncFn2()
    await asyncFn3()
  }
`;

const tryPlugin = {
  visitor: {
    AwaitExpression(path) {
      // 首先保证 await 语句没有被 try/catch 包裹
      if (path.findParent(path => t.isTryStatement(path.node))) return;
      const parent = path.parent;
      let replacePath = null;
      if (t.isVariableDeclarator(parent) || t.isAssignmentExpression(parent)) {
        // 赋值和声明的方式结构类似，都是在 AwaitExpression 中 path 的 parentPath.parentPath 上的节点就是 blockStatement 所需要的的参数，可以直接这么替换
        // console.log("AwaitExpression -> path.parentPath", path.parentPath)
        replacePath = path.parentPath.parentPath;
      } else {
        // 如果只是表达式的话，path.parentPath.node 就是 blockStatement 参数
        replacePath = path.parentPath;
      }
      // console.log("AwaitExpression -> replacePath", replacePath)
      const tryBlock = t.blockStatement([replacePath.node]);
      // 生成 catch --> new Error(e)
      const paramsE = t.identifier('e');
      const throwStatement = t.throwStatement(t.newExpression(t.identifier('Error'), [paramsE]));
      const catchClause = t.catchClause(paramsE, t.blockStatement([throwStatement]));
      const tryStatement = t.tryStatement(tryBlock, catchClause);
      replacePath.replaceWithMultiple([tryStatement]);
    },
  },
};

const r = babel.transform(code, {
  plugins: [tryPlugin],
});
console.log(r.code);
