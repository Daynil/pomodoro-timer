import {Component, View, bootstrap} from 'angular2/angular2';
import {CanvasService} from './canvasservice'

// Annotation section
@Component({
	selector: 'pomodoro-app',
	bindings: [CanvasService]
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
	isBreak: boolean;
	sessBreakTxt: string;
	timerCanvas;

	constructor(public canvasService: CanvasService) {
		var defSessionLen = 25;
		this.sessionLen = defSessionLen;
		this.breakLen = 5;
		this.currTimer = defSessionLen;
		this.isActive = false;
		this.isBreak = false;
		this.sessBreakTxt = "Session";
		this.timerCanvas = document.getElementById("timer-canvas");
		this.canvasService.initializeCanvas(this.timerCanvas);
	}
	
	sessLenTyped(newSess) {
		this.sessionLen = newSess;
		this.resetTimer(false, true);
	}
	
	breakLenTyped(newBreak) {
		this.breakLen = newBreak;
	}

	incrLen(sendingInput) {
		if (sendingInput.id === 'session-incr') {
			this.sessionLen++;
			this.resetTimer(false, true);
		} else {
			this.breakLen++;
		}
	}
	
	decrLen(sendingInput) {
		if (sendingInput.id === 'session-decr') {
			if (this.sessionLen > 1) {
				this.sessionLen--;
				this.resetTimer(false, true);
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
		if (this.isActive) {
			setTimeout( () => {
				if (this.currTimer > 0 && this.isActive) {
					let startingTimer = this.isBreak ? this.breakLen : this.sessionLen;
					this.currTimer--;
					this.canvasService.drawTimer(this.currTimer, startingTimer);
					this.incrementTimer();
				} else if (this.currTimer === 0) {
					this.isBreak = !this.isBreak;
					this.resetTimer(this.isBreak, false);
					this.incrementTimer();
				}
			}, 1000);
		}
	}
	
	resetTimer(isBreak: boolean, refresh: boolean) {
		this.canvasService.clearCanvas();
		this.canvasService.resetAnimationHelper();
		if (isBreak) {
			this.currTimer = this.breakLen;
			this.sessBreakTxt = "Break!";
		} else {
			this.currTimer = this.sessionLen;
			this.sessBreakTxt = "Session";
		}
		if (refresh) {
			this.isActive = false;
		}
	}
}

bootstrap(PomodoroApp)
	.then(
		success => console.log(success),
		error => console.log(error)
	);