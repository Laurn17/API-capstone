'use strict';

// https://platform.seatgeek.com/#events
const SEATGEEK_EVENTS_URL = 'https://api.seatgeek.com/2/events';

const DATA = {
  page: 1,
};

// WHEN THE FORM IS SUBMITTED
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

// REQUEST FOR GEOCODE API CITY, STATE -> LAT, LONG
function geoLocateApiRequest(address) {
  const queryA = {
    address: address,
  };

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(queryA, function(results, status) {
    if (status == 'OK') {
      campApiRequest(results);
    } 
    else if (status == 'ZERO_RESULTS') {
    const displayZero = `<p class="zero"><b>ZERO RESULTS</b>.<br>This may occur when the "Where" input was passed a non-existent location.</p>`
    $('#campTitle').prop('hidden', false);
    $('.js-camp-results').prop('hidden', false).html(displayZero);
    }
    else {
      $('.js-camp-results').prop('hidden', false).html(`<p class="zero">INVALID REQUEST: Something was entered incorrectly</p>`);
    }
  });
}

// // REQUEST FOR API INFO FROM GOOGLE PLACES
function campApiRequest(data) {
  var latLon = data[0].geometry.location;
  console.log(latLon);

  var queryB = {
    location: latLon,
    rankby: 'distance',
    keyword: 'recreation',
    radius: 32186,
    type: 'campground',
  };

  var div = document.createElement('div');
  var service = new google.maps.places.PlacesService(div);
  service.nearbySearch(queryB, function(results, status) {
    if (status == 'OK') {
      displayCampResults(results);
    }
    else {
      const displayNoCamps = `<p class="zero"><b>UH OH.</b><br>Unfortunately there are no campgrounds in this area.</p>`
    $('#campTitle').prop('hidden', false);
    $('.js-camp-results').prop('hidden', false).html(displayNoCamps);
    }
  });
}

// REQUEST FOR API INFO FROM SEATGEEK
function eventApiRequest(address, userStartDate, userEndDate) {
  const queryC = {
    client_id: 'MTIwODI3NzZ8MTUzMDEzNzg3NC43Ng',
    q: address,
    // year-month-day
    'datetime_UTC.gte': userStartDate,
    'datetime_UTC.lt': userEndDate,
    page: DATA.page,
    per_page: 8,
  };

  $.getJSON(SEATGEEK_EVENTS_URL, queryC, function(results) {
    if (results.meta.total == 0) {
      const displayNoEvents = `<p class="zero"><b>UH OH.</b><br>Unfortunately there are no events in this area for these dates.</p>`
    $('#eventTitle').prop('hidden', false);
    $('.js-event-results').prop('hidden', false).html(displayNoEvents);
    } 
    else {
      console.log(`displayEventResults Ran`);
      displayEventResults(results);
    }
  });
}

// ----------------------------------------------------
// DISPLAYING WHAT THE API RETURNED IN THE DOM

function displayCampResults(campArray) {
  let campResultItem = '';
  $.each(campArray, function(index, value) {
    campResultItem += `
    <div class="camp-container">
      <p class="camp-title"><b>${value.name}</b></p>
      <p class="camp-location">${value.vicinity}</p>
      <div class="img-container">
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          value.name + ' ' + value.vicinity
        )}" target='_blank'> View Map <br>
         <img class="campImg" src="https://maps.googleapis.com/maps/api/staticmap?center=${value.name}&zoom=17&size=370x225&maptype=roadmap&key=AIzaSyDLn_DZDbKqkwcQwNsNSOfuMyNv4NbiSTo" alt="A map of ${value.name}" />
        </a>
      </div>
    </div>
    `;
  });

  $('#campTitle').prop('hidden', false);

  $('.js-camp-results').prop('hidden', false).html(campResultItem);
}

function getEventImage(performer) {
  let image = null;
  let genres = null;
  let genre = null;
  if (performer) {
    genres = performer.genres;
  }
  if (genres) {
    genre = genres.find(function(genre) {
      return genre.image != null;
    });
  }

  if (genre) {
    image = genre.image;
  }
  if (image == null) {
    image = performer.image;
  }
  return image;
}

function displayEventImage(imageUrl) {
  if (imageUrl == null) {
    return `<img class="eventImg" src="http://www.scaleautomag.com/sitefiles/images/no-preview-available.png" alt="No Image Available" width="370" />`;
  } else {
    return `<img class="eventImg" src="${imageUrl}" width="370" height="auto" alt="an image of the venue" />`;
  }
}

// value always has to come before index
function displayEventResults(results) {
  const eventResultItem = results.events
    .map(function(value, index) {
      var date = new Date(value.datetime_utc);
      var formatDateTime = date.toUTCString();
      const image = getEventImage(value.performers[0]);
      return `<div class="event-container">
      <p class="event-name"><b>${value.title}</b>
      <br>
      ${value.type}</p>
      <p> ${formatDateTime} </p>
      <p class="event-location">${value.venue.address}
      <br>
      ${value.venue.extended_address}</p>
      <div class="img-container">
        <a href="${value.url}" target='_blank' aria-label="Display Event">
        ${displayEventImage(image)}
        </a>
      </div>
      </div>`;
    })
    .join('');

  $('#eventTitle').prop('hidden', false);

  $('.js-event-results').prop('hidden', false).append(eventResultItem);

  $('.eventsButton').prop('hidden', false).css('visibility', 'visible');

  onMoreEvents();
}

function onMoreEvents() {
  $('.more.eventsButton').on('click', function(event) {
    event.preventDefault();
    DATA.page++;
    var address = $('.js-camp-query').val();
    var userStartDate = $('#eventStartQuery').val();
    var userEndDate = $('#eventEndQuery').val();
    eventApiRequest(address, userStartDate, userEndDate);
  });
}

// ----------------------------------------------
// RUNNING THE FINAL FUNCTIONS
$(onSubmit);