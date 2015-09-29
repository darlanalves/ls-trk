window.LS.dispatch = function(events) {
	events.forEach(function(e) {
		console.log(JSON.stringify(e));
	});

	events.length = 0;
}
