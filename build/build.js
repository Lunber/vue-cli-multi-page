process.env.NODE_ENV = 'production';
//需要在webpackConfig引入之前设置。webpackConfig里涉及到了环境的判断。
const ora = require('ora');
const chalk = require('chalk');
const rm = require('rimraf');
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require("./webpack.prod.conf");

const spinner = ora('building for production...');


spinner.start();

//先清空，后在rm的回调函数里build
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err =>{
    if ( err ) throw err;
    webpack(webpackConfig, function (err, stats){
        spinner.stop();
        if ( err ) throw err;
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunksModules: false
            }) + '\n\n');

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
});