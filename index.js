'use strict';

// https://platform.seatgeek.com/#events
const SEATGEEK_EVENTS_URL = 'https://api.seatgeek.com/2/events';

// WHEN THE FORM IS SUBMITTED

function onSubmit() {
  console.log(`submit ran`);

	$('.js-search-form').on('submit', function(event) {
		event.preventDefault();
		var address = $('.js-camp-query').val();
    // geoLocateApiRequest(address);
		var userStartDate = $("#eventStartQuery").val();
    var userEndDate = $('#eventEndQuery').val();
		eventApiRequest(address, userStartDate, userEndDate);
	});
};

// CITY, STATE -> LAT, LONG
// function geoLocateApiRequest(address) {

// 	const queryA = {
// 		address: address,
// 	}

// 	const geocoder = new google.maps.Geocoder();
// 	geocoder.geocode(queryA, function(results, status) {
// 		if (status == 'OK') {
// 			campApiRequest(results);
// 		} 
//     else {
// 			alert('Geocode was not successful for the following reason: ' + status);
// 		}
// 	});
// }

// // REQUEST FOR API INFO FROM GOOGLE PLACES
// function campApiRequest(data) {

	// var latLon = data[0].geometry.location;
// 	console.log(latLon);

// 	var queryB = {
// 		location: latLon,
// 		rankby: 'distance',
// 		keyword: 'recreation',
//     radius: 32186,
// 		type: 'campground',
// 	};

//   // Can we talk more abot line 44?
//   var div = document.createElement('div');
// 	service = new google.maps.places.PlacesService(div);
// 	service.nearbySearch(queryB, function(results, status) {
//     if (status == 'OK') {
//       displayCampResults(results);
//     }
//     else {
//       alert(`There are no campgrounds found for this city`);
//     }
// });
// };

// REQUEST FOR API INFO FROM SEATGEEK
function eventApiRequest(address, userStartDate, userEndDate) {
  const queryC = {
    client_id: "MTIwODI3NzZ8MTUzMDEzNzg3NC43Ng",
    q: address,
       // year-month-day
    "datetime_UTC.gte": userStartDate,
    "datetime_UTC.lt": userEndDate,
    per_page: 4
    }

  $.getJSON(SEATGEEK_EVENTS_URL, queryC, function (results) {
    if (results.meta.total == 0) {
      alert("No Events Found");
      }
    else {
      console.log(`displayEventResults Ran`);
     displayEventResults(results);
      }
    });
};


// ----------------------------------------------------
// DISPLAYING WHAT THE API RETURNED IN THE DOM

// function displayCampResults(campArray) {
// 	let campResultItem = '';
// 	$.each(campArray, function(index, value) {
// 		campResultItem += `
//     <div class="camp-container" tabindex=${index}>
//       <p class="camp-title">${value.name}</p>
//       <p class="camp-location">${value.vicinity}</p>
//       <div class="img-container">
//         <a href="${value.url}" target='_blank'>
        
//         </a>
//       </div>
//     </div>
//     `;
// 	});

// 	$('.js-camp-results')
//      .prop('hidden', false)
//      .html(campResultItem);
// }

// value always has to come before index
function displayEventResults(results) {
  const eventResultItem = results.events.map(function(value, index) {
  return `<div class="event-container" tabindex=${index}>
      <p class="event-type"> ${value.type} </p>
      <p class="event-name">${value.title}</p>

    </div>`;
  }).join('');

$(".js-event-results")
    .prop('hidden', false)
    .html(eventResultItem);
};

// ----------------------------------------------
// RUNNING THE FINAL FUNCTIONS

$(onSubmit);

// ENTER ON LINE 120
// <p class="event-location">${value.performers.venue.address}</p>
      // <div class="img-container">
      //   <a href="${value.photos.html_attributions}" target='_blank'>
      //   <img src="${value.photos.photo_reference}" alt="${value.title}"/>
      //   </a>
      // </div>