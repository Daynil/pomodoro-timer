var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var canvasservice_1 = require('./canvasservice');
// Annotation section
var PomodoroApp = (function () {
    function PomodoroApp(canvasService) {
        this.canvasService = canvasService;
        this.alertSound = new Audio('https://www.freesound.org/people/bradwesson/sounds/135936/download/135936__bradwesson__collectcoin.wav');
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
    PomodoroApp.prototype.sessLenTyped = function (newSess) {
        var isValid = this.validateInput(newSess);
        if (isValid) {
            this.sessionLen = newSess;
            this.resetTimer(false, true);
        }
    };
    PomodoroApp.prototype.breakLenTyped = function (newBreak) {
        var isValid = this.validateInput(newBreak);
        if (isValid) {
            this.breakLen = newBreak;
            this.resetTimer(false, true);
        }
    };
    PomodoroApp.prototype.validateInput = function (input) {
        // We only want numerical inputs
        var regex = /\D/g;
        return !regex.test(input) && !(input.length === 0) && input <= 99;
    };
    PomodoroApp.prototype.incrLen = function (sendingInput) {
        if (sendingInput.id === 'session-incr') {
            this.sessionLen++;
            this.resetTimer(false, true);
        }
        else {
            this.breakLen++;
            this.resetTimer(false, true);
        }
    };
    PomodoroApp.prototype.decrLen = function (sendingInput) {
        if (sendingInput.id === 'session-decr') {
            if (this.sessionLen > 1) {
                this.sessionLen--;
                this.resetTimer(false, true);
            }
        }
        else {
            if (this.breakLen > 1) {
                this.breakLen--;
                this.resetTimer(false, true);
            }
        }
    };
    PomodoroApp.prototype.toggleTimer = function () {
        this.glowAnimate();
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.incrementTimer();
        }
    };
    PomodoroApp.prototype.incrementTimer = function () {
        var _this = this;
        if (this.isActive) {
            setTimeout(function () {
                if (_this.currTimer > 0 && _this.isActive) {
                    var startingTimer = _this.isBreak ? _this.breakLen : _this.sessionLen;
                    _this.tick();
                    _this.canvasService.drawTimer(_this.currTimer, startingTimer * 60);
                    _this.incrementTimer();
                }
                else if (_this.currTimer === 0) {
                    _this.isBreak = !_this.isBreak;
                    _this.resetTimer(_this.isBreak, false);
                    _this.alertSound.play();
                    _this.incrementTimer();
                }
            }, 1000);
        }
    };
    PomodoroApp.prototype.resetTimer = function (isBreak, refresh) {
        this.canvasService.clearCanvas(this.canvasService.canvasCtx);
        this.canvasService.resetAnimationHelper();
        if (isBreak) {
            this.currTimer = this.breakLen * 60;
            this.sessBreakTxt = "Break!";
        }
        else {
            this.currTimer = this.sessionLen * 60;
            this.sessBreakTxt = "Session";
        }
        if (refresh) {
            this.isActive = false;
        }
        else {
            this.glowAnimate();
        }
        this.updateStringTimer();
    };
    PomodoroApp.prototype.tick = function () {
        this.currTimer--;
        this.updateStringTimer();
    };
    PomodoroApp.prototype.updateStringTimer = function () {
        var totalSecsLeft = this.currTimer;
        var minutes = Math.floor(totalSecsLeft / 60) + '';
        var seconds = totalSecsLeft % 60 + '';
        //if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2)
            seconds = '0' + seconds;
        this.currTimerDisplay = minutes + ":" + seconds;
    };
    PomodoroApp.prototype.glowAnimate = function () {
        this.canvasService.glowAnimator.animating = true;
        requestAnimationFrame(this.canvasService.glowCircle.bind(this.canvasService));
    };
    PomodoroApp.prototype.setPlayClasses = function () {
        return {
            "fa": true,
            "fa-play": !this.isActive,
            "fa-pause": this.isActive
        };
    };
    PomodoroApp = __decorate([
        angular2_1.Component({
            selector: 'pomodoro-app',
            bindings: [canvasservice_1.CanvasService]
        }),
        angular2_1.View({
            templateUrl: 'pomodorotimer.html',
            styleUrls: ['styles.css'],
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [canvasservice_1.CanvasService])
    ], PomodoroApp);
    return PomodoroApp;
})();
angular2_1.bootstrap(PomodoroApp)
    .then(function (success) { return console.log(success); }, function (error) { return console.log(error); });

//# sourceMappingURL=app.js.map
