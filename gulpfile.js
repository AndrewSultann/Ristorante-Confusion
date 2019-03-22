// var gulp = require("gulp")
//instead of calling all the gulp package i can call some of it to be fast
const {src, dest, task, watch, series, parallel} = require('gulp');

// i have to remove every gulp. decleration i used


var sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();
    del = require('del'),
    imagemin= require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin= require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');
    

var styleSCSS = 'sass/*.scss',
    styleDist = './dist/css',
    jsSRC = 'js/*.js',
    jsDIST = './dist/js',
    styleWatch = 'sass/**/*.scss',
    jsWatch = 'js//**/*.js';
    

    function browser_sync(){
      browserSync.init({
        server:{
          baseDir: "./"
        }
      });
    
    };
   


function reload(done){
  browserSync.reload();
  done();
}

function html_min (done) {
  return src('./*.html')
       .pipe(htmlmin({ collapseWhitespace: true }))
       .pipe(dest('dist/'));
   done()
  }

 function css(done){
    return src(styleSCSS)
        .pipe(sass({
          errorLogToConsole : true,
          outputStyle : 'compressed'
        }))
        .on('error', console.error.bind( console))
        .pipe(rev())
        .pipe(cleanCss())
        .pipe(dest(styleDist))
        .pipe(browserSync.stream())
    done()    

};

function js (done){
  return  src(jsSRC)
              .pipe(uglify())
              .pipe(rev())
              .pipe(dest(jsDIST))
              .pipe(browserSync.stream())
  done();
}


//clean task 

function cleanTask(done){
  return del(['dist']);
  done()
}


function copy_fonts(done){
  src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
  .pipe(dest('./dist/fonts'));
  done();
}

// Images
function images (done) {
  return src('img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced:true}),
      imagemin.jpegtran({progressive:true}),
      imagemin.optipng({optimizationLevel:5})
    ]))
    .pipe(dest('dist/img'));
    done();
};

// function use_min(done) {
//   return src('./*.html')
//   .pipe(flatmap(function(stream, file){
//       return stream
//         .pipe(usemin({
//             css: [ rev() ],
//             html: [ html_min() ],
//             js: [ uglify(), rev() ],
//             inlinejs: [ uglify() ],
//             inlinecss: [ cleanCss(), 'concat' ]
//         }))
//     }))
//     .pipe(dest('dist/'));
//     done();
// };


function watch_files(){
  watch(styleWatch, series(css, reload))
  watch(jsWatch, series(js, reload))
  //if i am adding more task i shoud add them here too
}



task('css', css);
task('js', js);
task('images', images);
// task('usemin', use_min)
task('htmlmin', html_min);

task('default', parallel(css, js, html_min))  

//Before build use the clean task
task('build',series(cleanTask,copy_fonts, images, 'default' ) );
task('watch', parallel(browser_sync, watch_files));