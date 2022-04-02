<!--
 * @Author: wt
 * @Date: 2022-04-02 23:33:14
 * @LastEditTime: 2022-04-02 23:34:20
 * @Description: 
-->

## 这是什么

Vue2 核心功能 demo

## 做了什么

 1. 创造了响应式数据
 2. 模板转换成 ast 语法树
 3. ast语法树转成 render 函数
 4. 数据更新就执行 render 函数，因为动态的{{}}内容已经使用 _s 来处理，无需再次处理 ast
 5. 调用 render 生成虚拟节点，之后使用 update 挂载即可
 