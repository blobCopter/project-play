function	displayError(error)
{
	$("#errorField").css('display:block;');
	$("#errorField").text(error);
	return false;
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function	gMapsStaticApiRequest(centerX, centerY, items)
{
	var link = "https://maps.googleapis.com/maps/api/staticmap?";

	link+= "center=" + centerX + "," + centerY;
	link+= "&zoom=10";
	link+= "&size=600x300";
	link+= "&maptype=roadmap";
	link+= "&markers=color:red|label:G|" + centerX + "," + centerY;
	link+= "&markers=color:green|label:G";
	$.each(items, function(i, item)
	{
		link += "|" + item.geo[0] + "," + item.geo[1];
	});
	link += "&sensor=false";
	return link;
}


window.addEventListener('load', function()
{
	if (!navigator.geolocation)
		displayError("Your browser does not support geolocation.");

	$('#lookAroundButton').submit(function()
	{
		if (!navigator.geolocation)
			return false;

		var onGeolocationSuccess = function(position)
		{
			console.log(position);
			$('#position').text("My location : " + position.coords.latitude + "/" + position.coords.longitude);
			$.ajax({
				type: 'POST',
				url: "/lookaround",
				dataType: "JSON",
				data: { 
					posX : position.coords.latitude,
					posY : position.coords.longitude
				},
				success : function(data) {
					console.log(data);

					if (!data.success)
						return displayError(data.error);

					var items = [];
					$.each(data.nearby, function(i, item)
					{
						var distance = getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, item.geo[0], item.geo[1]);
						var color = '#f2dede';
						if (distance < 2)
							color = '#dff0d8';
						else if (distance < 5)
							color = '#d9edf7';
						else if (distance < 10)
							color = '#fcf8e3';


						items.push(
							"<tr style='background-color:" + color + "'>" +
								"<th>" + item.username + "</th>" +
								"<th>" + item.creationDate +"</th>" +
								"<th>" + distance + " km (" + item.geo[0] + "/" + item.geo[1] + ") </th>" +
							"</tr>"
						);
					});
					console.log(gMapsStaticApiRequest(position.coords.latitude, position.coords.longitude, data.nearby));
					document.getElementById('gamerMap').setAttribute('src', gMapsStaticApiRequest(position.coords.latitude, position.coords.longitude, data.nearby));
					$('#tableNearbyBody').html(items.join(' '));
				},
				error : function(err)
				{
					console.log('error');
					return displayError("Error. Unable to query server. Try again later.");
				}
			});
		};

		var onGeolocationFailure = function(error)
		{
			switch(error.code) 
			{
				case error.PERMISSION_DENIED:
				displayError("User denied the request for Geolocation.");
				break;
				case error.POSITION_UNAVAILABLE:
				displayError("Location information is unavailable.");
				break;
				case error.TIMEOUT:
				displayError("The request to get user location timed out.");
				break;
				case error.UNKNOWN_ERROR:
				displayError("An unknown error occurred.");
				break;
			}
		};

		navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationFailure);

		return false;
	});

}, false);