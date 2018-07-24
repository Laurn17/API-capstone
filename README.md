# EVAMP
Find events near where you camp

#Motivation:
Camping in itself is fun. But being able to Uber/Lyft over to a fun event and then come back to the site to sleep for cheap would be Great!

#Code style:
Javascript, JQuery

#Screenshot:
![screenshot](https://i.imgur.com/GWaJmTz.png)

#Code Example
	$('.js-search-form').on('submit', function(event) {
		event.preventDefault();
		var address = $('.js-camp-query').val();
    geoLocateApiRequest(address);
		var userStartDate = $("#eventStartQuery").val();
    var userEndDate = $('#eventEndQuery').val();
		eventApiRequest(address, userStartDate, userEndDate);
	});
};

#API Reference:
Google/Geocode
Google/Places
Seatgeek/Events

#How to use?:
Enter the place youd like to camp in (City, State).
Enter your camping start date (09-17-2018).
Enter your camping end date (09-21-2018).
SEARCH
