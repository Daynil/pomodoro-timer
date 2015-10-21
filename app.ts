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
	isActive: boolean;

	constructor() {
		var defSessionLen = 25;
		this.sessionLen = defSessionLen;
		this.breakLen = 5;
		this.currTimer = defSessionLen;
		this.isActive = false;
	}

	incrLen(sendingInput) {
		if (sendingInput.id === 'session-incr') {
			this.sessionLen++;
			this.resetTimer();
		} else {
			this.breakLen++;
		}
	}
	
	decrLen(sendingInput) {
		if (sendingInput.id === 'session-decr') {
			if (this.sessionLen > 1) {
				this.sessionLen--;
				this.resetTimer();
			}
		} else {
			if (this.breakLen > 1) {
				this.breakLen--;
			}
		}
	}
	
	toggleTimer() {
		this.isActive = !this.isActive;
		if (this.isActive) {
			this.incrementTimer();
		}
	}
	
	incrementTimer() {
		if (this.currTimer > 0 && this.isActive) {
			setTimeout( () => {
				if (this.currTimer > 0 && this.isActive) {
					this.currTimer--;
					this.incrementTimer();
				}
			}, 1000);
		}
	}
	
	resetTimer() {
		this.isActive = false;
		this.currTimer = this.sessionLen;
	}
}

bootstrap(PomodoroApp);