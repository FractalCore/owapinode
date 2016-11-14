var restifyRouter	= require('restify-routing'),
    router          = new restifyRouter(),
	user			= require(process.cwd() + '/data/user.js');

router.get('/:region/:platform/:username', function(req, res) {

	console.log(req.params);

	user(req.params.platform, req.params.username, req.params.region,
		function(json) { res.send(json); },
		function() { res.send(500, "Internal Server Error" ); }
	);



});

module.exports = router;