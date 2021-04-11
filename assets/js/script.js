var num = 4, // variable for total number of results should display on frontend
  airportJson = './assets/data/airports.json',
  $previous = document.getElementsByClassName('previous'),
  $next = document.getElementsByClassName('next'),
  $loader = document.getElementsByClassName('loader'),
  $results = document.getElementsByClassName('results'),
  li = '',
  ul = '',
  $message = document.getElementsByClassName('message'),
  $startNumElement = document.getElementsByClassName('start'),
  $endNumElement = document.getElementsByClassName('end'),
  $resTotal = document.getElementsByClassName('res-total'),
  $searchForm = document.getElementById('searchForm'),
  $searchField = document.querySelector('#searchForm input[type="search"]');

// function for creating list
function createList(dataR) {
  var name = dataR.name ? dataR.name : '-',
    icao = dataR.icao ? dataR.icao : '-',
    iata = dataR.iata ? dataR.iata : '-',
    elevation = dataR.elevation ? dataR.elevation : '-',
    latitude = dataR.latitude ? dataR.latitude : '-',
    longitude = dataR.longitude ? dataR.longitude : '-',
    type = dataR.type ? dataR.type : '-',
    nameLi,
    icaoLi,
    iataLi,
    elevationLi,
    latitudeLi,
    longitudeLi,
    typeLi;

  li = document.createElement('li');
  li.className = 'result';

  ul = document.createElement('ul');
  li.appendChild(ul);

  function createLi(list, value) {
    list = document.createElement('li');
    list.appendChild(document.createTextNode(value));
    ul.appendChild(list);
  }

  createLi(nameLi, name);
  createLi(icaoLi, icao);
  createLi(iataLi, iata);
  createLi(elevationLi, elevation);
  createLi(latitudeLi, latitude);
  createLi(longitudeLi, longitude);
  createLi(typeLi, type);

  document.getElementsByClassName('results')[0].appendChild(li);
}

// function for updating result numbers at bottom of the page
function updateResultNumbers(count) {
  if (count < num) {
    for (var j = 1; j <= count; j++) {
      document.querySelector('.result:nth-of-type(' + j + ')').classList.add('show');
    }
    $endNumElement[0].innerHTML = count;
  } else {
    for (var j = 1; j <= num; j++) {
      document.querySelector('.result:nth-of-type(' + j + ')').classList.add('show');
    }
    $endNumElement[0].innerHTML = num;
  }

  $startNumElement[0].innerHTML = 1;
  $resTotal[0].innerHTML = count;
}

// Show OR Hide message
function showHideMessage() {
  if (document.getElementsByClassName('result').length == 0) {
    $message[0].classList.add('show');
  } else {
    $message[0].classList.remove('show');
  }
}

// show results on page visit
fetch(airportJson)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var dataCount = Object.keys(data).length;

    $loader[0].classList.add('hide');

    for (var i = 0; i < dataCount; i++) {
      createList(data[i]);
    }

    updateResultNumbers(dataCount);
  });

// function for next button click
$next[0].addEventListener('click', function (e) {
  e.preventDefault();
  var startNum = parseInt($startNumElement[0].textContent),
    endNum = parseInt($endNumElement[0].textContent);

  // hide all existing results
  document.querySelectorAll('.result').forEach(result => {
    result.classList.remove('show');
  });

  // disable previous button for first page of result
  if (startNum == 1) {
    $previous[0].classList.remove('disable');
  }

  // show results according to pagination after user clicked on next button
  for (var i = endNum + 1; i < endNum + (num + 1); i++) {
    document.querySelector('.result:nth-of-type(' + i + ')').classList.add('show');
  }

  $startNumElement[0].textContent = (startNum + num);
  $endNumElement[0].textContent = (endNum + num);
});

// function for previous button click
$previous[0].addEventListener('click', function (e) {
  e.preventDefault();
  var startNum = parseInt($startNumElement[0].textContent),
    endNum = parseInt($endNumElement[0].textContent);

  // hide all existing results
  document.querySelectorAll('.result').forEach(result => {
    result.classList.remove('show');
  });

  // disable previous button for first page of result
  if (startNum == 1 + num) {
    $previous[0].classList.add('disable');
  } else {
    $previous[0].classList.remove('disable');
  }

  // show results according to pagination after user clicked on previous button
  for (var i = startNum - num; i <= endNum - num; i++) {
    document.querySelector('.result:nth-of-type(' + i + ')').classList.add('show');
  }

  $startNumElement[0].textContent = (startNum - num);
  $endNumElement[0].textContent = (endNum - num);
});

// function to show Checkbox results
function showCheckboxResults(data, typeObject, dataCount) {
  if (typeObject.length === 0) {
    for (var i = 0; i < dataCount; i++) {
      dataR = data[i];
      createList(dataR);
    }
  } else {
    for (var i = 0; i < dataCount; i++) {
      dataR = data[i];

      typeObject.forEach(function (value, index, array) {
        if (dataR.type == value) {
          createList(dataR);
        }
      });
    }
  }
}

// function to show search results
function searchResults(data, dataCount, searchVal, typeObject) {
  for (var i = 0; i < dataCount; i++) {
    var dataR = data[i];
    var name = dataR.name ? dataR.name.toString().toLowerCase() : '',
      icao = dataR.icao ? dataR.icao.toString().toLowerCase() : '',
      iata = dataR.iata ? dataR.iata.toString().toLowerCase() : '',
      elevation = dataR.elevation ? dataR.elevation.toString().toLowerCase() : '',
      latitude = dataR.latitude ? dataR.latitude.toString().toLowerCase() : '',
      longitude = dataR.longitude ? dataR.longitude.toString().toLowerCase() : '';

    if (typeObject == null) {
      if (name.indexOf(searchVal) !== -1 || icao.indexOf(searchVal) !== -1 || iata.indexOf(searchVal) !== -1 || elevation.indexOf(searchVal) !== -1 || latitude.indexOf(searchVal) !== -1 || longitude.indexOf(searchVal) !== -1) {
        createList(dataR);
      }
    } else {
      if (name.indexOf(searchVal) !== -1 || icao.indexOf(searchVal) !== -1 || iata.indexOf(searchVal) !== -1 || elevation.indexOf(searchVal) !== -1 || latitude.indexOf(searchVal) !== -1 || longitude.indexOf(searchVal) !== -1) {
        typeObject.forEach(function (value, index, array) {
          if (dataR.type == value) {
            createList(dataR);
          }
        });
      }
    }

  }
}

// function to show all filter results
function showFilterResults() {
  var searchVal = $searchField.value.toLowerCase(),
    typeObject = [];

  // remove all existing results
  document.querySelectorAll('.result').forEach(result => {
    result.remove();
  });
  $loader[0].classList.remove('hide');
  $message[0].classList.remove('hide');

  document.querySelectorAll('.type a.active').forEach(anchor => {
    typeObject.push(anchor.getAttribute('data-type'));
  });

  fetch(airportJson)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var dataCount = Object.keys(data).length;

      $loader[0].classList.add('hide');

      if (searchVal == "") {
        showCheckboxResults(data, typeObject, dataCount);
      } else {
        if (typeObject.length === 0) {
          searchResults(data, dataCount, searchVal, null);
        } else {
          searchResults(data, dataCount, searchVal, typeObject);
        }
      }

      showHideMessage();
      updateResultNumbers(document.querySelectorAll('.result').length);
    });
}

// function for when user clicks on type checkboxes
document.querySelectorAll('.type a').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.toggle('active');

    showFilterResults();
  });
});

// Search form submit
$searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  showFilterResults();
});
