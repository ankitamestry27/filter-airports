(function ($, w, d) {
	// variable for total number of results should display on frontend
	var num = 4,
		$previous = $('.previous'),
		$next = $('.next');

	// show results on page load
	fetch('./assets/data/airports.json')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			var $results = $('.results'),
				$loader = $('.loader'),
				dataR,
				ul,
				dataCount = Object.keys(data).length,
				$startNumElement = $('.res-numbers .start'),
				$endNumElement = $('.res-numbers .end'),
				$resTotal = $('.res-total');

			$loader.hide();

			for (var i = 0; i < dataCount; i++) {
				dataR = data[i];
				ul = `<li class="result">
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

				$results.append(ul);
			}

			for (var j = 1; j <= num; j++) {
				$('.result:nth-of-type(' + j + ')').addClass('show');
			}

			$startNumElement.text(1);
			$endNumElement.text(num);
			$resTotal.text(dataCount);
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


		if (startNum == 1) {
			$previous.addClass('disable');
		} else {
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

		if (startNum == 1 + num) {
			$previous.addClass('disable');
		} else {
			$previous.removeClass('disable');
		}

		// show results according to pagination after user clicked on previous button
		for (var i = startNum - (num + 1); i < startNum - 1; i++) {
			$('.result:nth-of-type(' + i + ')').addClass('show');
		}

		$startNumElement.text(startNum - num);
		$endNumElement.text(endNum - num);
	});
})(jQuery, window, document);