var restifyRouter	= require('restify-routing'),
	router			= new restifyRouter();

router.use('/v1/user', require('./user'));
router.use('/v2', require('./v2'));

module.exports = router;