const gulp = require( 'gulp' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		rollup = require( 'gulp-rollup' ),
		babel = require( 'rollup-plugin-babel' ),
		browserSync = require( 'browser-sync' ).create(),
		plumber = require('gulp-plumber');
		
const concatCss = require( 'gulp-concat-css' ),
		minifyCSS = require( 'gulp-minify-css' ),
		rename = require( "gulp-rename" ),
		notify = require( "gulp-notify" ),
		less = require( 'gulp-less' ),
		path = require( 'path' );

gulp.task( 'rollup', () =>
{
  gulp.src([
    './scripts/index.js',
  ])
  .pipe( plumber( function( error )
  {
      console.log( 'Error happend!', error.message );
      this.emit( 'end' );
  }))
  .pipe( sourcemaps.init() )
  .pipe( rollup({
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: 'es2015-rollup',
      }),
    ],
    format: 'iife'
  }))
  .pipe( sourcemaps.write('.') )
  .pipe( plumber.stop() )
  .pipe( gulp.dest( 'dist/' ) )
  .pipe( browserSync.reload({stream:true}) );
});

gulp.task( 'browserSync', () =>
{
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Компиляция и сборка less
gulp.task(
	'style',
	() =>
	{
		gulp.src( 'styles/**/*.less' )
			.pipe( less( {
				paths: [ path.join(__dirname, 'less', 'includes' ) ]
			}))
			.pipe( concatCss( 'style.css' ))
			.pipe( gulp.dest( 'dist/' ))
			.pipe(minifyCSS( '' ))
			.pipe(rename( 'style.min.css' ))
			.pipe(gulp.dest( 'dist/' ))
			.pipe(notify( 'Скомпилировано!' ));
	}
);

gulp.task( 'watch', () =>
	{
		gulp.watch( 'scripts/**/*.js', ['rollup'] );
		gulp.watch( 'styles/**/*.less', ['style'] );
	}
);

gulp.task( 'default', ['watch', 'rollup', 'browserSync', 'style'] );
