/*****************************
  gulp-viz

  front-end gulpfile

  antouank, July 2014
 *****************************/

(function() {
'use strict';

    //  modules
var exec          = require('child_process').exec,
    es            = require('event-stream'),
    Q             = require('q'),
    browserify    = require('browserify'),
    reactify      = require('reactify'),
    gulp          = require('gulp'),
    gulpUtil      = require('gulp-util'),
    log           = require('consologger'),
    path          = require('path'),
    rimraf        = require('rimraf'),
    runSequence   = require('run-sequence'),
    source        = require('vinyl-source-stream'),
    vinylBuffer   = require('vinyl-buffer'),
    karma         = require('karma').server,
    //  gulp plugins
    concat        = require('gulp-concat'),
    eslint        = require('gulp-eslint'),
    gzip          = require('gulp-gzip'),
    gulpif        = require('gulp-if'),
    less          = require('gulp-less'),
    mincss        = require('gulp-minify-css'),
    minhtml       = require('gulp-minify-html'),
    order         = require('gulp-order'),
    size          = require('gulp-size'),
    tap           = require('gulp-tap'),
    uglify        = require('gulp-uglify'),
    wrapper       = require('gulp-wrapper'),
    //  helper functions
    execute,
    setEnv,
    getEnv,
    wrapJson,
    //  variables
    GIT_VERSION,
    ENV = 'develop',  //  environment is develop by default
    preparationTasks,
    assets = {},
    paths = {};

/**********************************************************/
/** set paths **/
paths.base = '.';
//  source
paths.src         = path.join(paths.base, 'src');
paths.style       = path.join(paths.src, 'style');
paths.html        = path.join(paths.src, 'html');
paths.script      = path.join(paths.src, 'script');
paths.thirdParty  = path.join(paths.src, 'thirdParty');
paths.thirdPartyScripts = path.join(paths.thirdParty, 'script');
// deploy
paths.deploy      = path.join(paths.base, 'deploy');
//  test
paths.test        = path.join(paths.base, 'test');

//  Karma variables
var karmaConf,
    karmaConfModule = { set: function(cfg){karmaConf = cfg;} };
require('./karma.conf.js')(karmaConfModule);

var
htmlIndexFile = [
  paths.html + '/index.html'
],
thirdPartyCss = [
  path.join( paths.thirdParty, 'style' ) + '/**/*.css'
],
lessFiles = [
  paths.style + '/**/*.less'
],
thirdPartyJs = [
  paths.thirdPartyScripts + '/react-0.10.0.js',
  paths.thirdPartyScripts + '/d3.js'
],
thirdPartyJsMin = [
  paths.thirdPartyScripts + '/react-0.10.0.min.js',
  paths.thirdPartyScripts + '/d3.min.js'
],
jsFiles = [
  paths.script + '/main.js',
  paths.script + '/**/*.js'
],
entryScript = path.join(path.resolve(paths.script), 'app.react.js');


/**********************************************************/
/** helper functions **/
execute = function(command, callback){
  exec(command, function(err, stdout){
    if(err){
      throw err;
    }

    callback(stdout);
  });
};

setEnv = function(env){ ENV = env; };
getEnv = function(){ return ENV; };

// function to wrap a json translation file, and return a self invoked
// js function, defining that translation in the cb namespace
//  * used through gulp-tap
wrapJson = function(file){

  var fileName = file.path.replace(file.base, '');

  //   filter json files ( translations )
  if(path.extname(file.path) === '.json'){
    file.path = file.base + fileName.replace('.json', '.js');
    file.contents =
    new Buffer('\nwindow.cb={};\nwindow.cb.translation='+file.contents.toString()+';\n');

  }
};

/**********************************************************/
/** Tasks **/

//  get the current git version
gulp.task('get-version',function(taskDone){

  execute('git describe', function(stdout){

    GIT_VERSION = stdout.replace('\n','');
    gulpUtil.log('[git-version] git:', GIT_VERSION);
    taskDone();
  });
});



//  clean the deploy target directory
gulp.task('clean-deploy', function(taskDone){

  rimraf(paths.deploy, function(err){
    if(err){
      throw err;
    }
    taskDone();
  });
});



//  lint the gulpfile code
gulp.task('lint-self', function(){

  return gulp.src('./gulpfile.js')
  .pipe( eslint({ config: '.eslintrc' }) )
  .pipe( eslint.format() );
});



//  read and save in memory the index.html file
gulp.task('read-index-html', function(taskDone){

  gulp.src(htmlIndexFile)
  //  tap in and save the contents of the index.html file
  .pipe( tap(function(file) {
    assets.index_html = file._contents.toString();
  }) )
  .on('end',function(){
    taskDone();
  });

});



// process style files, output main css file
gulp.task('styles', function(taskDone){

  es.merge(
    //  grab the CSS files
    gulp.src(thirdPartyCss)
    .pipe( concat('thirdParty.css') ),

    //  process the LESS files
    gulp.src(paths.style + '/main.less')
    .pipe( less() )
  )
  .pipe( order([
    'thirdParty.css',
    '*'
  ]) )
  .pipe( size({showFiles: true}) )   //  print size of total CSS files
  .pipe( gulpif(getEnv() !== 'develop', mincss()) )
  .pipe( concat('main.min.css') )
  .pipe( size({ showFiles: true }) ) //  print size of minified CSS file
  //   tap in the stream to get the minified CSS file contents
  .pipe( tap(function(file, t) {
    assets.main_css = file._contents.toString();
    return t;
  }) )
  //  write the main.min.css file ( removed for now )
  // .pipe( gulp.dest(paths.deploy + '/styles') )
  .on('end',function(){
    taskDone();
  });

});



//  a task to load all 3rd party js libs and keep one concatenated file
//  in memory under 'assets.thirdParty_js'
gulp.task('load-third-party-scripts', function(taskDone){

  //  by default get the unminified 3rd party scripts
  var scriptsToUse = thirdPartyJs;

  if(getEnv() !== 'develop'){
    // if we are not on develop, grab the minified versions
    scriptsToUse = thirdPartyJsMin;
  }

  //  read the 3rd party files from disk, and save them to memory
  //  * files are already in the minified version if we are not in develop
  //    see the if above.
  gulp.src(scriptsToUse)
  //  concat all 3rd party libs into one js file
  .pipe( concat('thirdParty.js') )
  //  tap into the concatenated file and save it
  .pipe( tap(function(file){
    assets.thirdParty_js = file._contents.toString();
  }) )
  .on('end',function(){
    taskDone();
  });

});

gulp.task('lint-our-scripts', function(taskDone){

  gulp.src(jsFiles)
  .pipe( eslint() )
  .pipe( eslint.format() )
  .on('end', function(){
  
    taskDone();
  });
});

//  process and copy script files
gulp.task('write-scripts', function(taskDone){

  browserify(entryScript)
  .transform(reactify)
  .bundle()
  .pipe( source('complete.js') )
  .pipe( gulpif(getEnv() !== 'develop', uglify()) )
  .pipe( gulp.dest(paths.deploy) )
  .on('end', function(){
    taskDone();
  });

});

//  inline the main.css into index.html ( in memory )
gulp.task('inline-css', function(taskDone){

  var regexCssPlaceholder = /<!--\s+main_css-placeholder\s+-->/;
  // replace the main.css [;aceholder] into the index.hmtl files
  assets.index_html = assets.index_html.replace(regexCssPlaceholder, '<style>'+assets.main_css+'</style>');
  taskDone();
});

//  task to rebuild the index.html file without building the stylesheet main.css file
gulp.task('rebuild-index-html', function(taskDone){
  if(assets.main_css === undefined){
    throw Error('no main.css was loaded');
  }

  runSequence(
    'read-index-html',
    'inline-css',
    'write-index-html',
    taskDone
  );
});

gulp.task('rebuild-style', function(taskDone){

  runSequence(
    ['read-index-html','styles'],
    'inline-css',
    'write-index-html',
    taskDone
  );
});

gulp.task('write-index-html', function(){

  var stream = source('index.html'),
      file_contents = assets.index_html;

  stream.write(file_contents);

  process.nextTick(function(){
    stream.end();
  });

   return stream
  .pipe( vinylBuffer() )
  //  minify if not in develop
  .pipe( gulpif(getEnv() !== 'develop', minhtml({empty:true,comments:true,spare:true})) )
  .pipe( gulp.dest(paths.deploy) )
  //  create also gzip version
  .pipe( gzip({ append: true }) )
  .pipe( gulp.dest(paths.deploy) );

});

//  copy all extra assets within root /src
gulp.task('root-files', function(taskDone){

  gulp.src(paths.src + '/*.*')
  .pipe( gulp.dest(paths.deploy) )
  .on('end',function(){
    taskDone();
  });

});

//  testing Tasks
//  test once
gulp.task('karma-test', function (done) {
  karmaConf.singleRun = true;
  karma.start( karmaConf, done);
});

//  test with watcher on ( running with watch-dev )
gulp.task('tdd', function (done) {
  karmaConf.singleRun = false;
  karma.start(karmaConf, done);
});

/**** main tasks ****/

preparationTasks = [
  'clean-deploy',
  'get-version',
  'lint-self'
];


gulp.task('default', function(){

  log.data('========================== antouank - gulp-viz ==========================');
  log.data('run `gulp dev` to build in the development environent');
  log.data('run `gulp watch-dev` to build in the development environent and keep watchers running');
  log.data('run `gulp staging` to build in the staging environent');
  log.data('run `gulp watch-staging` to build in the staging environent and keep watchers running');
  log.data('run `gulp master` to build in the master environent');
});

//  ======================================================= develop main task
gulp.task('dev', function(taskDone){

  setEnv('develop');

  runSequence(
    preparationTasks,
    ['read-index-html', 'styles', 'root-files'],
    ['inline-css', 'write-index-html', 'write-scripts'],
    // 'karma-test',
    taskDone
  );
});

//  ======================================================= staging main task
gulp.task('staging', function(taskDone){

  setEnv('staging');

  runSequence(
    preparationTasks,
    ['read-index-html', 'styles', 'root-files'],
    ['inline-css', 'write-index-html', 'write-scripts'],
    taskDone
  );
});

//  ======================================================= watchers
//  main watcher task
gulp.task('watch', function(){

  gulpUtil.log('watching dev files...');

  //  watch vendor scripts
  gulp.watch(['./gulpfile.js'], function(){
    log.error('gulpfile was changed!! Re-run gulp...');
  });

  gulp.watch([htmlIndexFile], ['rebuild-index-html']);

  //  watch stylesheets
  gulp.watch([thirdPartyCss, lessFiles], ['rebuild-style']);

  //  watch scripts
  gulp.watch([jsFiles], function(){
    runSequence(
      'write-scripts'
    );
  });

});

//  watcher for develop
gulp.task('watch-dev', function(taskDone){
  runSequence(
    'dev',
    'watch',
    taskDone
  );
});

//  watcher for staging
gulp.task('watch-staging', function(taskDone){
  runSequence(
    'staging',
    'watch',
    taskDone
  );
});

})();
