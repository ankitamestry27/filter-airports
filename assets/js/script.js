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
		$resTotal = $('.res-total');

	// function for creating list
	function createList(dataR) {
		li = `<li class="result">
			<ul>
				<li>` + dataR.name + `</li>
				<li>` + dataR.icao + `</li>
				<li>` + dataR.iata + `</li>
				<li>` + dataR.elevation + `</li>
				<li>` + dataR.latitude + `</li>
				<li>` + dataR.longitude + `</li>
				<li>` + dataR.type + `</li>
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


		// if (startNum == 1) {
		// 	$previous.addClass('disable');
		// } else {
		// 	$previous.removeClass('disable');
		// }

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

		// if (startNum == 1 + num) {
		// 	$previous.addClass('disable');
		// } else {
		// 	$previous.removeClass('disable');
		// }

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

		var $this = $(this),
			typeObject = [];

		$this.toggleClass('active');

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
					console.log('hit');
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

				if ($('.result').length == 0) {
					$message.addClass('show');
				} else {
					$message.removeClass('show');
				}

				updateResultNumbers($('.result').length)
			});
	});
})(jQuery, window, document);