'use strict';

const debounce = function(fn, delay) {
	var timer = null;

	return function() {
		var context = this,
			args = arguments;

		clearTimeout(timer);
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
};


const TIMEOUT = 1000;
const SESSIONID = String(Math.random() * 1e16);
const events = [];

const dispatch = debounce(function() {
	let stack = events.map(serialize);

	var req = new XMLHttpRequest();
	req.open('POST', 'http://t.leadsco.re/w');
	req.send(serialize(stack));
}, TIMEOUT);

function track(event, data) {
	let z = Number(new Date());
	let payload = {
		id: SESSIONID,
		e: event,
		_: data,
		z
	};

	events.push(payload);
	Tracker.dispatch(events);
}

function serialize(value) {
	return JSON.stringify(value);
}

function onInteract(event) {
	let viewport = getViewport();
	let position = getPosition(event);
	let interaction = getInteraction(event);

	track('i', {
		v: viewport,
		p: position,
		i: interaction
	});
}

function onScroll() {
	let viewport = getViewport();

	track('s', {
		v: viewport
	});
}

function getPosition(event) {
	return {
		x: event.clientX || event.pageX,
		y: event.clientY || event.pageY,
	};
}

function getInteraction(event) {
	let u;
	let interaction = {
		ctrl: event.ctrlKey ? 1 : u,
		alt: event.altKey ? 1 : u,
		shift: event.shiftKey ? 1 : u,
		type: event.type
	};

	let element = event.srcElement || event.target;
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
	let body = document.body;

	return {
		x: body.scrollLeft,
		y: body.scrollTop,
		h: body.scrollHeight,
		w: body.scrollWidth
	};
}

function serializeElement(element) {
	let id = element.id ? '#' + element.id : '';
	let cls = element.className;
	let tag = String(element.tagName).toLowerCase();
	cls = cls && '.' + cls.split(/\s+/).sort().join('.');

	return tag + id + cls;
}

(function start() {
	let interval = 100;
	document.addEventListener('mouseup', debounce(onInteract, interval));
	document.addEventListener('keyup', debounce(onInteract, interval));
	window.addEventListener('scroll', debounce(onScroll, interval));
})();

const Tracker = {
	track: track,
	dispatch: dispatch
};
