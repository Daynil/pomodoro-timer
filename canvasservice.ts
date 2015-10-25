export class CanvasService {
	canvasCtx: any;
	options: {
		percent: number,
		size: number,
		lineWidth: number,
		rotate: number
	}
	radius: number;
	
	constructor() {
		this.options = {
			percent: 0,
			size: 300,
			lineWidth: 15,
			rotate: 0
		};
	}
	
	initializeCanvas(canvas) {
		this.canvasCtx = canvas.getContext('2d');
		this.canvasCtx.translate(this.options.size / 2, this.options.size / 2);
		this.canvasCtx.rotate((-1 / 2 + this.options.rotate / 180) * Math.PI);
		this.radius = (this.options.size - this.options.lineWidth) /2;
	}
	
	getEndAngle(currTimer: number, startingTimer: number) {
		var currPercent = (startingTimer - currTimer) / startingTimer;
		var endDegr = 360 * currPercent;  // How far into the circle to stop drawing line
		var endRads = (Math.PI/180) * endDegr;  // Canvas arcs use radians
		return endRads;
	}
	
	drawCircle(currTimer, startingTimer) {
		var endAngle = this.getEndAngle(currTimer, startingTimer);
		this.canvasCtx.beginPath();
		this.canvasCtx.arc(0, 0, this.radius, 0, endAngle, false);
		this.canvasCtx.strokeStyle = '#ffffff';
		this.canvasCtx.lineCap = 'round';
		this.canvasCtx.lineWidth = this.options.lineWidth;
		this.canvasCtx.stroke();
	}
}