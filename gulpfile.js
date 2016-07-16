/*
*	Compile from
*     sources: src/*.js 
*     to     : extensions/*.js
*/

// Import preprocessor
var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var browserify = require('gulp-browserify');
var babel      = require('gulp-babel');




// Build instruction.
// Type `gulp` in command line to trigger this task.
gulp.task('default', function(){

    process.env.NODE_ENV = 'production';
    
    return gulp.src('src/*.js')
        .pipe(browserify({
            'paths': [
                __dirname + '/src',
                __dirname + '/node_modules',
            ],
        }))
        .on('error', errorLog)
        .pipe(babel({
            presets: ['es2015'],
            compact: true
        }))
        .on('error', errorLog)
        .pipe(uglify())
        .on('error', errorLog)
        .pipe(gulp.dest('extensions/'));
});




// Build in debug mode
// Type `gulp debug` in command line to trigger this task.
gulp.task('debug', function(){
    return gulp.src('src/*.js')
        .pipe(browserify({
            debug: true,
        }))
        .on('error', errorLog)
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', errorLog)
        .pipe(gulp.dest('extensions/'));
});




// Define self used function 
function errorLog(error) {
    console.log(error);
    console.error.bind(error);
    this.emit('end');
}
