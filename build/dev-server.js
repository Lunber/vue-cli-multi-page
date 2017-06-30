const config = require('../config');
const express = require("express");
const webpack = require("webpack");
const opn = require('opn')
const webpackConfig = require("./webpack.dev.conf");
const port = process.env.PORT || config.dev.port;
const autoOpenBrowser = config.dev.autoOpenBrowser;
const path = require('path');

const app = express();
const compiler = webpack(webpackConfig);
const devMiddleware = require("webpack-dev-middleware")(compiler,{
    publicPath: webpackConfig.output.publicPath,
    quiet:true
});
const hotMiddleware = require("webpack-hot-middleware")(compiler,{
    log: ()=>{}
});

// force page reload when html-webpack-plugin template changes
// 因为引入了html模板，所以需要加上这一段来解决代码更改之后浏览器不会自动刷新的问题
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' });
        cb()
    })
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

app.use(devMiddleware);

app.use(hotMiddleware);

// var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// app.use(staticPath, express.static('./static'))
app.use(express.static('dist'));

const uri = "http://localhost:" + port;

let _resolve;
const readyPromise = new Promise(resolve=>{
    _resolve = resolve;
});

console.log('> Starting dev server...');
devMiddleware.waitUntilValid(()=>{
    console.log("> Listening at " + uri + '\n');
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve();
});

const server = app.listen(port);

module.exports = {
    ready:readyPromise,
    close:() =>{
        server.close();
    }
};



