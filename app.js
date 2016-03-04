var express = require("express");
var http = require("http");  //导入处理http协议的模块
var path = require("path");  //导入处理文件路径的模块
var mongoose = require("mongoose");
var routes = require('./routes');   //实际上注入的是请求处理程序
var models = require('./models');  //导入模型文件夹

var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog';

var db = mongoose.connect(dbUrl, {safe: true});

var cookieParser = require('cookie-parser');
var logger = require("morgan");//导入morgan日志模块
var errorHandler = require('errorhandler');  //导入错误处理模块
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var app = express();
app.locals.appTitle = 'blog-nick';

//添加一个中间件来暴露Mongoskin/MongoDBji集合在每个Expres.js中的路径，不要忘了调用next(),否则每个请求都要延迟
app.use(function(req, res, next) {
  if (!models.Article || !models.User) return next(new Error("No models."))
  req.models = models;
  return next();
});


app.set('port', process.env.PORT || 3000);  //设置服务器端口
app.set('views', './views');  //设置视图文件路径,这样在后面的路由中就可以用简洁的相对路径来表示
app.set('view engine', 'jade');  //设置模板引擎


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));//解析发送和接受的cookie,注意:cookieparser()需要在session()前执行,因为session需要依赖cookie才能正常工作
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}));//在每个请求体中暴露res.session对象,并且在内存或持久化存储(如MongoDB或Redis中)中存储session数据.
app.use(express.static(path.join(__dirname, 'public')));  //设置静态资源地址

// TODO: 测试

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

//用户认证中间件:为了把用户是否经过认证的信息传递给模板,这里实现了一个中间件,在判断req.session.admin为true时,会在res.locals中增加一个属性
app.use(function(req, res, next){
	if(req.session && req.session.admin){
		res.locals.admin = true;
	}
	next();
});

//权限管理
var authorize = function(req, res, next){
	if(req.session && req.session.admin){
		return next();
	}else{
		return res.send(401);
	}
};

//GET和POST路由，主要是把Jade渲染成HTML
/*
  必须要首先读入这个index，同时在index.js中require进其余几个routes的js文件，
  同时要有exports.index方法
  否则会报Typeerror错误
 */
app.get('/',routes.index);
app.get('/login',routes.user.login);
app.post('/login',routes.user.authenticate);
app.get('/logout',routes.user.logout);
app.get('/admin',authorize, routes.article.admin);
app.get('/post',authorize, routes.article.post);
app.post('/post',authorize, routes.article.postArticle);
app.get('/articles/:slug',authorize, routes.article.show);

//REST API路由
app.all('/api',authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.delete('/api/articles/:id', routes.article.del);

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