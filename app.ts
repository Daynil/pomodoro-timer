import {Component, View, bootstrap} from 'angular2/angular2';

// Annotation section
@Component({
	selector: 'pomodoro-app'
})
@View({
	templateUrl: 'pomodorotimer.html',
	styleUrls: ['styles.css']
})
// Component controller
class PomodoroApp {
	sessionLen: number;
	breakLen: number;
	currTimer: number;

	constructor() {
		var defSessionLen = 25;
		this.sessionLen = defSessionLen;
		this.breakLen = 5;
		this.currTimer = defSessionLen;
	}

	incrLen(sendingInput) {
		if (sendingInput.id === 'session-incr') {
			this.sessionLen++;
		} else {
			this.breakLen++;
		}
	}
	
	decrLen(sendingInput) {
		if (sendingInput.id === 'session-decr') {
			if (this.sessionLen > 1) {
				this.sessionLen--;
			}
		} else {
			if (this.breakLen > 1) {
				this.breakLen--;
			}
		}
	}
	
	clicktest(item) {
		console.log("clicked on: " + item.id);
	}
}

bootstrap(PomodoroApp);