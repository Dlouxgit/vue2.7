## 这是什么

Vue2 核心功能 demo

## 做了什么
0. 通过 mixin 创建 vm.options (存在用户调用 mixin 传入的参数) 与 vm.$options (存在用户新建实例时传入的参数) 
1. 创造了响应式数据，初始化计算属性，初始化 watch
2. 模板转换成 ast 语法树
3. ast语法树转成 render 函数
4. 数据更新就执行 render 函数，因为动态的{{}}内容已经使用 _s 来处理，无需再次处理 ast
5. 调用 render 生成虚拟节点，之后新建一个 Watcher 实例
6. watcher 回调中使用 update 挂载，第一次是同步渲染，更新流程会加入队列，之后使用 nextTick 进行异步渲染
7. 挂载中使用的数据会被 Dep 实例进行依赖收集

更新顺序
- 创造响应式数据，数据劫持，定义 defineProperty
- 模板转换 ast，ast 转换 render
- 使用 update 挂载 el
- 增加 Dep 与 Watcher，完成观察者模式
- 增加 mixin 与 lifecycle
- 增加计算属性 computed 实现
- 增加 watch 与 $watch 实现