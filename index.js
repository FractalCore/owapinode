//Initialize the special sauce...
var restify	= require('restify'),
	restifyRouter	= require('restify-routing');

//Create the Restify server
var server = restify.createServer({
	name: 'OWAPI'
});

//Define router
var router = new restifyRouter();
router.get('/', function(req, res){
    res.send(200, 'Fuck off!')
});

//Shove API requests to make index.js slimmer...
router.use('/api', require('./routes'));

//Make the magic happen (and lock the routes)
router.applyRoutes(server)

//Startup the server.
server.listen(8031);


