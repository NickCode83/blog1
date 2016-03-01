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
	res.redirect('/');
};

// POST quthenticate route.
exports.authenticate = function(req,res,next){
	res.redirect('/admin');
};