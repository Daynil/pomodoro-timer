export class CanvasService {
	canvasCtx: any;
	glowCanvasCtx: any;
	options: {
		percent: number,
		size: number,
		lineWidth: number,
		rotate: number
	}
	radius: number;
	animationHelper = {
		startPoint: null,
		endPoint: 0,
		framePoints: [],
		lastPoint: 0
	}
	glowAnimator = {
		animating: false,
		fading: false,
		transparency: 0.01
	}
	
	constructor() {
		this.options = {
			percent: 0,
			size: 350,
			lineWidth: 5,
			rotate: 0
		};
	}
	
	initializeCanvas(canvas, glowCanvas) {
		console.log("initializeCanvas called here");
		this.canvasCtx = canvas.getContext('2d');
		this.canvasCtx.translate(this.options.size / 2, this.options.size / 2);
		this.canvasCtx.rotate((-1 / 2 + this.options.rotate / 180) * Math.PI);
		this.glowCanvasCtx = glowCanvas.getContext('2d');
		this.glowCanvasCtx.translate(this.options.size / 2, this.options.size /2);
		this.glowCanvasCtx.rotate((-1 / 2 + this.options.rotate / 180) * Math.PI);
		this.radius = (this.options.size - this.options.lineWidth) /2;
		this.drawBase();
	}
	
	getEndAngle(currTimer: number, startingTimer: number) {
		var currPercent = (startingTimer - currTimer) / startingTimer;
		var endDegr = 360 * currPercent;  // How far into the circle to stop drawing line
		var endRads = this.getRadians(endDegr);  // Canvas arcs use radians
		return endRads;
	}
	
	getRadians(degrees) {
		return (Math.PI/180) * degrees;
	}
	
	getDegrees(radians) {
		return (180 * radians) / Math.PI;
	}
	
	drawBase() {
		this.canvasCtx.beginPath();
		this.canvasCtx.arc(0, 0, this.radius, 0, (Math.PI/180 * 360), false);
		this.canvasCtx.strokeStyle = "hsla(3, 65%, 52%, 0.15)";
		this.canvasCtx.lineCap = 'round';
		this.canvasCtx.lineWidth = this.options.lineWidth;
		this.canvasCtx.stroke();
	}
	
	glowCircle() {
		if (this.glowAnimator.animating) {
			console.log(this.glowAnimator.transparency);
			this.clearCanvas(this.glowCanvasCtx);
			this.glowCanvasCtx.beginPath();
			this.glowCanvasCtx.arc(0, 0, this.radius, 0, 360, false);
			this.glowCanvasCtx.fillStyle = `hsla(0, 100%, 100%, ${this.glowAnimator.transparency}`;
			this.glowCanvasCtx.fill();
			if (this.glowAnimator.transparency < 0.1 && !this.glowAnimator.fading) {
				this.glowAnimator.transparency += 0.01;
				requestAnimationFrame(this.glowCircle.bind(this));
			} else if (this.glowAnimator.transparency > 0) {
				if (!this.glowAnimator.fading) this.glowAnimator.fading = true;
				this.glowAnimator.transparency -= 0.01;
				requestAnimationFrame(this.glowCircle.bind(this));
			} else {
				this.glowAnimator.animating = false;
				this.glowAnimator.fading = false;
			}
		}
	}
	
	drawTimer(currTimer, startingTimer) {
		if (!this.animationHelper.startPoint) {
			this.animationHelper.startPoint = 0;
		} // remember to set next start point in animation 
		var endAngle = this.getEndAngle(currTimer, startingTimer);
		this.animationHelper.endPoint = endAngle;
		requestAnimationFrame(this.animateCurve.bind(this));
	}
	
	animateCurve() {
		// Build a keyframe array on initial call
		if (this.animationHelper.framePoints.length === 0) {
			var frames = 10;
			var startDegs = this.getDegrees(this.animationHelper.startPoint);
			var endDegs = this.getDegrees(this.animationHelper.endPoint);
			var diff = endDegs - startDegs;
			var stepIncrement = (1/frames) * diff;
			for (let i = 0; i <= frames; i++) {
				let currStep = startDegs + (stepIncrement * i);
				let currStepRads = this.getRadians(currStep);
				this.animationHelper.framePoints.push(currStepRads);
			}
			console.log(this.animationHelper.framePoints);
			this.animationHelper.startPoint = this.getRadians(endDegs);
		}
		
		this.canvasCtx.beginPath();
		var nextPoint = this.animationHelper.framePoints.shift();
		this.canvasCtx.arc(0, 0, this.radius, this.animationHelper.lastPoint, nextPoint, false);
		this.animationHelper.lastPoint = nextPoint; // Reset for next time
		this.canvasCtx.strokeStyle = "hsl(3, 65%, 52%)";
		this.canvasCtx.lineCap = 'round';
		this.canvasCtx.lineWidth = this.options.lineWidth;
		this.canvasCtx.stroke();
		
		if (this.animationHelper.framePoints.length > 0) {
			requestAnimationFrame(this.animateCurve.bind(this));
		} else {
			//this.animationHelper.startPoint = null;
		}
	}
	
	resetAnimationHelper() {
		this.animationHelper.startPoint = null;
		this.animationHelper.endPoint = 0;
		this.animationHelper.framePoints = [];
		this.animationHelper.lastPoint = 0;
	}
	
	clearCanvas(canvasCtxRef) {
		canvasCtxRef.save();
		canvasCtxRef.setTransform(1, 0, 0, 1, 0, 0);
		canvasCtxRef.clearRect(0, 0, this.options.size, this.options.size);
		canvasCtxRef.restore();
		if (canvasCtxRef === this.canvasCtx) {
			this.drawBase();
		}
	}
}