window.addEventListener('load', function()
{

	$('#gameEntryField').autocomplete({
        source: function(query, process) {
            $.ajax({
                url: '/rest/games/search',
                type: 'GET',
                data: 'name=' + query.term,
                dataType: 'JSON',
                async: true,
                success: function(data) {

                	if (typeof data != 'undefined')
                		if (data.Data)
                		{
                    		process(data.Data.GameTitle);
                    	}
                },
                error: function(err)
                {
                }
            });
        }
    });

}, false);