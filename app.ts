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
	timerCanvas;

	constructor(public canvasService: CanvasService) {
		var defSessionLen = 25;
		this.sessionLen = defSessionLen;
		this.breakLen = 5;
		this.currTimer = defSessionLen;
		this.isActive = false;
		this.timerCanvas = document.getElementById("timer-canvas");
		this.canvasService.initializeCanvas(this.timerCanvas);
	}
	
	sessLenTyped(newSess) {
		this.sessionLen = newSess;
		this.resetTimer();
	}
	
	breakLenTyped(newBreak) {
		this.breakLen = newBreak;
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
					this.canvasService.drawTimer(this.currTimer, this.sessionLen);
					this.incrementTimer();
				}
			}, 1000);
		}
	}
	
	resetTimer() {
		this.isActive = false;
		this.currTimer = this.sessionLen;
		this.canvasService.clearCanvas();
		this.canvasService.resetAnimationHelper();
	}
}

bootstrap(PomodoroApp)
	.then(
		success => console.log(success),
		error => console.log(error)
	);