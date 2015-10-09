This is a blank Angular 2.0 project skeleton to clone for quickly starting new projects.

Angular 2.0 projects are a bit of a pain to set up at the moment, so it's best to do it
once and use some standard format. 

About the setup:
Completely minimalistic skeleton containing only what is absolutely required to start an 
Angular 2.0 project. When learning a new framework, it is good to understand every file you
start with without handwaving, so a barebones start is best. I used the 5-minute quickstart
on the Angular 2 docs to set this up, but they use an old version of the angular 2 alpha,
the new ones require some alterations in configuration. This uses the latest version.

A simple gulpfile is used to automatically compile .ts files to .js and serve the site to 
the browser. Gulp will watch for changes and automatically recompile .ts files and refresh
browsers, as well as injecting .css changes without refresh.

Angular version 2.0.0-alpha.40 <br>
index.html: Entry point for app, loads required items, app hook in body. <br>
app.ts: Base angular component bootstraped. <br>
gulp.config.js: Identifies the location of all .ts files to auto-compile. <br>
gulpfile.js: Simple gulpfile, start with $ gulp serve.