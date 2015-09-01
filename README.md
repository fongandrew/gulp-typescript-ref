gulp-typescript-ref
===================
Gulp plugin that filters out files not referenced from a provided array of files.

I was having problems with [gulp-typescript](https://github.com/ivogabe/gulp-typescript)'s
`referencedFrom` filter, so I made a simple Gulp plugin that uses a RegEx to approximate
what it's supposed to do.

**This plugin is NOT a replacement for `gulp-typescript`. It is
meant to be used in conjunction with it.**

Install with `npm install gulp-typescript-ref --save-dev`

Use it like this:

```javascript
var gulp = require('gulp'),
    tsFilter = require('gulp-typescript-ref'),
    ts = require('gulp-typescript');

gulp.task('default', function() {
  gulp.src("**/*.ts")
    .pipe(tsFilter(['a.ts', 'b.ts']))
    .pipe(ts({ noExternalResolve: true })) // Or whatever options you want
    .pipe(gulp.dest("pub"));
});
```
