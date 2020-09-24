module.exports={
    parser: 'babel-eslint', //把源代码转成语法树的工具
    extends: 'airbnb',
    // root:true, //是否是根配置,配置文件可以继承
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015
    },
    env:{//指定运行环境
        browser: true,
        node:true
    },
    rules: {
        'linebreak-style':'off',
        'no-console':'off'
    }

}
