const babel = require('@babel/core');
const t = require('@babel/types');
const code = `
async function func() {
  const r = await asyncFn1()
}
`;

const tryPlugin = {
  visitor: {
    AwaitExpression(path) {
      // 首先保证 await 语句没有被 try/catch 包裹
      if (path.findParent(path => t.isTryStatement(path.node))) return;
      const parent = path.parent;
      // console.log('AwaitExpression -> parent', parent);
      //
      if (t.isVariableDeclarator(parent) || t.isAssignmentExpression(parent)) {
        // 赋值和声明的方式结构类似，都是在 AwaitExpression 中 path 的 parentPath.parentPath 上的节点就是 blockStatement 所需要的的参数，可以直接这么替换
        const replacePath = path.parentPath.parentPath;
        // console.log('AwaitExpression -> replacePath', path.parentPath);
        const tryBlock = t.blockStatement([replacePath.node]);
        const tryStatement = t.tryStatement(tryBlock);
        replacePath.replaceWithMultiple([tryStatement]);
      } else {
        const expression = t.expressionStatement(path.node);
        const tryBlock = t.blockStatement([expression]);
        const tryStatement = t.tryStatement(tryBlock);
        path.replaceWithMultiple([tryStatement]);
      }
    },
  },
};

const r = babel.transform(code, {
  plugins: [tryPlugin],
});
console.log(r.code);
