// Get user's listing
exports.list = function(req,res){
	res.send('respond with a resource');
};

// Get login page
exports.login = function(req,res,next){
	res.render('login');
};

// Get logout route.
exports.logout = function(req,res,next){
	req.session.destroy();//清空session,就实现了注销
	res.redirect('/');
};

// POST quthenticate route.
exports.authenticate = function(req,res,next){
	if (!req.body.email || !req.body.password){
		return res.render('login', {error: 'Please enter your email and password'});
	}
	req.collections.users.findOne({
		email:req.body.email,
		password:req.body.password
	},function(error, user){
		if(error) return next(error);
		if(!user) return res.render('login', {error: 'Incorrect email and password combination'});
		req.session.user = user;
		req.session.admin = user.admin;
		res.redirect('/admin');
	});
};
