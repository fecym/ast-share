const babel = require('@babel/core')

const code = `const fn = (a, b) => a + b`

// babel 有 transform 方法会帮我们自动遍历，使用相应的预设或者插件转换相应的代码
const r = babel.transform(code, {
  presets: ['@babel/preset-env'],
})

console.log(r.code);
