//Определяем константы gulp
const {src, dest, watch, parallel, series} = require('gulp');

//Подключам все установленные через терминал плагины
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');
const clean = require('gulp-clean');

//Работа со стилями
//создаем функцию с именем styles
function styles() {
    return src('app/scss/style.scss') //указываем откуда нужно брать исходный файл
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']})) //добавляем в исходном файле вендорные префиксы
        .pipe(concat('style.min.css')) //делаем конкатенацию и переименовываем файл в style.min.css
        .pipe(scss({outputStyle: 'compressed'})) //делаем минификацию/сжатие файла
        .pipe(dest('app/css')) // выгружаем результат в папку css
        .pipe(browserSync.stream()) //заставляем браузер в режиме реального времени отслеживать изменения и обновлять страницу
}

//Работа со скриптами
//создаем функцию с именем scripts
function scripts() {
    return src([
        'app/js/main.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/mixitup/dist/mixitup.js',

    ])//указываем откуда нужно брать исходный файл
        .pipe(concat('main.min.js'))//делаем конкатенацию (объединение) и переименовываем файл в main.min.js
        .pipe(uglify()) //делаем минификацию/сжатие файла
        .pipe(dest('app/js'))// выгружаем результат в папку css
        .pipe(browserSync.stream()) //заставляем браузер в режиме реального времени отслеживать изменения и обновлять страницу
}

//Оптимизация и конвертация картинок
//создаем функцию с именем images
function images() {
    return src ([ //нам нужно взять все картинки, кроме svg, это множественное условие, поэтому пишем его в квадратных скобках
    'app/images/src/*.*', //берем из папки src все картинки
    '!app/images/src/*.svg' ]) //делаем исключение для svg, так как их не нужно конвертировать
    .pipe(newer('app/images')) //проверяем есть ли уже такие картинки в папке, если да, то они игнорируются
    .pipe(avif({quality : 50 })) // конвертируем в формат avif и устанавливаем степень сжатия картинок
    .pipe(src('app/images/src/*.*')) //снова берем из папки src все картинки
    .pipe(newer('app/images')) //проверяем есть ли уже такие картинки в папке, если да, то они игнорируются
    .pipe(webp()) // конвертируем в формат webp
    .pipe(src('app/images/src/*.*')) //снова берем из папки src все картинки
    .pipe(newer('app/images')) //проверяем есть ли уже такие картинки в папке, если да, то они игнорируются
    .pipe(imagemin()) // сживаем все изображения, включая svg
    .pipe(dest('app/images')) // выгружаем результат в папку img
}

//Оптимизация шрифтов
//создаем функцию с именем fonts
function fonts() {
    return src('app/fonts/src/*.*') //указываем откуда нужно брать исходные файлы разних форматов
        .pipe(fonter({ //отрабатывает плагин и конвертирует шрифты в форматы woff и ttf
            formats: ['woff', 'ttf']
        }))
        .pipe(ttf2woff2()) //плагин берет шрифты формата ttf и конвертирует их в формат woff2
        .pipe(dest('app/fonts')) // выгружаем результат в папку fonts
}

//Сборка html файлов
//создаем функцию с именем pages
function pages() {
    return src('app/pages/*.html')
        .pipe (include({
            includePaths: "app/components" //подключаем содержимое файлов компонентов
        }))
        .pipe(dest('app')) // выгружаем результат в папку app (создается файл index.html)
        .pipe(browserSync.stream()) //заставляем браузер в режиме реального времени отслеживать изменения и обновлять страницу
}

//Отслеживание изменений в файлах и автообновление страницы(синхронизация)
//создаем функцию с именем watching
function watching() {
    browserSync.init({ //создается локальный веб-сервер, по умолчанию адрес http://localhost:3000/
        server: {
            baseDir: "app/" //говорим откуда запустить проект
        }
    });
    watch(['app/scss/style.scss'], styles) //отслеживаем изменения в стилях
    watch(['app/js/main.js'], scripts) //отслеживаем изменения в скриптах
    watch(['app/images/src'], images) //отслеживаем появление новых картинок
    watch(['app/components/*', 'app/pages/*'], pages) //отслеживаем пизменения в html 
    watch(['app/*.html']).on('change', browserSync.reload); //автоматически перезагружаем страницу если в перечисленных выше файлах были изменения
}

//Очистка папки dist
//создаем функцию с именем cleanDist
function cleanDist() {
    return src('dist') //делаем очистку папки dist
        .pipe(clean())
}

//Сборка проекта
//создаем функцию с именем building
function building() {
    return src([
        'app/css/style.min.css', //забираем итоговый файл со стилями (оптимизированный, минимизированный, конвертированный)
        'app/js/main.min.js',//забираем итоговый файл со скриптами (оптимизированный и минимизированный)
        'app/images/*.*',    //забираем все картинки (они сжаты, переконвертированы)
        'app/fonts/*.*', //забираем все шрифты (они оптимизированы и конвертированы)
        'app/*.html'], //забираем все шрифты (они оптимизированы и конвертированы)
        {base : 'app'}) //указываем исходную папку проекта
        .pipe(dest('dist')) //указываем итоговую папку проекта и копируем туда все нужные файлы
}

//Экспортируем функции в задачи
exports.styles = styles; //запускается в терминале командой gulp styles
exports.scripts = scripts; //запускается в терминале командой gulp scripts
exports.images = images; //запускается в терминале командой gulp images
exports.fonts = fonts; //запускается в терминале командой gulp fonts
exports.pages = pages; //запускается в терминале командой gulp pages
exports.watching = watching; //не требует отдельного запуска
exports.building = building;  //запускается в терминале командой gulp building
exports.default = parallel(styles, scripts, fonts, images, pages, watching); //запускается в терминале командой gulp
exports.build = series(cleanDist, building); //запускается в терминале командой gulp build