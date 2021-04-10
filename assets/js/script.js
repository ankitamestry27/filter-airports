(function ($, w, d) {
	fetch('./assets/data/airports.json')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data[0]);
			var $results = $('.results'),
				dataR,
				ul;

			for (var i = 0; i < 4; i++) {
				dataR = data[i];
				ul = `<li>
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
		});
})(jQuery, window, document);