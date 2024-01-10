/*
Changes that I made:
  - Fixed easeOutElastic: there used to be a divide by 0 error
  - Added ease(In/Out/InOut)Back
  - Added TweenManager.tweenExists()
  - Updated TweenManager.addTween() for creating a new tween with the same name as a preexisting tween
  - Fixed easeInElastic and easeInOutElastic: there used to be a divide by 0 error
  - Added an interpolation function to the TweenManager class
  - Added JSDoc stuff
  - Added Tween.onMotionReached()
  - Changed the general structure of the code

  Original by Milcheris
*/

class Tween {
    constructor(objStart) {
        this.motions = [];
        this.keyChanges = [];
        this.active = false;
        this.isLoop = false;
        this.isPaused = false;
        this.currentMotionIndex = 0;
        this.motionListeners = [];
        this.obj = objStart;
    }
    resetToStart() {
        for (let key in this.start) {
            this.obj[key] = this.start[key];
        }
        this.motionStart = this.createStartObject(this.start);
    }
    createStartObject(objStart) {
        const changes = {};
        this.keyChanges.forEach(key => changes[key] = objStart[key]);
        return changes;
    }
    addToKeyChangeList(key) {
        if (!this.keyChanges.includes(key))
            this.keyChanges.push(key);
    }
    interpolation(start, stop, amt, easing = 'linear') {
        let easingFunction = !(easing in _TweenManager.EASINGS) ? _TweenManager.EASINGS['linear'] : _TweenManager.EASINGS[easing];
        return easingFunction(amt) * (stop - start) + start;
    }

    addMotion(key, target, duration, easing = 'linear') {
        this.addToKeyChangeList(key);
        this.motions.push({
            actions: [{ key, target }],
            duration,
            leftTime: 0,
            easing
        });
        return this;
    }
    /**
     * Adds multiple motions that take place simultaneously.
     * @param {object[]} actions [{key:string, target:number}]
     * @param {number} duration 
     * @param {string} easing 
     * @returns {Tween} Itself
     */
    addMotions(actions, duration, easing = 'linear') {
        actions.flatMap(a => a.key).forEach((key) => this.addToKeyChangeList(key));
        this.motions.push({
            actions,
            duration,
            leftTime: 0,
            easing
        });
        return this;
    }
    resetMotions() {
        this.motions = [];
    }
    startLoop() {
        this.isLoop = true;
        this.startTween();
        return this;
    }
    startTween() {
        this.start = this.createStartObject(this.obj);
        this.motionStart = this.createStartObject(this.obj);
        this.currentMotionIndex = 0;
        this.active = true;
        if (this.motionListeners[0]) this.motionListeners[0]();
        return this;
    }
    pause() {
        this.isPaused = true;
        return this;
    }
    resume() {
        this.isPaused = false;
        return this;
    }
    restart() {
        this.pause();
        this.currentMotionIndex = 0;
        if (this.motionListeners[0]) this.motionListeners[0]();
        this.motions.forEach(m => m.leftTime = 0);
        this.resetToStart();
        this.resume();
        return this;
    }
    update(deltaTime) {
        if (!this.active || this.isPaused)
            return;
        const motion = this.motions[this.currentMotionIndex];
        if (motion.leftTime >= motion.duration) {
            motion.leftTime = 0;
            this.motionStart = this.createStartObject(this.obj);
            this.currentMotionIndex += 1;
            if (this.currentMotionIndex >= this.motions.length) {
                if (this.isLoop) {
                    this.resetToStart();
                    this.currentMotionIndex = 0;
                    if (this.onLoopListener)
                        this.onLoopListener(this);
                    if (this.motionListeners[0]) this.motionListeners[0](this);
                }
                else {
                    this.active = false;
                    if (this.onEndListener) {
                        this.onEndListener(this);
                    }
                    TweenManager.tweens.splice(TweenManager.tweens.findIndex(value => value.tween == this), 1);
                }
            } else if (this.motionListeners[this.currentMotionIndex]) this.motionListeners[this.currentMotionIndex](this);
        }
        motion.leftTime += deltaTime;
        if (!motion.actions)
            return;
        for (let action of motion.actions) {
            if (action.key && !isNaN(action.target)) {
                const progress = Math.min(motion.leftTime / motion.duration, 1.0);
                this.obj[action.key] = this.interpolation(this.motionStart[action.key], action.target, progress, motion.easing);
            }
        }
    }
    onEnd(listener) {
        if (typeof listener !== 'function') {
            console.error("The given event listener for 'onEnd' is not a function. Use .onEnd(function(tween) { /* your code */})");
            return;
        }
        this.onEndListener = listener;
        return this;
    }
    onMotionReached(index, listener) {
        if (typeof listener !== 'function') {
            console.error("The given event listener for 'onMotionReached' is not a function. Use .onEnd(function(tween) { /* your code */})");
            return;
        }
        this.motionListeners[index] = listener;
        return this;
    }
    onLoop(listener) {
        if (typeof listener !== 'function') {
            console.error("The given event listener for 'onLoop' is not a function. Use .onLoop(function(tween) { /* your code */})");
            return;
        }
        this.onLoopListener = listener;
        return this;
    }
}

class GeometricObjectTween extends Tween {
    addMotionTo(object, duration, easing = 'linear') {
        let actions = [];
        if (object.x)
            actions.push({ key: 'x', target: object.x });
        if (object.y)
            actions.push({ key: 'y', target: object.y });
        if (object.width)
            actions.push({ key: 'width', target: object.width });
        if (object.height)
            actions.push({ key: 'height', target: object.height });
        if (object.w)
            actions.push({ key: 'w', target: object.w });
        if (object.h)
            actions.push({ key: 'h', target: object.h });
        if (object.angle)
            actions.push({ key: 'angle', target: object.angle });
        if (object.rotation)
            actions.push({ key: 'rotation', target: object.rotation });
        super.addMotions(actions, duration, easing);
    }
}

class _TweenManager {
    constructor() {
        /**@type {{name : string, tween : Tween}[]} */
        this.tweens = [];
        this.numberOfTweens = 0;
    }
    tweenExists(name) {
      return this.tweens.find(t => t.name === name);
    }
    getTween(name) {
        return this.tweens.find(t => t.name === name).tween;
    }

    addTween(object, name) {
        const tweenName = name || 'tween' + this.numberOfTweens;
        const tween = new Tween(object);
        if (this.tweenExists(tweenName)) {
          this.tweens.find(t => t.name === tweenName).tween = tween;
        } else {
          this.tweens.push({ name: tweenName, tween });
          this.numberOfTweens++;
        }
        return tween;
    }
    update(deltaTime) {
        for (let tweenItem of this.tweens) {
            tweenItem.tween.update(deltaTime);
        }
    }

    /**
     * An interpolation function (created by Evan)
     * @param {number} start Starting value of the tween
     * @param {number} stop Target value of the tween
     * @param {number} amt Progress of the tween (0-1)
     * @param {string} [easing] Easing style
     * @returns {number} Interpolated value
     */
    interpolation(start, stop, amt, easing = 'linear') {
        let easingFunction = !(easing in this.EASINGS) ? this.EASINGS.linear : this.EASINGS[easing];
        return easingFunction(amt) * (stop - start) + start;
    }

    static EASINGS = {
        linear: (t) => t,
        easeInQuad: (t) => t * t,
        easeOutQuad: (t) => t * (2 - t),
        easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => 1 - (--t) * t * t * t,
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: (t) => t * t * t * t * t,
        easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
        easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        easeInElastic: (t) => t == 0 ? 0 : (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
        easeOutElastic: (t) => t == 1 ? 1 : (0.04 * t / (--t) * Math.sin(25 * t)),
        easeInOutElastic: (t) => t == 0.5 ? 0.5 : (t -= 0.5) < 0 ? (0.02 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
        easeInSin: (t) => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
        easeOutSin: (t) => Math.sin(Math.PI / 2 * t),
        easeInOutSin: (t) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
        easeInBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            
            return c3 * t * t * t - c1 * t * t;
        },
        easeOutBack: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        },
        easeInOutBack: (t) => {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
    
            return t < 0.5 ?
            (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        }
    };
    EASINGS = _TweenManager.EASINGS;
}

var TweenManager = new _TweenManager();