const zip = require('gulp-zip');

module.exports = function configureGulp(gulp) {   
  gulp.task('pack', getZipPipe)
  gulp.task('pack-cd', ['distribute-cd'], getZipPipe)

  function getZipPipe() {
    let currentVersion = require('../../package.json').version;

    return gulp.src('./dist/**/*')
               .pipe(zip(`continui-services-${currentVersion}.zip`))
               .pipe(gulp.dest('./artifacts'));
  }
}