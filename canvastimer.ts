import {Component, View} from 'angular2/angular2';
import {CanvasService} from './canvasservice'

@Component({
	selector: 'canvas-timer',
	inputs: ['currTimer', 'startingTimer'],
	bindings: [CanvasService]
})
@View({
	templateUrl: 'canvastimer.html'
})
export class CanvasTimer {
	currTimer: number;
	startingTimer: number;
	timerCanvas;
	
	constructor(public canvasService: CanvasService) {
		this.timerCanvas = document.getElementById("timerCanvas");
		this.canvasService.initializeCanvas(this.timerCanvas);
		this.canvasService.drawCircle(1, 30);
	}
}