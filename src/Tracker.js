/**
 * @class Tracker
 *
 * - Create session ID
 * - Pile up events
 * - Finish tracking on signup
 *
 *
 */
class Tracker {
	constructor() {
		this.id = Math.random() * 9999999999;
		this.events = [];
	}

	track(event, data) {
		this.events.push({e:event,d:data,t:Date.now()})
	}
}

class DocumentTracker extends Tracker {
	constructor(document) {
		document.
	}
}