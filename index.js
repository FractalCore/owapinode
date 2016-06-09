//Module Imports
var express			= require('express'),
	fs				= require('fs'),
	request			= require('request'),
	cachedRequest	= require('cached-request')(request),
	cheerio			= require('cheerio');

//Define cache directory and TTL (5 min)
var cacheDirectory = process.cwd()+"/tmp/cache";
cachedRequest.setCacheDirectory(cacheDirectory);
//cachedRequest.set('ttl', 300 * 1000);
//Initialize Express App
var app		= express();

//API Version
var apiver	= "1";

//Define Routes
app.get('/api/v'+ apiver +'/user/:username', function (req, res) {
	
	//Pull Username from req
	var username = req.params.username
	
	//Build the Scraped Profile URL
	var userProfileURL = 'https://playoverwatch.com/en-us/career/pc/us/' + username;
	var requestOptions = {
			url: userProfileURL,
			ttl: 300000
		}
	//Download the page for the user
	cachedRequest(requestOptions, function(error, response, html) {
		
		//SUPER basic error handling
		if (!error) {
			
			//Load the page into cheerio
			var $ = cheerio.load(html);
			
			//Build the JSON Response
			var json = {
				battlenetID: username,
				level:		$('div.u-vertical-center').text(),
				games:		$('section#stats-section>div>div:nth-child(4)>div:nth-child(1)>div:nth-child(7)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text(),
				gamesWon:	$('section#stats-section>div>div:nth-child(4)>div:nth-child(1)>div:nth-child(7)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text(),
				averages: {
					eliminations:	$('section#highlights-section>div>ul>li:nth-child(1)>div>div>h3').text(),
					damage:			$('section#highlights-section>div>ul>li:nth-child(2)>div>div>h3').text(),
					deaths:			$('section#highlights-section>div>ul>li:nth-child(3)>div>div>h3').text(),
					finalBlows:		$('section#highlights-section>div>ul>li:nth-child(4)>div>div>h3').text(),
					healing:		$('section#highlights-section>div>ul>li:nth-child(5)>div>div>h3').text(),
					objKills:		$('section#highlights-section>div>ul>li:nth-child(6)>div>div>h3').text(),
					objTime:		$('section#highlights-section>div>ul>li:nth-child(7)>div>div>h3').text(),
					soloKills:		$('section#highlights-section>div>ul>li:nth-child(8)>div>div>h3').text()
				}
			}
			
			res.send(JSON.stringify(json, null, 4));
			
		} else if(response.statusCode == 404) {
			res.status(400).send('{ "error": "username invalid"}');
		} else {
			res.status(500).send('{ "error": "server error" }');
		}
	})
	
});

app.listen(process.env.PORT, process.env.IP);

console.log("Now listening on ${process.env.IP}:${process.env.port}");