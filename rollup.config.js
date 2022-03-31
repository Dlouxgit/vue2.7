import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',
        name: 'Vue',
        format: 'umd', // esm commonjs iife umd (兼容 commonjs amd)
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
}