const babel = require('@babel/core');
const t = require('@babel/types');

const code = `
  async function func() {
    await asyncFn()
  }
`;

const tryPlugin = {
  visitor: {
    AwaitExpression(path) {
      // console.log('AwaitExpression -> path', path);
      // parent 是父节点
      // console.log("AwaitExpression -> parent", path.parent)
      // 是父节点路径
      // console.log("AwaitExpression -> parentPath", path.parentPath)

      if (path.findParent(path => t.isTryStatement(path.node))) return;
      const expression = t.expressionStatement(path.node);
      const tryBlock = t.blockStatement([expression]);
      // 生成 catch --> console.log(e)
      const paramsE = t.identifier('e');
      const memberExpression = t.MemberExpression(t.identifier('console'), t.identifier('log'));
      const consoleExpression = t.expressionStatement(t.callExpression(memberExpression, [paramsE]));
      const catchClause = t.catchClause(paramsE, t.blockStatement([consoleExpression]));
      const tryStatement = t.tryStatement(tryBlock, catchClause);
      // 数组
      path.replaceWithMultiple([tryStatement]);
    },
  },
};

const r = babel.transform(code, {
  plugins: [tryPlugin],
});

console.log(r.code);
