var restifyRouter	= require('restify-routing'),
    router          = new restifyRouter(),
	user			= require(process.cwd() + '/data/user.js');

router.get('/:region:/:platform:/:username:', function(req, res) {

	//Pull Username from req
	var platform	= req.params.platform,
		region		= req.params.region,
		username	= req.params.username;

	console.log(req.params);

	var successRes	= function(json){
		res.send(json);
	};

	var errorRes	= function(){
		res.send(500, "Internal Server Error");
	}

	var json = user(platform, username, region, successRes, errorRes);



});

module.exports = router;