function	displayError(error)
{
	$("#errorField").css('display:block;');
	$("#errorField").text(error);
	return false;
};

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
			$.ajax({
				type: 'POST',
				url: "/geosearch",
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
						items.push(
							"<tr>" +
								"<th>" + item.username + "</th>" +
								"<th>" + item.creationDate +"</th>" +
								"<th>" + item.geo[0] + "/" + item.geo[1] + " </th>" +
							"</tr>"
						);
					});
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