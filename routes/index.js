var restifyRouter	= require('restify-routing'),
	router			= new restifyRouter();

router.use('/v1/user', require('./user'));

module.exports = router;