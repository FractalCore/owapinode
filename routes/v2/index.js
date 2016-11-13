var restifyRouter	= require('restify-routing'),
    router			= new restifyRouter();

router.use('/user', require('./user'));

module.exports = router;