const gulp = require('gulp'),
      rollup = require('rollup'),
      typescript = require('rollup-plugin-typescript2')

gulp.task('bundle', function () {
    return rollup.rollup({
        input: './src/index.ts',
        plugins: [
            typescript()
        ],
        external: [
            'fs',
            'path',
            'co',
            'axios',
            'minimist',
            '@jems/di'
        ]
    }).then(bundle => {
        return bundle.write({
            file: './dist/continui.js',
            format: 'cjs',
            sourcemap: true
        })
    })
})