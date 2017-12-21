const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')

module.exports = function configureGulp(gulp) {
  gulp.task('clean', function () {
    return gulp.src(['./bin', './dist'])
      .pipe(clean());
  });

  gulp.task('transpile', ['clean'], function () {
    let tsProject = ts.createProject('./tsconfig.json')
    let errors = []
    return tsProject.src()
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(tsProject())
      .on('error', error => errors.push(error))
      .on("finish", () => {
        //throw errors.join('\n')
      })
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./bin'))
  })
}