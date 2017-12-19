const gulp = require('gulp'),
      rollup = require('rollup'),
      rollupTypescript = require('rollup-plugin-typescript2')

gulp.task('bundle', function () {
    return rollup.rollup({
        input: './src/index.ts',
        plugins: [
            rollupTypescript({                
                useTsconfigDeclarationDir: true,
                tsconfigOverride: { 
                    compilerOptions: {
                        declaration: true,
                        declarationDir: './dist/definitions'
                    },
                    include: ['./src/**/*.ts']                  
                }                
            })
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
            format: 'cjs'
        })
    })
})