#EVAMP
Find events near where you camp
https://Evamp--laurn17.repl.co

#Summary:
Camping in itself is great, but long camp trips can become a bit dull. Knowing what events are near you, being able to Uber/Lyft over to the venue, and then come back to the site to sleep for cheap would be even better!

#Code style:
Javascript, JQuery, HTML, CSS

#Screenshot:
![screenshot](https://i.imgur.com/EKlJJlL.png)


#Code Example:
	function onSubmit() {
	$('.js-search-form').on('submit', function(event) {
		event.preventDefault();
		DATA.page = 1;
    $('.js-event-results').html("");
		var address = $('.js-camp-query').val();
		var userStartDate = $('#eventStartQuery').val();
		var userEndDate = $('#eventEndQuery').val();
		geoLocateApiRequest(address);
		eventApiRequest(address, userStartDate, userEndDate);
	});
}

#API Reference:
Google/Geocode
Google/Places
Seatgeek/Events

#How to use?:
Enter the place youd like to camp in (City, State).
Enter your camping start date (09-17-2018).
Enter your camping end date (09-21-2018).
SEARCH
