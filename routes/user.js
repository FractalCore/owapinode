//Import Modules
var restifyRouter	= require('restify-routing'),
	request			= require('request'),
	cachedRequest	= require('cached-request')(request),
	cheerio			= require('cheerio');

//Define the router to be exported
var router			= new restifyRouter();

//Basic stats, pretty much the bare minimum.
router.get('/:username', function(req, res) {

	//Pull Username from req
	var username = req.params.username;

	//Build the Scraped Profile URL
	var userProfileURL = 'https://playoverwatch.com/en-us/career/pc/us/' + username;
	var requestOptions = {
			url: userProfileURL,
			ttl: 300000
	}
	//Download the page for the user
	cachedRequest(requestOptions, function(error, response, html) {

		//TODO: Better handling of errors...
		if (!error) {

			//Load the page into cheerio
			var $ = cheerio.load(html);

			//Could do this in the JSON Builder, don't want to...
			var pDeath = parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(5)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')) - parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(5)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,''));

			//Build the JSON Response
			var json = {
				battlenetID: username,
				level:		$('div.show-for-lg>div:nth-child(1)>div').text(),
				averages: {
					timeOnFire:		$('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text(),
					soloKills:		parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,'')),
					objTime:		parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text().replace(/,/g,'')),
					objKills:		parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().replace(/,/g,'')),
					healing:		parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(5)>td:nth-child(2)').text().replace(/,/g,'')),
					finalBlows:		parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(6)>td:nth-child(2)').text().replace(/,/g,'')),
					deaths:			parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(7)>td:nth-child(2)').text().replace(/,/g,'')),
					damage:			parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(8)>td:nth-child(2)').text().replace(/,/g,'')),
					eliminations:	parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(4)>div>table>tbody>tr:nth-child(9)>td:nth-child(2)').text().replace(/,/g,''))
				},
				totals: {
					combat: {
						soloKills: 			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')),
						objectiveKills:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,'')),
						finalBlows:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text().replace(/,/g,'')),
						damageDone:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().replace(/,/g,'')),
						eliminations:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(5)>td:nth-child(2)').text().replace(/,/g,'')),
						environKills:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(6)>td:nth-child(2)').text().replace(/,/g,'')),
						multiKills:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(1)>div>table>tbody>tr:nth-child(7)>td:nth-child(2)').text().replace(/,/g,''))
					},
					deaths: {
						allDeaths:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(5)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')),
						envDeaths:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(5)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,'')),
						playerDeaths:		pDeath
					},
					awards: {
						cards:				parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(6)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')),
						totalMedals:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(6)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,'')),
						goldMedals:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(6)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text().replace(/,/g,'')),
						silverMedals:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(6)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().replace(/,/g,'')),
						bronzeMedals:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(6)>div>table>tbody>tr:nth-child(5)>td:nth-child(2)').text().replace(/,/g,''))
					},
					assists: {
						healing:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(2)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')),
						recon:				parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(2)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,''))
					},
					misc: {
						defensiveAssists:	parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(8)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text().replace(/,/g,'')),
						defensiveAssistAvg:	parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(8)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text().replace(/,/g,'')),
						offensiveAssists:	parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(8)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text().replace(/,/g,'')),
						offensiveAssistAvg: parseFloat($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(8)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().replace(/,/g,''))
					},
					best: {
						eliminations:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text()),
						finalBlows:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text()),
						damageDone:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text()),
						healingDone:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text()),
						defensiveAssists:	parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(5)>td:nth-child(2)').text()),
						offensiveAssists:	parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(6)>td:nth-child(2)').text()),
						objectiveKills:		parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(7)>td:nth-child(2)').text()),
						objectiveTime:		$('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(8)>td:nth-child(2)').text(),
						mutiKill:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(9)>td:nth-child(2)').text()),
						soloKill:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(10)>td:nth-child(2)').text()),
						timeOnFire:			$('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(3)>div>table>tbody>tr:nth-child(11)>td:nth-child(2)').text()
					},
					games: {
						gamesWon:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(7)>div>table>tbody>tr:nth-child(1)>td:nth-child(2)').text()),
						timeOnFire:			$('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(7)>div>table>tbody>tr:nth-child(2)>td:nth-child(2)').text(),
						objectiveTime:		$('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(7)>div>table>tbody>tr:nth-child(3)>td:nth-child(2)').text(),
						timePlayed:			parseInt($('div#quickplay>section:nth-child(3)>div>div:nth-child(3)>div:nth-child(7)>div>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().replace(' hours',''))
					}
				}
			};

			res.send(json);

		} else {
			res.send(500, { error: "server error"})
		}
	})

})

module.exports = router;