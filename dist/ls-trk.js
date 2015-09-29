(function(global) {
	'use strict';

	'use strict';

var debounce = function debounce(fn, delay) {
	var timer = null;

	return function () {
		var context = this,
		    args = arguments;

		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
};

var TIMEOUT = 1000;
var SESSIONID = String(Math.random() * 1e16);
var events = [];

var dispatch = debounce(function () {
	var stack = events.map(serialize);

	var req = new XMLHttpRequest();
	req.open('POST', 'http://t.leadsco.re/w');
	req.send(serialize(stack));
}, TIMEOUT);

function track(event, data) {
	var z = Number(new Date());
	var payload = {
		id: SESSIONID,
		e: event,
		_: data,
		z: z
	};

	events.push(payload);
	Tracker.dispatch(events);
}

function serialize(value) {
	return JSON.stringify(value);
}

function onInteract(event) {
	var viewport = getViewport();
	var position = getPosition(event);
	var interaction = getInteraction(event);

	track('i', {
		v: viewport,
		p: position,
		i: interaction
	});
}

function onScroll() {
	var viewport = getViewport();

	track('s', {
		v: viewport
	});
}

function getPosition(event) {
	return {
		x: event.clientX || event.pageX,
		y: event.clientY || event.pageY
	};
}

function getInteraction(event) {
	var u = undefined;
	var interaction = {
		ctrl: event.ctrlKey ? 1 : u,
		alt: event.altKey ? 1 : u,
		shift: event.shiftKey ? 1 : u,
		type: event.type
	};

	var element = event.srcElement || event.target;
	interaction.source = serializeElement(element);

	if (event instanceof KeyboardEvent) {
		interaction.key = event.keyIdentifier || event.keyCode;
	}

	if (event instanceof MouseEvent) {
		interaction.button = event.which;
	}

	return interaction;
}

function getViewport() {
	var body = document.body;

	return {
		x: body.scrollLeft,
		y: body.scrollTop,
		h: body.scrollHeight,
		w: body.scrollWidth
	};
}

function serializeElement(element) {
	var id = element.id ? '#' + element.id : '';
	var cls = element.className;
	var tag = String(element.tagName).toLowerCase();
	cls = cls && '.' + cls.split(/\s+/).sort().join('.');

	return tag + id + cls;
}

(function start() {
	var interval = 100;
	document.addEventListener('mouseup', debounce(onInteract, interval));
	document.addEventListener('keyup', debounce(onInteract, interval));
	window.addEventListener('scroll', debounce(onScroll, interval));
})();

var Tracker = {
	track: track,
	dispatch: dispatch
};
	global.LS = Tracker;
})(this);