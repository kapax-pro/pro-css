import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'src/js/sync/index.js',
        output: {
            file: 'dist/js/pro.sync.js',
            format: 'iife'
        }
    },
    {
        input: 'src/js/defer/index.js',
        output: {
            file: 'dist/js/pro.defer.js',
            format: 'iife'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            babel({ babelHelpers: 'bundled' }),
        ]
    }
]
