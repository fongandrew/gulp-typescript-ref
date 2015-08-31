// Not a real automated test -- just a Gulpfile we use to manually sanity
// check this Gulp plugin.
var gulp = require('gulp'),
    tsFilter = require('../index');

gulp.task('default', function() {
  gulp.src("**/*.ts")
    .pipe(tsFilter(['a.ts', 'b.ts']))
    .pipe(gulp.dest("pub"));
});
