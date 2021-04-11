(function ($, w, d) {
	var num = 4, // variable for total number of results should display on frontend
		airportJson = './assets/data/airports.json',
		$previous = $('.previous'),
		$next = $('.next'),
		$loader = $('.loader'),
		$results = $('.results'),
		li,
		$message = $('.message'),
		$startNumElement = $('.res-numbers .start'),
		$endNumElement = $('.res-numbers .end'),
		$resTotal = $('.res-total'),
		$searchForm = $('#searchForm'),
		$searchField = $searchForm.find('input[type="search"]');

	// function for creating list
	function createList(dataR) {
		var name = dataR.name ? dataR.name : '-',
			icao = dataR.icao ? dataR.icao : '-',
			iata = dataR.iata ? dataR.iata : '-',
			elevation = dataR.elevation ? dataR.elevation : '-',
			latitude = dataR.latitude ? dataR.latitude : '-',
			longitude = dataR.longitude ? dataR.longitude : '-',
			type = dataR.type ? dataR.type : '-';

		li = `<li class="result">
			<ul>
				<li>` + name + `</li>
				<li>` + icao + `</li>
				<li>` + iata + `</li>
				<li>` + elevation + `</li>
				<li>` + latitude + `</li>
				<li>` + longitude + `</li>
				<li>` + type + `</li>
			</ul>
		</li>`;

		$results.append(li);
	}

	// function for updating result numbers at bottom of the page
	function updateResultNumbers(count) {
		for (var j = 1; j <= num; j++) {
			$('.result:nth-of-type(' + j + ')').addClass('show');
		}

		$startNumElement.text(1);
		$endNumElement.text(num);
		$resTotal.text(count);
	}

	// Show OR Hide message
	function showHideMessage() {
		if ($('.result').length == 0) {
			$message.addClass('show');
		} else {
			$message.removeClass('show');
		}
	}

	// show results on page load
	fetch(airportJson)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var dataR,
				dataCount = Object.keys(data).length;

			$loader.hide();

			for (var i = 0; i < dataCount; i++) {
				dataR = data[i];
				createList(dataR);
			}

			updateResultNumbers(dataCount);
		});

	// function for next button click
	$next.click(function (e) {
		e.preventDefault();
		var $startNumElement = $('.res-numbers .start'),
			startNum = parseInt($startNumElement.text()),
			$endNumElement = $('.res-numbers .end'),
			endNum = parseInt($endNumElement.text());

		// hide all existing results
		$('.result').removeClass('show');

		// disable previous button for first page of result
		if (startNum == 1) {
			$previous.removeClass('disable');
		}

		// show results according to pagination after user clicked on next button
		for (var i = endNum + 1; i < endNum + (num + 1); i++) {
			$('.result:nth-of-type(' + i + ')').addClass('show');
		}

		$startNumElement.text(startNum + num);
		$endNumElement.text(endNum + num);
	});

	// function for previous button click
	$previous.click(function (e) {
		e.preventDefault();
		var $startNumElement = $('.res-numbers .start'),
			startNum = parseInt($startNumElement.text()),
			$endNumElement = $('.res-numbers .end'),
			endNum = parseInt($endNumElement.text());

		// hide all existing results
		$('.result').removeClass('show');

		// disable previous button for first page of result
		if (startNum == 1 + num) {
			$previous.addClass('disable');
		} else {
			$previous.removeClass('disable');
		}

		// show results according to pagination after user clicked on previous button
		for (var i = startNum - num; i <= endNum - num; i++) {
			$('.result:nth-of-type(' + i + ')').addClass('show');
		}

		$startNumElement.text(startNum - num);
		$endNumElement.text(endNum - num);
	});

	// function for when user clicks on type checkboxes
	$('.type a').click(function (e) {
		e.preventDefault();
		$(this).toggleClass('active');

		var typeObject = [];

		$searchField.val('');

		// remove all existing results
		$('.result').remove();
		$loader.show();
		$message.removeClass('show');

		$('.type a.active').each(function (param) {
			typeObject.push($(this).attr('data-type'));
		});

		console.log(typeObject);

		fetch(airportJson)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var dataR,
					dataCount = Object.keys(data).length;

				$loader.hide();

				if (typeObject.length === 0) {
					for (var i = 0; i < dataCount; i++) {
						dataR = data[i];
						createList(dataR);
					}
				} else {
					for (var i = 0; i < dataCount; i++) {
						dataR = data[i];

						$.each(typeObject, function (index, value) {
							if (dataR.type == value) {
								createList(dataR);
							}
						});
					}
				}

				showHideMessage();
				updateResultNumbers($('.result').length)
			});
	});

	// Search form submit
	$searchForm.submit(function (e) {
		e.preventDefault();
		var $this = $(this),
			searchVal = $this.find('input[type="search"]').val().toLowerCase();

		// remove all existing results
		$('.result').remove();
		$loader.show();
		$message.removeClass('show');
		$('.type a').removeClass('active');

		fetch(airportJson)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				var dataR,
					dataCount = Object.keys(data).length;

				$loader.hide();

				if (searchVal == "") {
					for (var i = 0; i < dataCount; i++) {
						dataR = data[i];
						createList(dataR);
					}
				} else {
					for (var i = 0; i < dataCount; i++) {
						dataR = data[i];
						var name = dataR.name ? dataR.name.toString().toLowerCase() : '',
							icao = dataR.icao ? dataR.icao.toString().toLowerCase() : '',
							iata = dataR.iata ? dataR.iata.toString().toLowerCase() : '',
							elevation = dataR.elevation ? dataR.elevation.toString().toLowerCase() : '',
							latitude = dataR.latitude ? dataR.latitude.toString().toLowerCase() : '',
							longitude = dataR.longitude ? dataR.longitude.toString().toLowerCase() : '';

						if (name.indexOf(searchVal) !== -1 || icao.indexOf(searchVal) !== -1 || iata.indexOf(searchVal) !== -1 || elevation.indexOf(searchVal) !== -1 || latitude.indexOf(searchVal) !== -1 || longitude.indexOf(searchVal) !== -1) {
							createList(dataR);
						}
					}
				}

				showHideMessage();
				updateResultNumbers($('.result').length)
			});
	});
})(jQuery, window, document);