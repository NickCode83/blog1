var express = require("express");
var http = require("http");  //导入处理http协议的模块
var path = require("path");  //导入处理文件路径的模块
var mongoskin = require("mongoskin");
var routes = require('./routes');   //实际上注入的是请求处理程序

var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog';
var db = mongoskin.db(dbUrl,{safe:true});
var collections = {
	articles: db.collection('articles'),
	users: db.collection('users')
};

var cookieParser = require('cookie-parser');
var logger = require("morgan");//导入morgan日志模块
var errorHandler = require('errorhandler');  //导入错误处理模块
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

//添加一个中间件来暴露Mongoskin/MongoDBji集合在每个Expres.js中的路径，不要忘了调用next(),否则每个请求都要延迟
app.use(function(req, res, next) {
  if (!collections.articles || ! collections.users) return next(new Error("No collections."))
  req.collections = collections;
  return next();
});


app.set('port', process.env.PORT || 3000);  //设置服务器端口
app.set('views', './views');  //设置视图文件路径,这样在后面的路由中就可以用简洁的相对路径来表示
app.set('view engine', 'jade');  //设置模板引擎


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride);
app.use(express.static(path.join(__dirname, 'public')));  //设置静态资源地址



// app.get('/index', function(req, res){
// 	res.render(
// 		'index',
// 		{articles: articles,
// 		appTitle:'blog-express'}
// 		);
// });

// app.get('/article', function(req, res){
// 	res.render(
// 		'article'
// 		);
// });

// app.get('/post', function(req, res){
// 	res.render(
// 		'post'
// 		);
// });

// app.get('/admin', function(req, res){
// 	res.render(
// 		'admin',
// 		{articles: articles,
// 		appTitle:'blog-express'}
// 		);
// });

// app.get('/', function(req, res){
// 	res.render(
// 		'login'
// 		);
// });



// 在开发中，使用Express标准的错误处理器
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//GET和POST路由，主要是把Jade渲染成HTML
/*
  必须要首先读入这个index，同时在index.js中require进其余几个routes的js文件，
  同时要有exports.index方法
  否则会报Typeerror错误
 */
app.get('/',routes.index);
// app.get('/login',routes.user.login);
// app.post('/login',routes.user.authenticate);
// app.get('/logout',routes.user.logout);
// app.get('/admin',routes.article.admin);
// app.get('/post',routes.article.post);
// app.post('/post',routes,article.postArticle);
app.get('/articles/:slug',routes.article.show);

//REST API路由
app.get('/api/articles',routes.article.list);
// app.post('/api/articles',routes.article.add);
// app.put('/api/articles/:id',routes.article.edit);
// app.del('api/articles/:id',routes.article.del);

//404 catch-all路由(此路由一定放在路由最下方，顺序很重要)
app.all('*',function(req,res){
 	res.send(404);
});




var server = http.createServer(app);
var boot = function() {
	server.listen(
		app.get('port'),
		function(){
			console.info(
				'Express.js server is running on ' +
				app.get('port')
			);
		}
	);
}

var shutdown = function() {
	server.close();
}

if(require.main === module) {
	boot();
}else {
	console.info('Running app as a module');
	exports.boot = boot;
	exports.shutdown = shutdown;
	exports.port = app.get('port');
}