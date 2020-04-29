import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import minify from "gulp-csso";
import autoprefixer from "gulp-autoprefixer";
import ghPages from "gulp-gh-pages";
import image from "gulp-image";

sass.compiler = require("node-sass");

const routes = {
  html: {
    watch: "src/*.html",
    src: "src/*.html",
    dest: "dist",
  },
  css: {
    watch: "src/scss/*.scss",
    src: "src/scss/styles.scss",
    dest: "dist/css",
  },
  images: {
    src: "src/images/*",
    dest: "dist/images",
  },
};

const html = () => gulp.src(routes.html.src).pipe(gulp.dest(routes.html.dest));

const styles = () =>
  gulp
    .src(routes.css.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.css.dest));

const images = () =>
  gulp.src(routes.images.src).pipe(image()).pipe(gulp.dest(routes.images.dest));

const ghDeploy = () => gulp.src("dist/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.css.watch, styles);
};

const clean = () => del(["dist", ".publish"]);

const prepare = gulp.series([clean]);
const assets = gulp.series([html, images, styles]);
const live = gulp.parallel([watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, ghDeploy, clean]);
