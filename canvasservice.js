var CanvasService = (function () {
    function CanvasService() {
        this.animationHelper = {
            startPoint: null,
            endPoint: 0,
            framePoints: [],
            lastPoint: 0
        };
        this.glowAnimator = {
            animating: false,
            fading: false,
            transparency: 0.01
        };
        this.options = {
            percent: 0,
            size: 350,
            lineWidth: 5,
            rotate: 0
        };
    }
    CanvasService.prototype.initializeCanvas = function (canvas, glowCanvas) {
        console.log("initializeCanvas called here");
        this.canvasCtx = canvas.getContext('2d');
        this.canvasCtx.translate(this.options.size / 2, this.options.size / 2);
        this.canvasCtx.rotate((-1 / 2 + this.options.rotate / 180) * Math.PI);
        this.glowCanvasCtx = glowCanvas.getContext('2d');
        this.glowCanvasCtx.translate(this.options.size / 2, this.options.size / 2);
        this.glowCanvasCtx.rotate((-1 / 2 + this.options.rotate / 180) * Math.PI);
        this.radius = (this.options.size - this.options.lineWidth) / 2;
        this.drawBase();
    };
    CanvasService.prototype.getEndAngle = function (currTimer, startingTimer) {
        var currPercent = (startingTimer - currTimer) / startingTimer;
        var endDegr = 360 * currPercent; // How far into the circle to stop drawing line
        var endRads = this.getRadians(endDegr); // Canvas arcs use radians
        return endRads;
    };
    CanvasService.prototype.getRadians = function (degrees) {
        return (Math.PI / 180) * degrees;
    };
    CanvasService.prototype.getDegrees = function (radians) {
        return (180 * radians) / Math.PI;
    };
    CanvasService.prototype.drawBase = function () {
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(0, 0, this.radius, 0, (Math.PI / 180 * 360), false);
        this.canvasCtx.strokeStyle = "hsla(3, 65%, 52%, 0.15)";
        this.canvasCtx.lineCap = 'round';
        this.canvasCtx.lineWidth = this.options.lineWidth;
        this.canvasCtx.stroke();
    };
    CanvasService.prototype.glowCircle = function () {
        if (this.glowAnimator.animating) {
            console.log(this.glowAnimator.transparency);
            this.clearCanvas(this.glowCanvasCtx);
            this.glowCanvasCtx.beginPath();
            this.glowCanvasCtx.arc(0, 0, this.radius, 0, 360, false);
            this.glowCanvasCtx.fillStyle = "hsla(0, 100%, 100%, " + this.glowAnimator.transparency;
            this.glowCanvasCtx.fill();
            if (this.glowAnimator.transparency < 0.1 && !this.glowAnimator.fading) {
                this.glowAnimator.transparency += 0.01;
                requestAnimationFrame(this.glowCircle.bind(this));
            }
            else if (this.glowAnimator.transparency > 0) {
                if (!this.glowAnimator.fading)
                    this.glowAnimator.fading = true;
                this.glowAnimator.transparency -= 0.01;
                requestAnimationFrame(this.glowCircle.bind(this));
            }
            else {
                this.glowAnimator.animating = false;
                this.glowAnimator.fading = false;
            }
        }
    };
    CanvasService.prototype.drawTimer = function (currTimer, startingTimer) {
        if (!this.animationHelper.startPoint) {
            this.animationHelper.startPoint = 0;
        } // remember to set next start point in animation 
        var endAngle = this.getEndAngle(currTimer, startingTimer);
        this.animationHelper.endPoint = endAngle;
        requestAnimationFrame(this.animateCurve.bind(this));
    };
    CanvasService.prototype.animateCurve = function () {
        // Build a keyframe array on initial call
        if (this.animationHelper.framePoints.length === 0) {
            var frames = 10;
            var startDegs = this.getDegrees(this.animationHelper.startPoint);
            var endDegs = this.getDegrees(this.animationHelper.endPoint);
            var diff = endDegs - startDegs;
            var stepIncrement = (1 / frames) * diff;
            for (var i = 0; i <= frames; i++) {
                var currStep = startDegs + (stepIncrement * i);
                var currStepRads = this.getRadians(currStep);
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
        }
        else {
        }
    };
    CanvasService.prototype.resetAnimationHelper = function () {
        this.animationHelper.startPoint = null;
        this.animationHelper.endPoint = 0;
        this.animationHelper.framePoints = [];
        this.animationHelper.lastPoint = 0;
    };
    CanvasService.prototype.clearCanvas = function (canvasCtxRef) {
        canvasCtxRef.save();
        canvasCtxRef.setTransform(1, 0, 0, 1, 0, 0);
        canvasCtxRef.clearRect(0, 0, this.options.size, this.options.size);
        canvasCtxRef.restore();
        if (canvasCtxRef === this.canvasCtx) {
            this.drawBase();
        }
    };
    return CanvasService;
})();
exports.CanvasService = CanvasService;

//# sourceMappingURL=canvasservice.js.map
