
const babel = require('@babel/core')
const t = require('@babel/types')
const code = `import vant, { Button, Icon } from 'vant'`
// const code = `import { Button, Icon } from 'vant'`
// import Button from 'vant/lib/Button'
// import Icon from 'vant/lib/Icon'
/**
 *
 * @param {*} opt
 */
function importPlugin(opt) {
  const { libraryDir } = opt
  return {
    visitor: {
      ImportDeclaration(path) {
        const node = path.node
        // console.log("ImportDeclaration -> node", node)
        // 得到节点的详细说明，然后转换成多个的 import 声明
        const specifiers = node.specifiers
        // 要处理这个我们做一些判断，首先判断不是默认导出我们才处理，要考虑 import vant, { Button, Icon } from 'vant' 写法
        // 还要考虑 specifiers 的长度，如果长度不是 1 并且不是默认导出我们才需要转换
        if (!(specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0]))) {
          const result = specifiers.map(specifier => {
            let local = specifier.local, source
            if (t.isImportDefaultSpecifier(specifier)) {
              source =  t.stringLiteral(node.source.value)
            } else {
              source = t.stringLiteral(`${node.source.value}/${libraryDir}/${specifier.local.name}`)
            }
            return t.importDeclaration([t.importDefaultSpecifier(local)], source)
          })
          console.log("ImportDeclaration -> result", result)
          path.replaceWithMultiple(result)
        }
      }
    }
  }
}

const r = babel.transform(code, {
  plugins: [importPlugin({ libraryDir: 'lib' })]
})

console.log(r.code);

