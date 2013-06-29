var http = require("http");
var parseXML = require('xml2js').parseString;
var async = require('async');

// GET /rest/games
// params : name
exports.searchGamesByName = function(req, res)
{
	if (!req.query['name'] || req.query['name'].length == 0)
	{
		res.send({
			Data : {
				GameTitle : []
			}
		});
		return;
	}
	var my_request = http.get('http://thegamesdb.net/api/GetGamesList.php?name=' + req.query['name'],
		function(resp)
		{
			resp.on('data', function(chunk){
				

				xml = "<Data>";
				lines = chunk.toString().split('\n');
				//
				// ASYNC FOREACH TO AVOID BLOCKING
				//
				async.each(lines,
					function(line, next)
					{
						if (line.indexOf("GameTitle") > -1)
							xml += line;
						next(); // no error
					},
					function(err)
					{
						xml += "</Data>";
						parseXML(xml, function (err, result) {
						    if (err)
				    		{
				    			res.send({
				    				Data : {
				    					GameTitle : ["..."]
				    				}
				    			});
					    	}
						    else
						    {
						    	res.send(result);
						    }
						});
					});
			 });
		});

	my_request.on('error', function(e)
	{
		res.send({
			Data : {
				GameTitle : ["..."]
			}
		});
	});
}