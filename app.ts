import {Component, View, bootstrap, CORE_DIRECTIVES} from 'angular2/angular2'; 
import {CanvasService} from './canvasservice'

// Annotation section
@Component({
	selector: 'pomodoro-app',
	bindings: [CanvasService]
})
@View({
	templateUrl: 'pomodorotimer.html',
	styleUrls: ['styles.css'],
	directives: [CORE_DIRECTIVES]
})
// Component controller
class PomodoroApp {
	sessionLen: number;
	breakLen: number;
	currTimer: number;
	currTimerDisplay: string;
	isActive: boolean;
	isBreak: boolean;
	sessBreakTxt: string;
	alertSound = new Audio('https://www.freesound.org/people/bradwesson/sounds/135936/download/135936__bradwesson__collectcoin.wav');

	constructor(public canvasService: CanvasService) {
		var defSessionLen = 25;
		this.sessionLen = defSessionLen;
		this.breakLen = 5;
		this.currTimer = defSessionLen * 60;
		this.updateStringTimer();
		this.isActive = false;
		this.isBreak = false;
		this.sessBreakTxt = "Session";
		var timerCanvas = document.getElementById("timer-canvas");
		var glowCanvas = document.getElementById("glow-canvas");
		this.canvasService.initializeCanvas(timerCanvas, glowCanvas);
	}
	
	sessLenTyped(newSess) {
		var isValid = this.validateInput(newSess);
		if (isValid) {
			this.sessionLen = newSess;
			this.resetTimer(false, true);
		}
	}
	
	breakLenTyped(newBreak) {
		var isValid = this.validateInput(newBreak);
		if (isValid) {
			this.breakLen = newBreak;
			this.resetTimer(false, true);
		}
	}
	
	validateInput(input) {
		// We only want numerical inputs
		var regex = /\D/g;
		return !regex.test(input) && !(input.length === 0) && input <= 99;
	}

	incrLen(sendingInput) {
		if (sendingInput.id === 'session-incr') {
			this.sessionLen++;
			this.resetTimer(false, true);
		} else {
			this.breakLen++;
			this.resetTimer(false, true);
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
				this.resetTimer(false, true);
			}
		}
	}
	
	toggleTimer() {
		this.glowAnimate();
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
					this.tick();
					this.canvasService.drawTimer(this.currTimer, startingTimer * 60);
					this.incrementTimer();
				} else if (this.currTimer === 0) {
					this.isBreak = !this.isBreak;
					this.resetTimer(this.isBreak, false);
					this.alertSound.play();
					this.incrementTimer();
				}
			}, 1000);
		}
	}
	
	resetTimer(isBreak: boolean, refresh: boolean) {
		this.canvasService.clearCanvas(this.canvasService.canvasCtx);
		this.canvasService.resetAnimationHelper();
		if (isBreak) {
			this.currTimer = this.breakLen * 60;
			this.sessBreakTxt = "Break!";
		} else {
			this.currTimer = this.sessionLen * 60;
			this.sessBreakTxt = "Session";
		}
		if (refresh) {
			this.isActive = false;
		} else {
			this.glowAnimate();
		}
		this.updateStringTimer();
	}
	
	tick() {
		this.currTimer--;
		this.updateStringTimer();
	}
	
	updateStringTimer() {
		var totalSecsLeft = this.currTimer;
		var minutes = Math.floor(totalSecsLeft / 60) + '';
		var seconds = totalSecsLeft % 60 + '';
		//if (minutes.length < 2) minutes = '0' + minutes;
		if (seconds.length < 2) seconds = '0' + seconds;
		this.currTimerDisplay = `${minutes}:${seconds}`
	}
	
	glowAnimate() {
		this.canvasService.glowAnimator.animating = true;
		requestAnimationFrame(this.canvasService.glowCircle.bind(this.canvasService));
	}
	
	setPlayClasses() {
		return {
			"fa": true,
			"fa-play": !this.isActive,
			"fa-pause": this.isActive
		}
	}
}

bootstrap(PomodoroApp)
	.then(
		success => console.log(success),
		error => console.log(error)
	);