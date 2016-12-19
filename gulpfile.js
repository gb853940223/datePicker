var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	browsersync = require('browser-sync').create(),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin');


//开发环境
gulp.task('file_change',function(){
	gulp.src('build/static/*')
	.pipe(plumber())
	.pipe(browsersync.stream())
});

gulp.task('css',function(){
	return sass('./build/src/css/index.scss',{
		style : 'expanded',
	})
	.pipe(autoprefixer())
	.pipe(gulp.dest('./build/static/css'))
	.pipe(gulp.dest('../../../public/admin/css'))
	.pipe(browsersync.stream())
});
//移动icon文件
gulp.task('icon',function(){
	gulp.src(['build/src/css/icon/**/*'])
	.pipe(gulp.dest('build/static/css/icon'))
	.pipe(gulp.dest('../../../public/admin/css/icon'))
	;
});
gulp.task('image',function(){
	gulp.src('build/src/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('build/static/images'))
	.pipe(gulp.dest('../../../public/admin/images'));
});
//生产环境,生成压缩css到../../../public/admin/css
gulp.task('css-p',function(){
	return sass('./build/src/css/index.scss',{
		style : 'compressed',
	})
	.pipe(autoprefixer())
	.pipe(gulp.dest('../../../public/admin/css'));
});
gulp.task('icon-p',function(){
	gulp.src(['build/src/css/icon/**/*'])
	.pipe(gulp.dest('../../../public/admin/css/icon'));
});

gulp.task('image-p',function(){
	gulp.src('build/src/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('../../../public/admin/images'));
});


gulp.task('reload',function(){
	browsersync.init({
		server : './build'
	});
	gulp.watch('build/src/images/**',['image']);
	gulp.watch('build/src/css/*',['css']);
	gulp.watch('build/static/js/*',['file_change']);
	gulp.watch('build/static/css/*',['file_change']);
	gulp.watch('build/static/images/**',['file_change']);
	gulp.watch('build/**/*.html').on('change',browsersync.reload);
})
