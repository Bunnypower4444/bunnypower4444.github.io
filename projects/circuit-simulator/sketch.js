/**
 * @todo
 * - Fix extra gates changing color
 * - Fix extra inputs/outputs not going away
 * - Fix loop detection in immediate update mode
 * - Make it so wires aren't just a straight line, and can click wires for deleting/add a wire by dragging off of one
 * - Add a mode with gate delays based on time, not frames, and have random delay deviations (also make it work with immediate update: only delay on loops)
 * - 15 inputs/outputs
 * - Align inputs/outputs on chips correctly
 * - Change chip width to fit text
 * - Make it so saving/loading a chip also saves/loads the chips it uses (unless the chip already exists)
 * - Do something if saved chips in cookies is too long
 * - Prevent chips in the toolbar from updating
 * - Make it so that there are less updates when passing a signal through
 * - Make inputs and outputs show wire connection at correct spot
 */
//function color() {return {levels : [0, 0, 0, 0]}}
/*
var mySketchObject = {
    w : -100,
    scalarW : 1,
    h : null,
    fillColor : 64,
    children : [
        {
            type : "Shape",
            name : "HomeScreen",
            shapeType : "Rect",
            x : 0,
            scalarX : 0,
            y : 0,
            scalarY : 0,
            w : 0,
            scalarW : 1,
            h : 0,
            scalarH : 1,
            anchorX : 0,
            anchorY : 0,
            fillColor : 64,
            strokeColor : 0,
            strokeWeight : 0,
            scale : 1,
            rotation : 0,
            visible : true,
            active : true,
            cornerCurve : 0,
            children : [
                {
                    type : "Shape",
                    name : "TitleText",
                    shapeType : "Text",
                    x : 0,
                    scalarX : 0.5,
                    y : 0,
                    scalarY : 0.25,
                    fillColor : 255,
                    strokeColor : 0,
                    strokeWeight : 0,
                    text : "Circuit Simulator",
                    textAlignHorizontal : "center",
                    textAlignVertical : "center",
                    textSize : 0,
                    textSizeScalar : 0.1,
                    textFont : "Monospace",
                    textStyle : "bold",
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : false,
                    children : [
                    ]
                },
                {
                    type : "Shape",
                    name : "BylineText",
                    shapeType : "Text",
                    x : 0,
                    scalarX : 0.6,
                    y : 10,
                    scalarY : 0.3,
                    fillColor : 255,
                    strokeColor : 0,
                    strokeWeight : 0,
                    text : "By Evan Guo",
                    textAlignHorizontal : "center",
                    textAlignVertical : "top",
                    textSize : 0,
                    textSizeScalar : 0.025,
                    textFont : "Monospace",
                    textStyle : "italic",
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : false,
                    children : [
                    ]
                },
                {
                    type : "Shape",
                    name : "ContinueButton",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0.5,
                    y : 0,
                    scalarY : 0.5,
                    w : 0,
                    scalarW : 0.2,
                    h : 0,
                    scalarH : 0.05,
                    anchorX : 0.5,
                    anchorY : 0.5,
                    fillColor : 32,
                    strokeColor : 16,
                    strokeWeight : 3,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : true,
                    cornerCurve : 0,
                    children : [
                        {
                            type : "Shape",
                            name : "Text",
                            shapeType : "Text",
                            x : 0,
                            scalarX : 0,
                            y : 0,
                            scalarY : 0,
                            fillColor : 255,
                            strokeColor : 0,
                            strokeWeight : 0,
                            text : "Continue Game",
                            textAlignHorizontal : "center",
                            textAlignVertical : "center",
                            textSize : 0,
                            textSizeScalar : 0.6,
                            textFont : "Monospace",
                            textStyle : "normal",
                            scale : 1,
                            rotation : 0,
                            visible : true,
                            active : false
                        },
                        {
                            type : "Script",
                            name : "Script",
                            disabled : true,
                            function : (script) => {
                                //this script is disabled
                                let button = script.parent;
                                button.addEventListener("mouseEnter", thisShape => {
                                    thisShape.tweenProperty("scale", 1.2, 250, "easeOutQuad");
                                });
                                button.addEventListener("mouseLeave", thisShape => {
                                    thisShape.tweenProperty("scale", 1, 250, "easeOutQuad");
                                });
                                button.addEventListener("mousePressed", thisShape => {
                                    thisShape.tweenProperty("scale", 0.95, 250, "easeOutQuad");
                                });
                                button.addEventListener("mouseReleased", thisShape => {
                                    thisShape.tweenProperty("scale", 1.2, 250, "easeOutQuad");
                                });
                                button.addEventListener("mouseClicked", thisShape => {
                                    thisShape.fillColor = [random(256), random(256), random(256)].map(Math.floor);
                                });
                            }
                        }
                    ]
                },
                {
                    type : "Shape",
                    name : "NewGameButton",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0.5,
                    y : 0,
                    scalarY : 0.575,
                    w : 0,
                    scalarW : 0.2,
                    h : 0,
                    scalarH : 0.05,
                    anchorX : 0.5,
                    anchorY : 0.5,
                    fillColor : 32,
                    strokeColor : 16,
                    strokeWeight : 3,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : true,
                    cornerCurve : 0,
                    children : [
                        {
                            type : "Shape",
                            name : "Text",
                            shapeType : "Text",
                            x : 0,
                            scalarX : 0,
                            y : 0,
                            scalarY : 0,
                            fillColor : 255,
                            strokeColor : 0,
                            strokeWeight : 0,
                            text : "New Game",
                            textAlignHorizontal : "center",
                            textAlignVertical : "center",
                            textSize : 0,
                            textSizeScalar : 0.6,
                            textFont : "Monospace",
                            textStyle : "normal",
                            scale : 1,
                            rotation : 0,
                            visible : true,
                            active : false
                        }
                    ]
                },
                {
                    type : "Shape",
                    name : "SandboxButton",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0.5,
                    y : 0,
                    scalarY : 0.65,
                    w : 0,
                    scalarW : 0.2,
                    h : 0,
                    scalarH : 0.05,
                    anchorX : 0.5,
                    anchorY : 0.5,
                    fillColor : 32,
                    strokeColor : 16,
                    strokeWeight : 3,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : true,
                    cornerCurve : 0,
                    children : [
                        {
                            type : "Shape",
                            name : "Text",
                            shapeType : "Text",
                            x : 0,
                            scalarX : 0,
                            y : 0,
                            scalarY : 0,
                            fillColor : 255,
                            strokeColor : 0,
                            strokeWeight : 0,
                            text : "Sandbox",
                            textAlignHorizontal : "center",
                            textAlignVertical : "center",
                            textSize : 0,
                            textSizeScalar : 0.6,
                            textFont : "Monospace",
                            textStyle : "normal",
                            scale : 1,
                            rotation : 0,
                            visible : true,
                            active : false
                        }
                    ]
                },
                {
                    type : "Script",
                    name : "ButtonScript",
                    disabled : false,
                    function : (script) => {
                        const buttonNames = ["ContinueButton", "NewGameButton", "SandboxButton"];
                        const buttons = buttonNames.map(name => script.parent.getChild(name));
                        for (let button of buttons) {
                            button.buttonHoverEffect(1.1, 0.95, 250, "easeOutQuad", 3, 0.75, {
                                mouseClicked : (function(){
                                    switch (button.name) {
                                        case "ContinueButton":
                                            return thisShape => {thisShape.fillColor = [random(256), random(256), random(256)].map(Math.floor);};
                                        case "NewGameButton":
                                            return thisShape => {thisShape.parent.fillColor = [random(256), random(256), random(256)].map(Math.floor);}
                                        case "SandboxButton":
                                            return thisShape => {
                                                let wipe = sketch.getChild("CircleWipe");
                                                wipe.fillColor = [24, 24, 32];
                                                wipe.strokeColor = [16, 48, 48];
                                                wipe.strokeWeight = 400000 / width;
                                                wipe.wipe(thisShape.actualX, thisShape.actualY, 0, 0, 600, "easeOutQuart", () => {
                                                    console.log("e");
                                                    sceneManager.changeScene(scenes.CREATE_SCREEN);
                                                    setTimeout(wipe.unwipe, 500, undefined, undefined, undefined, undefined, 600, "easeInQuart");
                                                    new ChipDisplay(new BuiltInChip("AND", ins => [ins[0] && ins[1]], 2, 1), 0.5, 0.5);
                                                });
                                            };
                                    }
                                })()
                            });
                        }
                    }
                }
            ]
        },
        {
            type : "Shape",
            name : "CreateScreen",
            shapeType : "Rect",
            x : 0,
            scalarX : 0,
            y : 0,
            scalarY : 0,
            w : 0,
            scalarW : 1,
            h : 0,
            scalarH : 1,
            anchorX : 0,
            anchorY : 0,
            fillColor : 32,
            strokeColor : 0,
            strokeWeight : 0,
            scale : 1,
            rotation : 0,
            visible : true,
            active : false,
            cornerCurve : 0,
            children : [
                {
                    type : "Shape",
                    name : "Workspace",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0.025,
                    y : 0,
                    scalarY : 0,
                    w : 0,
                    scalarW : 1 - 0.025,
                    h : 0,
                    scalarH : 0.95,
                    anchorX : 0,
                    anchorY : 0,
                    fillColor : 32,
                    strokeColor : 0,
                    strokeWeight : 0,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : true,
                    cornerCurve : 0,
                    children : []
                },
                {
                    type : "Shape",
                    name : "Toolbar",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0,
                    y : 0,
                    scalarY : 1,
                    w : 0,
                    scalarW : 1,
                    h : 0,
                    scalarH : 0.05,
                    anchorX : 0,
                    anchorY : 1,
                    fillColor : 64,
                    strokeColor : 0,
                    strokeWeight : 0,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : false,
                    cornerCurve : 0,
                    children : null
                },
                {
                    type : "Shape",
                    name : "InputBar",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 0,
                    y : 0,
                    scalarY : 0,
                    w : 0,
                    scalarW : 0.025,
                    h : 0,
                    scalarH : 0.95,
                    anchorX : 0,
                    anchorY : 0,
                    fillColor : 64,
                    strokeColor : 0,
                    strokeWeight : 0,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : false,
                    cornerCurve : 0,
                    children : [
                        {
                            type : "Script",
                            name : "Script",
                            disabled : false,
                            function : (script) => {
                                for (let i = 0; i < 10; i++) {
                                    new Input(i);
                                }
                            },
                            children : [
                            ]
                        }
                    ]
                },
                {
                    type : "Shape",
                    name : "OutputBar",
                    shapeType : "Rect",
                    x : 0,
                    scalarX : 1 - 0.025,
                    y : 0,
                    scalarY : 0,
                    w : 0,
                    scalarW : 0.025,
                    h : 0,
                    scalarH : 0.95,
                    anchorX : 0,
                    anchorY : 0,
                    fillColor : 64,
                    strokeColor : 0,
                    strokeWeight : 0,
                    scale : 1,
                    rotation : 0,
                    visible : true,
                    active : false,
                    cornerCurve : 0,
                    children : [
                        {
                            type : "Script",
                            name : "Script",
                            disabled : false,
                            function : (script) => {
                                for (let i = 0; i < 10; i++) {
                                    new Output(i);
                                }
                            },
                            children : [
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type : "Shape",
            name : "CircleWipe",
            shapeType : "CustomShape",
            x : 0,
            y : 0,
            scalarX : 0.5,
            scalarY : 0.5,
            scale : 1,
            draw : (thisShape, superDraw) => {
                //push();
                //if (!thisShape.graphics) thisShape.graphics = createGraphics(width, height);
                //thisShape.graphics.background(thisShape.fillColor || 0);
                //thisShape.graphics.erase();
                //thisShape.graphics.strokeWeight(0);
                //thisShape.graphics.fill(255);
                //thisShape.graphics.circle(thisShape.actualX, thisShape.actualY, thisShape.scale);
                //thisShape.graphics.noErase();
                //thisShape.graphics.fill(0, 0);
                //thisShape.graphics.strokeWeight((thisShape.strokeWeight * thisShape.scale/width) || 0);
                //thisShape.graphics.stroke(thisShape.strokeColor || 0);
                //thisShape.graphics.circle(thisShape.actualX, thisShape.actualY, thisShape.scale);
                //image(thisShape.graphics, 0, 0, width, height);
                superDraw();
                //pop();
            },
            wipe : (x, y, scalarX, scalarY, time, easing, callback) => {
                let wipe = sketch.getChild("CircleWipe");
                wipe.visible = true;
                if (x || x === 0) wipe.x = x;
                if (y || y === 0) wipe.y = y;
                if (scalarX || scalarX === 0) wipe.scalarX = scalarX;
                if (scalarY || scalarY === 0) wipe.scalarY = scalarY;
                wipe.scale = 2.5 * Math.max(Math.max(width - wipe.actualX, wipe.actualX), Math.max(height - wipe.actualY, wipe.actualY));
                wipe.tweenProperty("scale", 0, time, easing, () => {if (callback) callback();});
            },
            unwipe : (x, y, scalarX, scalarY, time, easing, callback) => {
                let wipe = sketch.getChild("CircleWipe");
                wipe.visible = true;
                if (x || x === 0) wipe.x = x;
                if (y || y === 0) wipe.y = y;
                if (scalarX || scalarX === 0) wipe.scalarX = scalarX;
                if (scalarY || scalarY === 0) wipe.scalarY = scalarY;
                wipe.scale = 0;
                wipe.tweenProperty("scale", 2.5 * Math.max(Math.max(width - wipe.actualX, wipe.actualX), Math.max(height - wipe.actualY, wipe.actualY)), time, easing, () => {if (callback) callback(); wipe.visible = false;});
            },
            visible : false,
            active : false,
            children : null
        }
    ]
}
var mouseX = 0;
var mouseY = 0;
var windowWidth = 2048;
var windowHeight = 597;
var width;
var height;
var createCanvas = function (w, h) {
    width = w;
    height = h;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-x2)**2)
}
//#region

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
            console.error("The given event listener for 'onEnd' is not a function. Use .onEnd(function(tween) { your code })");
            return;
        }
        this.onEndListener = listener;
        return this;
    }
    onMotionReached(index, listener) {
        if (typeof listener !== 'function') {
            console.error("The given event listener for 'onMotionReached' is not a function. Use .onEnd(function(tween) {  your code })");
            return;
        }
        this.motionListeners[index] = listener;
        return this;
    }
    onLoop(listener) {
        if (typeof listener !== 'function') {
            console.error("The given event listener for 'onLoop' is not a function. Use .onLoop(function(tween) {  your code })");
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


class EngineNode {
    constructor(type, name, parent) {
        this.#type = type;
        this.name = name;
        if (parent !== null && parent) this.#parent = parent;
        else if (parent === null) this.#parent = null;
        else this.#parent = sketch;
        if (this.#parent) {
            this.#parent.children[this.name] = this;
        }
    }

    #name = "";

    get name() {
        return this.#name;
    };
    set name(val) {
        if (this.#parent) delete this.#parent.children[this.#name];
        this.#name = val;
        if (this.#parent) this.#parent.children[this.#name] = this;
    }
    #parent;

    get parent() {
        return this.#parent;
    }
    set parent(val) {
        if (this.#parent) delete this.#parent.children[this.name];
        this.#parent = val;
        if (this.#parent) this.#parent.children[this.name] = this;
    }

    children = {};

    getChildren() {
        if (!this.children) return [];
        return Object.values(this.children);
    }


    getChild(name) {
        return this.children[name];
    }

    #type = "";
    get type() {return this.#type;}
}


class Folder extends EngineNode {
    constructor(name, parent) {
        super("Folder", name, parent);
    }
}

class ShapeData extends EngineNode {
    constructor(type, name, parent, args) {
        super("Shape", name, parent);
        this.#shapeType = type;
        if (args) {
            //get rid of empty values
            for (let key in args) {
                if (args[key] === undefined) {
                    delete args[key];
                }
            }
            Object.assign(this, args);
        }
        if (this.vertices) {
            for (let v of this.vertices) {
                if (!v.scalarX) v.scalarX = 0;
                if (!v.scalarY) v.scalarY = 0;
            }
        }
    }

    #shapeType = "";

    get shapeType() {return this.#shapeType;}

    //POSITION PROPERTIES
    //#region
    x = 0; y = 0; w = 0; h = 0; 
    scalarX = 0; scalarY = 0; scalarW = 0; scalarH = 0; 
    get actualX() {return this.x + this.scalarX * this.parent.actualW + this.parent.actualX}
    get actualY() {return this.y + this.scalarY * this.parent.actualH + this.parent.actualY}
    get actualW() {return this.w + this.scalarW * this.parent.actualW}
    get actualH() {return this.h + this.scalarH * this.parent.actualH}

    vertices;
    anchorX = 0; 
    anchorY = 0; 
    //#endregion

    //TEXT PROPERTIES
    //#region 
    text = "";
    textAlignHorizontal = "center";
    textAlignVertical = "center";
    textSize = 18;
    textSizeScalar = 0;
    textFont = "Arial";
    textStyle = "normal";
    //#endregion
    
    //VISUAL PROPERTIES
    //#region 
    scale = 1; 
    rotation = 0;
    fillColor = 128; strokeColor = 0; strokeWeight = 1; 
    visible = true; active = true;
    //#endregion

    //MISC PROPERTIES
    //#region 
    cornerCurve = 0;
    
    customPolygonType = null;
    //#endregion
}

class Shape extends ShapeData {
    
    constructor(name, args, parent, shapeType) {
        super(shapeType, name || shapeType, parent, args || {});
    }

    //will be replaced by methods of a subclass
    draw() {
        if (this.eventListeners.draw) {
            for (let connection of this.eventListeners.draw) {
                connection.function(this);
            }
        }
        for (let child of this.getChildren()) {
            if (child instanceof Shape && child.visible && !child.sceneDisabled) {
                child.draw();
            }
        }
    };
    
    mouseIsOver() {};

    
    mousePressedWhileOn = false;
    mouseOver = false;

    eventListeners = {
    };

    addEventListener(eventType, fn) {
        let connection = new EventConnection(eventType, fn, () => {
            this.eventListeners[eventType].splice(this.eventListeners[eventType].indexOf(connection), 1);
        });
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(connection);
        return connection;
    }


    tweenProperty(property, target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }

    static Rect = class Rect extends Shape {

        constructor() {
            if (arguments.length <= 7) super(arguments[0], {x : arguments[1], y : arguments[2], w : arguments[3], h : (arguments[4] || arguments[3]), ...(arguments[6] || {})}, arguments[5], "Rect");
            else super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], w : arguments[5], scalarW : arguments[6], h : arguments[7], scalarH : arguments[8], ...(arguments[10] || {})}, arguments[9], "Rect");
        }

        draw() {
            super.draw();
        }

        mouseIsOver() {
            let diffX = mouseX - this.actualX - ((0.5 - this.anchorX) * this.actualW);
            let diffY = mouseY - this.actualY - ((0.5 - this.anchorY) * this.actualH);
            let cos1 = Math.cos(this.rotation * Math.PI/180);
            let sin1 = Math.sin(this.rotation * Math.PI/180);
            let cos2 = Math.cos(this.rotation * Math.PI/180 + Math.PI/2);
            let sin2 = Math.sin(this.rotation * Math.PI/180 + Math.PI/2);
            return (diffX * cos1 + diffY * sin1) < this.actualW/2 * this.scale &&
                (diffX * cos1 + diffY * sin1) > -this.actualW/2 * this.scale &&
                (diffX * cos2 + diffY * sin2) < this.actualH/2 * this.scale &&
                (diffX * cos2 + diffY * sin2) > -this.actualH/2 * this.scale;
        }
    }
    
    static Ellipse = class Ellipse extends Shape {

        constructor() {
            if (arguments.length <= 7) super(arguments[0], {x : arguments[1], y : arguments[2], w : arguments[3], h : (arguments[4] || arguments[3]), ...(arguments[6] || {})}, arguments[5], "Ellipse");
            else super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], w : arguments[5], scalarW : arguments[6], h : arguments[7], scalarH : arguments[8], ...(arguments[10] || {})}, arguments[9], "Ellipse");
        }

        draw() {
            super.draw();
        }

        mouseIsOver() {
            //center coordinates
            let cx = this.actualX + (0.5 - this.anchorX) * this.actualW, cy = this.actualY + (0.5 - this.anchorY) * this.actualH;
            //rotated mouse coordinates
            let [mx, my] = Shape.rotatePoint(mouseX, mouseY, cx, cy, -this.rotation);
            
            return Math.pow(mx - cx, 2) / Math.pow(this.actualW/2 * this.scale, 2) + Math.pow(my - cy, 2) / Math.pow(this.actualH/2 * this.scale, 2) <= 1;
        }
    }

    static Triangle = class Triangle extends Shape {

        constructor() {
            if (arguments.length <= 12) super(arguments[0], {
                x : arguments[1], y : arguments[2],
                vertices : [
                    {x : arguments[3], scalarX : 0, y : arguments[4], scalarY : 0},
                    {x : arguments[5], scalarX : 0, y : arguments[6], scalarY : 0},
                    {x : arguments[7], scalarX : 0, y : arguments[8], scalarY : 0}
                ],
                ...(arguments[10] || {})
            }, arguments[9], "Triangle");
            else super(arguments[0], {
                x : arguments[1], sx : arguments[2], y : arguments[3], sy : arguments[4],
                vertices : [
                    {x : arguments[5], scalarX : arguments[6], y : arguments[7], scalarY : arguments[8]},
                    {x : arguments[9], scalarX : arguments[10], y : arguments[11], scalarY : arguments[12]},
                    {x : arguments[13], scalarX : arguments[14], y : arguments[15], scalarY : arguments[16]}
                ],
                ...(arguments[18] || {})
            }, arguments[17], "Triangle");
        }

        draw() {
            super.draw();
        }

        mouseIsOver() {
            //rotated mouse coordinates
            let [mx, my] = Shape.rotatePoint(mouseX, mouseY, this.actualX + this.parent.actualX, this.actualY + this.parent.actualY, -this.rotation);

            let x1 = (this.vertices[0].x + this.vertices[0].scalarX * this.parent.actualW) * this.scale + this.actualX;
            let y1 = (this.vertices[0].y + this.vertices[0].scalarY * this.parent.actualH) * this.scale + this.actualY;
            let x2 = (this.vertices[1].x + this.vertices[1].scalarX * this.parent.actualW) * this.scale + this.actualX;
            let y2 = (this.vertices[1].y + this.vertices[1].scalarY * this.parent.actualH) * this.scale + this.actualY;
            let x3 = (this.vertices[2].x + this.vertices[2].scalarX * this.parent.actualW) * this.scale + this.actualX;
            let y3 = (this.vertices[2].y + this.vertices[2].scalarY * this.parent.actualH) * this.scale + this.actualY;
            let s1 = Shape.sign(mx, my, x1, y1, x2, y2);
            let s2 = Shape.sign(mx, my, x2, y2, x3, y3);
            let s3 = Shape.sign(mx, my, x3, y3, x1, y1);
            return !((s1 || s2 || s3) && (!s1 || !s2 || !s3));
        }

        tweenVertice(vertice, property, target, time, easing, callback) {
            let resolve, promise = new Promise(r => resolve = r);
            TweenManager.addTween(this.vertices[vertice]).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
            return promise;
        }
    }

    static CustomPolygon = class CustomPolygon extends Shape {

        constructor() {
            if (arguments.length <= 6) super(arguments[0], {x : arguments[1], y : arguments[2], vertices : arguments[3], ...(arguments[5] || {})}, arguments[4], (arguments[5] && arguments[5].curvedType) ? "CustomPolygonCurved" : "CustomPolygon");
            else super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], vertices : arguments[5], ...(arguments[7] || {})}, arguments[6], (arguments[7] && arguments[7].curvedType) ? "CustomPolygonCurved" : "CustomPolygon");
        }

        draw() {
            super.draw();
        }

        mouseIsOver() {
            //split into triangles and check each one individually
            //skip first because that will be in each triangle
            let l = this.vertices.length - 1;
            let [mx, my] = Shape.rotatePoint(mouseX, mouseY, this.actualX, this.actualY, -this.rotation);
            let p1x = (this.vertices[0].x + this.vertices[0].scalarX * this.parent.actualW) * this.scale + this.actualX;
            let p1y = (this.vertices[0].y + this.vertices[0].scalarY * this.parent.actualH) * this.scale + this.actualY;
            let p2x, p2y, p3x, p3y;
            for (let v = 1; v < l; v++) {
                if (!p2x) {
                    p2x = (this.vertices[1].x + this.vertices[1].scalarX * this.parent.actualW) * this.scale + this.actualX;
                    p2y = (this.vertices[1].y + this.vertices[1].scalarY * this.parent.actualH) * this.scale + this.actualY;
                    p3x = (this.vertices[2].x + this.vertices[2].scalarX * this.parent.actualW) * this.scale + this.actualX;
                    p3y = (this.vertices[2].y + this.vertices[2].scalarY * this.parent.actualH) * this.scale + this.actualY;
                } else {
                    p2x = p3x;
                    p2y = p3y;
                    p3x = (this.vertices[v + 1].x + this.vertices[v + 1].scalarX * this.parent.actualW) * this.scale + this.actualX;
                    p3y = (this.vertices[v + 1].y + this.vertices[v + 1].scalarY * this.parent.actualH) * this.scale + this.actualY;
                }

                let s1 = Shape.sign(mx, my, p1x, p1y, p2x, p2y);
                let s2 = Shape.sign(mx, my, p2x, p2y, p3x, p3y);
                let s3 = Shape.sign(mx, my, p3x, p3y, p1x, p1y);
                if (!((s1 || s2 || s3) && (!s1 || !s2 || !s3))) return true;
            }

            return false;
        }

        tweenVertice(vertice, property, target, time, easing, callback) {
            let resolve, promise = new Promise(r => resolve = r);
            TweenManager.addTween(this.vertices[vertice]).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
            return promise;
        }

        static Curved = class Curved extends this {

            constructor() {
                if (arguments.length <= 6) {
                    if (!arguments[5]) arguments[5] = {curvedType : true};
                    else arguments[5].curvedType = true;
                } else  {
                    if (!arguments[7]) arguments[7] = {curvedType : true};
                    else arguments[7].curvedType = true;
                }
                super(...arguments);
            }

            draw() {
                if (this.eventListeners.draw) {
                    for (let connection of this.eventListeners.draw) {
                        connection.function(this);
                    }
                }
                for (let child of this.getChildren()) {
                    if (child instanceof Shape) child.draw();
                }
            }
        }
    }

    static Text = class Text extends Shape {

        constructor() {
            if (arguments.length <= 8) super(arguments[0], {text : arguments[1], x : arguments[2], y : arguments[3], w : arguments[4], h : arguments[5], ...(arguments[7] || {})}, arguments[6], "Text");
            else super(arguments[0], {text : arguments[1], x : arguments[2], scalarX : arguments[3], y : arguments[4], scalarY : arguments[5], w : arguments[6], scalarW : arguments[7], h : arguments[8], scalarH : arguments[9], ...(arguments[11] || {})}, arguments[10], "Text");
        }

        draw() {
            super.draw();
        }

        getTextLines() {
            let lines = this.text.split("\n");
            let nlines = [];
            if (this.w === null && this.scalarW == null) return lines.length;
            let maxWidth = this.actualW;
            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                let line = '';
                let words = lines[lineIndex].split(' ');
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                let testLine = ''.concat(line + words[wordIndex]) + ' ';
                let testWidth = this.textSize * testLine.length;
                if (testWidth > maxWidth && line.length > 0) {
                    nlines.push(line);
                    line = ''.concat(words[wordIndex]) + ' ';
                } else {
                    line = testLine;
                }
                }
                nlines.push(line);
            }
            return nlines;
        }

        getTextWidth() {
            let lines = this.getTextLines();
            let widths = [];
            for (let line of lines) {
                widths.push(this.textSize * line.length);
            }
            return Math.max(...widths);
        }

        getTextHeight() {
            let h = this.getTextLines().length * this.textSize;
            return h;
        }

        mouseIsOver() {
            let w, h;
            if (this.w !== null || this.scalarW !== null) {
                if (this.h !== null || this.scalarH !== null) h = this.actualH;
                else h = this.getTextHeight();
                w = this.actualW;
            } else {
                w = this.getTextWidth();
                h = this.getTextHeight();
            }
            let ax, ay;
            switch (this.textAlignHorizontal) {
                case "left": ax = 0; break;
                case "center": ax = 0.5; break;
                case "right": ax = 1; break;
            }
            switch (this.textAlignVertical) {
                case "center": ay = 0.5; break;
                case "top": ay = 0; break;
                case "bottom": ay = 1; break;
                case "alphabetic": ay = 0; break;
            }
            
            if (this.w !== null || this.scalarW !== null) ax = 0;
            if (this.h !== null || this.scalarH !== null) ay = 0;
            
            let diffX = mouseX - this.actualX - ((0.5 - ax) * w);
            let diffY = mouseY - this.actualY - ((0.5 - ay) * h);
            let cos1 = Math.cos(this.rotation * Math.PI/180);
            let sin1 = Math.sin(this.rotation * Math.PI/180);
            let cos2 = Math.cos(this.rotation * Math.PI/180 + Math.PI/2);
            let sin2 = Math.sin(this.rotation * Math.PI/180 + Math.PI/2);
            return (diffX * cos1 + diffY * sin1) < w/2 * this.scale &&
                (diffX * cos1 + diffY * sin1) > -w/2 * this.scale &&
                (diffX * cos2 + diffY * sin2) < h/2 * this.scale &&
                (diffX * cos2 + diffY * sin2) > -h/2 * this.scale;
        }
    }

    static CustomShape = class CustomShape extends Shape {

        constructor(name, parent, draw, mouseIsOver, args) {
            super(name, args || {}, parent, "CustomShape");
            this.#draw = draw;
            if (mouseIsOver) this.#mouseIsOver = mouseIsOver;
        }

        #draw;
        #mouseIsOver;

        draw() {
            this.#draw(this, super.draw.bind(this));
        }
        mouseIsOver() {
            if (this.#mouseIsOver) return this.#mouseIsOver(this);
        }
    }

    static drawAllShapes() {
        
        function recursiveDraw(node) {
            if (node instanceof Shape) node.draw();
            let children = node.getChildren();
            for (let c of children) {
                recursiveDraw(c);
            }
        }
        recursiveDraw(sketch);
    }

    buttonHoverEffect(maxScale, minScale, scaleTime, easing, lightenFactor, darkenFactor, events={}, defaultColor=this.fillColor, defaultScale=1) {
        const connections = [];
        connections.push(this.addEventListener("mouseEnter", shape => {
            shape.tweenProperty("scale", maxScale, scaleTime, easing); 
            shape.fillColor = color(defaultColor).levels.slice(0, 3).map((v, i) => i == 3 ? v : v * lightenFactor);
            if (events.mouseEnter) events.mouseEnter(shape);
        }));
        connections.push(this.addEventListener("mouseLeave", shape => {
            shape.tweenProperty("scale", defaultScale, scaleTime, easing); 
            shape.fillColor = defaultColor;
            if (events.mouseLeave) events.mouseLeave(shape);
        }));
        connections.push(this.addEventListener("mousePressed", shape => {
            shape.tweenProperty("scale", minScale, scaleTime, easing); 
            shape.fillColor = color(defaultColor).levels.slice(0, 3).map((v, i) => i == 3 ? v : v * darkenFactor);
            if (events.mousePressed) events.mousePressed(shape);
        }));
        connections.push(this.addEventListener("mouseReleased", shape => {
            shape.tweenProperty("scale", maxScale, scaleTime, easing); 
            shape.fillColor = color(defaultColor).levels.slice(0, 3).map((v, i) => i == 3 ? v : v * lightenFactor);
            if (events.mouseReleased) events.mouseReleased(shape);
        }));
        connections.push(this.addEventListener("mouseClicked", shape => {
            if (events.mouseClicked) events.mouseClicked(shape);
        }));
        return function () {connections.forEach(fn => fn.disconnect());};
    }

    //utility functions

    static rotatePoint(x, y, cx, cy, rotation) {
        return [
            (x - cx) * Math.cos(Math.PI * rotation/180) - (y - cy) * Math.sin(Math.PI * rotation/180) + cx,
            (x - cx) * Math.sin(Math.PI * rotation/180) + (y - cy) * Math.cos(Math.PI * rotation/180) + cy,
        ];
    }


    static sign(x, y, x1, y1, x2, y2) {
        return ((x - x2) * (y1 - y2) - (x1 - x2) * (y - y2)) >= 0;
    }
}

class Sketch extends Shape {
    constructor() {
        super("Sketch", null, null, "Sketch");
        //stuff declared in class body is done before constructing :/ at least thats what i think is happening so we need to do this
        Object.defineProperty(this, "x", {get : () => 0});
        Object.defineProperty(this, "actualX", {get : () => 0});
        Object.defineProperty(this, "y", {get : () => 0});
        Object.defineProperty(this, "actualY", {get : () => 0});
        Object.defineProperty(this, "w", {get : () => width, set : v => {width = v}});
        Object.defineProperty(this, "actualW", {get : () => width});
        Object.defineProperty(this, "h", {get : () => height, set : v => {height = v}});
        Object.defineProperty(this, "actualH", {get : () => height});
    }

    get x() {return 0;}
    get actualX() {return 0;}
    get y() {return 0;}
    get actualY() {return 0;}
    get w() {return width;}
    get actualW() {return width;}
    get h() {return height;}
    get actualH() {return height;}
    set w(val) {resizeCanvas(val, this.h);}
    set h(val) {resizeCanvas(this.w, val);}

    draw() {
        super.draw();
    }

    mouseIsOver() {
        if (mouseX >= 0 && mouseX <= this.actualW && mouseY >= 0 && mouseY <= this.actualH) return true;
        return false;
    }
}

var sketch = new Sketch();

class EventConnection {
    function;
    #disconnectFn;
    constructor(type, fn, disconnect) {
        this.type = type;
        this.function = fn;
        this.#disconnectFn = disconnect;
    }

    disconnect() {
        this.#disconnectFn();
    }
}

class Script extends EngineNode {

    constructor(name, parent, fn, disabled=false) {
        super("Script", name, parent);
        this.#function = fn;
        this.disabled = disabled;
    }


    execute() {
        this.#returnValue = this.#function(this);
    }

    #function;

    get function() {return this.#function};
    #returnValue;

    get returnValue() {return this.#returnValue};
}

class Value extends EngineNode {
    constructor(name, parent, value) {
        super("Value", name, parent);
        this.#value = value;
    }

    #value;
    
    get value() {return this.#value;};
    set value(val) {
        this.#value = val;
        if (this.eventListeners.valueChanged) this.eventListeners.valueChanged.forEach(connection => connection.function(this));
    }


    eventListeners = {
    };

    addEventListener(eventType, fn) {
        let connection = new EventConnection(eventType, fn, () => {
            this.eventListeners[eventType].splice(this.eventListeners[eventType].indexOf(connection), 1);
        });
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(connection);
        return connection;
    }


    tween(target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this).addMotion("value", target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }
}


var initializeEngine = function (sketchObj) {
    if (sketchObj) {
        //setup the sketch
        sketch.w = (sketchObj.w || 0) + (sketchObj.scalarW || 0) * windowWidth;
        sketch.h = (sketchObj.h || 0) + (sketchObj.scalarH || 0) * windowHeight;
        sketch.fillColor = sketchObj.fillColor;
        //setup the children

        function recursiveInitialize(node, obj) {
            if (node.children) {
                for (let child of node.children) {
                    let newObj;
                    switch (child.type) {
                        case "Shape":
                            switch (child.shapeType) {
                                case "Rect":
                                    newObj = new Rect(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.w, child.scalarW || 0, child.h, child.scalarH || 0, obj, {
                                            visible : child.visible,
                                            active : child.active,
                                            fillColor : child.fillColor,
                                            strokeColor : child.strokeColor,
                                            strokeWeight : child.strokeWeight,
                                            cornerCurve : child.cornerCurve,
                                            anchorX : child.anchorX,
                                            anchorY : child.anchorY,
                                            rotation : child.rotation,
                                            scale : child.scale
                                        });
                                    break;
                                case "Ellipse":
                                    newObj = new Ellipse(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.w, child.scalarW || 0, child.h, child.scalarH || 0, obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        cornerCurve : child.cornerCurve,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale
                                        });
                                    break;
                                case "Triangle":
                                    newObj = new Triangle(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices[0].x, child.vertices[0].scalarX, child.vertices[0].y, child.vertices[0].scalarY,
                                        child.vertices[1].x, child.vertices[1].scalarX, child.vertices[1].y, child.vertices[1].scalarY,
                                        child.vertices[2].x, child.vertices[2].scalarX, child.vertices[2].y, child.vertices[2].scalarY,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        cornerCurve : child.cornerCurve,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale
                                        });
                                    break;
                                case "CustomPolygon":
                                    newObj = new CustomPolygon(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        cornerCurve : child.cornerCurve,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale,
                                        customPolygonType : child.customPolygonType
                                        });
                                    break;
                                case "CustomPolygonCurved":
                                    newObj = new CustomPolygon.Curved(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        cornerCurve : child.cornerCurve,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale
                                        });
                                    break;
                                case "Text":
                                    newObj = new Text(child.name, child.text, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        (!child.w && child.w !== 0) ? null : child.w, (!child.scalarW && child.scalarW !== 0) ? null : child.scalarW, (!child.h && child.h !== 0) ? null : child.h, (!child.scalarH && child.scalarH !== 0) ? null : child.scalarH, obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        cornerCurve : child.cornerCurve,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale,
                                        textAlignHorizontal : child.textAlignHorizontal,
                                        textAlignVertical : child.textAlignVertical,
                                        textFont : child.textFont,
                                        textSize : child.textSize,
                                        textSizeScalar : child.textSizeScalar,
                                        textStyle : child.textStyle
                                        });
                                    break;
                                case "CustomShape":
                                    newObj = new CustomShape(child.name, obj, child.draw, child.mouseIsOver, (function(){
                                        let c = {...child};
                                        if (c.children) delete c.children;
                                        if (c.name) delete c.name;
                                        if (c.draw) delete c.draw;
                                        if (c.mouseIsOver) delete c.mouseIsOver;
                                        if (c.type) delete c.type;
                                        if (c.shapeType) delete c.shapeType;
                                        return c;
                                    })());
                                    break;
                            }
                            break;
                        case "Script":
                            newObj = new Script(child.name, obj, child.function, child.disabled);
                            break;
                        case "Value":
                            newObj = new Value(child.name, obj, child.value);
                            break;
                    }
                    if (newObj) {
                        if (child.type == "Script" && !child.disabled) newObj.execute();
                        recursiveInitialize(child, newObj);
                    }
                }
            }
            node = undefined;
        }
        recursiveInitialize(sketchObj, sketch);
        sketchObj = undefined;
    }
}

class SketchObject {
    w = 100; scalarW = 0; h = 100; scalarH = 0; fillColor = 220;
    
    children;
}

class NodeObject {
    name = "";

    type;
    
    children;
}

class ShapeObject extends NodeObject {

    shapeType;

    x = 0; y = 0; w = 0; h = 0; 
    scalarX = 0; scalarY = 0; scalarW = 0; scalarH = 0; 

    vertices = [];
    anchorX = 0; 
    anchorY = 0; 

    text = "";
    textAlignHorizontal = "center";
    textAlignVertical = "center";
    textSize = 18;
    textSizeScalar = 0;
    textFont = "Arial";
    textStyle = "normal";
    
    scale = 1; 
    rotation = 0;
    fillColor = 128; strokeColor = 0; strokeWeight = 1; 
    visible = true; active = true;

    cornerCurve = 0;
    
    customPolygonType = null;

    
    draw;
    
    mouseIsOver;
}

class ScriptObject extends NodeObject {
    
    function;
    
    disabled = false;
}

class ValueObject extends NodeObject {
    value;
}

class SceneManager {
    sceneObjects = {};
    sceneEnterEvents = {};
    sceneExitEvents = {};
    currentScene = null;

 
    registerScene(id, objects, enterFunction, exitFunction) {
        if (!Array.isArray(objects)) objects = [objects];
        this.sceneObjects[id] = objects;
        this.sceneEnterEvents[id] = [];
        this.sceneExitEvents[id] = [];
        if (enterFunction) this.sceneEnterEvents[id].push(new EventConnection("sceneEnter", enterFunction, thisConnection => this.sceneEnterEvents[id].splice(this.sceneEnterEvents.indexOf(thisConnection), 1)));
        if (exitFunction) this.sceneExitEvents[id].push(new EventConnection("sceneExit", exitFunction, thisConnection => this.sceneExitEvents[id].splice(this.sceneExitEvents.indexOf(thisConnection), 1)));
        return this;
    }

    addEventListener(eventType, id, fn) {
        let connection = new EventConnection(eventType, fn, thisConnection => {
            this.eventListeners[eventType].splice(this.eventListeners[eventType].indexOf(thisConnection), 1);
        });
        switch (eventType) {
            case "sceneEnter":
                this.sceneEnterEvents[id].push(connection);
                break;
            case "sceneExit":
                this.sceneExitEvents[id].push(connection);
                break;
        }
        return connection;
    }

    changeScene(id) {
        if (this.currentScene || this.currentScene === 0) {
            for (let connection of this.sceneExitEvents[this.currentScene]) {
                connection.function();
            }
        }
        for (let scene in this.sceneObjects) {
            if (scene === id) continue;
            for (let shape of this.sceneObjects[scene]) {
                shape.sceneDisabled = true;
            }
        }
        this.currentScene = id;
        if (this.currentScene || this.currentScene === 0) {
            for (let connection of this.sceneEnterEvents[this.currentScene]) {
                connection.function();
            }
            for (let shape of this.sceneObjects[this.currentScene]) {
                shape.sceneDisabled = false;
            }
        }
    }
}
//#endregion
*/

const widthToHeightRatio = 2;
const sceneManager = new SceneManager();
/**
 * @readonly
 * @enum {number} 
 */
const scenes = {
    /**@readonly */
    HOME_SCREEN : 0,
    /**@readonly */
    CREATE_SCREEN : 1
};

/**
 * @readonly
 * @enum
 */
const colors = {
    /**@readonly */
    DARK_NODE : 16,
    /**@readonly */
    BRIGHT_NODE : [255, 0, 0],
    /**@readonly */
    DARK_WIRE : 48,
    /**@readonly */
    BRIGHT_WIRE : [220, 0, 0],
    /**@readonly */
    AND_CHIP : [32, 196, 255],
    /**@readonly */
    NOT_CHIP : [160, 16, 16],
    /**@readonly */
    SELECTED_OUTLINE : [220, 127]
}

const LOCAL_STORAGE_KEY = "CircuitSimulator";

function setup() {
    createCanvas(100, 100);
    mySketchObject.h = (windowWidth + mySketchObject.w) / widthToHeightRatio;
    if (mySketchObject.h > windowHeight) {
        mySketchObject.h = windowHeight;
        mySketchObject.w = (mySketchObject.h * widthToHeightRatio) - windowWidth;
    }
    initializeEngine(mySketchObject);
    mySketchObject = undefined;
    sceneManager.registerScene(scenes.HOME_SCREEN, sketch.getChild("HomeScreen"));
    sceneManager.registerScene(scenes.CREATE_SCREEN, sketch.getChild("CreateScreen"));
    sceneManager.changeScene(scenes.HOME_SCREEN);

    let toolbar = sketch.getChild("CreateScreen").getChild("Toolbar");
    
    let saveMenu = new Menu("SaveMenu", 0, 0.25, 0, 0.25, 0, 0.5, 0, 0.5, sketch.children.CreateScreen, {
        fillColor : 32,
        strokeWeight : 0,
        active : false,
        cornerCurve : 10
    });
    saveMenu.textFont = "Monospace";
    saveMenu.sceneDisabled = true;
    new MenuItem(saveMenu, "Save", "Save", 64, () => {
        /**@type {Array} */
        let objs = [];
        if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
            objs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        }
        for (let i of saveMenu.getChildren()) {
            if (i instanceof MenuSwitch && (i.name.slice(0, 4) == "Chip" || i.name == "Workspace") && i.value) {
                if (!i.chip) { //workspace
                    let ind = objs.findIndex(v => v.name == "");
                    if (ind > -1) {
                        objs[ind] = saveChip();
                    } else objs.push(saveChip());
                } else {
                    let ind = objs.findIndex(v => v.name == i.chip.name);
                    if (ind > -1) {
                        objs[ind] = saveChip(i.chip);
                    } else objs.push(saveChip(i.chip));
                }
            }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objs));
        saveMenu.sceneDisabled = true;
        toolbar.parent.children.ScreenDarken.visible = false;
        paused = false;
    });
    new MenuItem(saveMenu, "Close", "Close", 64, () => {
        saveMenu.sceneDisabled = true;
        toolbar.parent.children.ScreenDarken.visible = false;
        paused = false;
    });
    new MenuSwitch(saveMenu, "Workspace", "Workspace", 64, true, () => {});

    let loadMenu = new Menu("LoadMenu", 0, 0.25, 0, 0.25, 0, 0.5, 0, 0.5, sketch.children.CreateScreen, {
        fillColor : 32,
        strokeWeight : 0,
        active : false,
        cornerCurve : 10
    });
    loadMenu.textFont = "Monospace";
    loadMenu.sceneDisabled = true;
    new MenuItem(loadMenu, "Load", "Load", 64, () => {
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)) return;
        for (let i of loadMenu.getChildren()) {
            if (i instanceof MenuSwitch && i.name.slice(0, 4) == "Chip" && i.value) {
                loadChip(i.chip);
            }
        }
        if (loadMenu.children.Workspace && loadMenu.children.Workspace.value) loadChip(loadMenu.children.Workspace.chip);
        loadMenu.sceneDisabled = true;
        toolbar.parent.children.ScreenDarken.visible = false;
        paused = false;
    });
    new MenuItem(loadMenu, "Close", "Close", 64, () => {
        loadMenu.sceneDisabled = true;
        toolbar.parent.children.ScreenDarken.visible = false;
        paused = false;
    });

    let settingsMenu = new Menu("SettingsMenu", 0, 0.25, 0, 0.25, 0, 0.5, 0, 0.5, sketch.children.CreateScreen, {
        fillColor : 32,
        strokeWeight : 0,
        active : false,
        cornerCurve : 10
    });
    settingsMenu.textFont = "Monospace";
    settingsMenu.sceneDisabled = true;
    new MenuSwitch(settingsMenu, "ImmediateUpdate", "Immediate Updates", 64, immediateUpdate, value => {
        immediateUpdate = value;
    });
    new MenuItem(settingsMenu, "Close", "Close", 64, () => {
        settingsMenu.sceneDisabled = true;
        toolbar.parent.children.ScreenDarken.visible = false;
        paused = false;
    });

    let menu = new Menu("Menu", 0, 0.05, 0, 0.4, 0, 0.4, 0, 0.5, sketch.children.CreateScreen, {
        fillColor : [16, 128],
        strokeWeight : 0,
        cornerCurve : 20,
        active : false
    });
    menu.textFont = "Monospace";
    menu.sceneDisabled = true;
    new MenuItem(menu, "Settings", "Settings", [64, 128], () => {
        menu.sceneDisabled = true;
        settingsMenu.sceneDisabled = false;
        menuButton.children.Text.text = "≡";
        toolbar.parent.children.ScreenDarken.fillColor = [0, 128];
        toolbar.parent.children.ScreenDarken.visible = true;
    });
    new MenuItem(menu, "Save", "Save", [64, 128], () => {
        menu.sceneDisabled = true;
        menuButton.children.Text.text = "≡";
        saveMenu.sceneDisabled = false;
        toolbar.parent.children.ScreenDarken.fillColor = [0, 128];
        toolbar.parent.children.ScreenDarken.visible = true;
        for (let i of saveMenu.getChildren()) {
            if (i.name.slice(0, 4) == "Chip") {
                i.parent = null;
                saveMenu.numItems--;
                saveMenu.heightOffset -= saveMenu.itemHeight;
            }
        }
        for (let i of toolbar.getChildren()) {
            if (i instanceof ChipButton && !(i.chip instanceof BuiltInChip)) {
                (new MenuSwitch(saveMenu, "Chip" + i.name, i.name, 64, true, () => {})).chip = i.chip;
            }
        }
    });
    new MenuItem(menu, "Load", "Load", [64, 128], () => {
        menu.sceneDisabled = true;
        menuButton.children.Text.text = "≡";
        loadMenu.sceneDisabled = false;
        toolbar.parent.children.ScreenDarken.fillColor = [0, 128];
        toolbar.parent.children.ScreenDarken.visible = true;
        for (let i of loadMenu.getChildren()) {
            if (i.name.slice(0, 4) == "Chip" || i.name == "Workspace" || i.name == "NoItemsMsg") {
                i.parent = null;
                loadMenu.numItems--;
                loadMenu.heightOffset -= loadMenu.itemHeight;
            }
        }
        if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
            /**@type {ChipData[]} */
            let objs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
            for (let i of objs) {
                if (i.name == "") (new MenuSwitch(loadMenu, "Workspace", "Workspace", 64, false, () => {})).chip = i;
                else (new MenuSwitch(loadMenu, "Chip" + i.name, i.name, 64, false, () => {})).chip = i;
            }
        } else {
            new MenuItem(loadMenu, "NoItemsMsg", "No saved chips found", 64);
        }
    });

    let menuButton = new Rect("MenuButton", 10, 0, 0, -0.5, 0, 0, 0, 0.7, toolbar, {
        fillColor : 96,
        strokeWeight : 0,
        anchorX : 0,
        anchorY : 0.5
    });
    menuButton.scalarW = menuButton.actualH/toolbar.actualW;
    ChipButton.buttonOffset += menuButton.scalarW;
    new TextLabel("Text", "≡", 10, 0, 0, 0, -20, 1, null, null, menuButton, {
        fillColor : 255,
        strokeWeight : 0,
        textSize : 0,
        textSizeScalar : 0.8,
        textFont : "Monospace",
        textAlignHorizontal : "center",
        textAlignVertical : "center",
        active : false
    });
    menuButton.buttonHoverEffect(1, 1, 0, "", 2, 0.5, {
        mouseClicked : () => {
            if (!menu.sceneDisabled) {
                menu.sceneDisabled = true;
                menuButton.children.Text.text = "≡";
                paused = false;
            } else {
                menu.sceneDisabled = false;
                menuButton.children.Text.text = "X";
                paused = true;
            }
        }
    });

    let createChipButton = new Rect("CreateChipButton", 20, ChipButton.buttonOffset, 0, -0.5, 0, 0, 0, 0.7, toolbar, {
        fillColor : 96,
        strokeWeight : 0,
        anchorX : 0,
        anchorY : 0.5
    });
    createChipButton.scalarW = createChipButton.actualH/toolbar.actualW;
    ChipButton.buttonOffset += createChipButton.scalarW;
    new TextLabel("Text", "+", 10, 0, 0, 0, -20, 1, null, null, createChipButton, {
        fillColor : 255,
        strokeWeight : 0,
        textSize : 0,
        textSizeScalar : 0.8,
        textFont : "Monospace",
        textAlignHorizontal : "center",
        textAlignVertical : "center",
        active : false
    });
    createChipButton.buttonHoverEffect(1, 1, 0, "", 2, 0.5, {
        mouseClicked : createChip
    });

    new ChipButton(new BuiltInChip("AND", ins => [ins[0] && ins[1]], 2, 1), colors.AND_CHIP);
    new ChipButton(new BuiltInChip("NOT", ins => [!ins[0]], 1, 1), colors.NOT_CHIP);
}

let immediateUpdate = false;
let paused = false;
let chipId = 0;
/**@type {Wire} */
let draggedWire;
let canConnectTo;
let selectedChipDisplay;
let chipToAdd;
let chipToAddColor;
let chipToAddCount = 1;
let updates;
let newUpdates = []; 
//skipped by immediate updates setting when a chip that has been updated before gets updated again
/**@type {Chip[]}*///let skippedUpdates = [];
//chips that have been updated already this frame (for immediate updates setting)
//let updatedChips = {};
//let needToClearUpdatedChips = false;
function addUpdate(fn) {
    newUpdates.push(fn);
}
/*updates._push = updates.push;
updates.push = function(v) {
    if (!v) throw new Error("sdfdsfs");
    else updates._push(v);
}*/

function draw() {
    processUpdates();
    sketch.draw();
}

function processUpdates() {
    if (paused) return;
    if (immediateUpdate) {
        //update skipped stuff
        /*if (skippedUpdates.length) {
            needToClearUpdatedChips = true;
            newUpdates = [];
            let skippedUpdatesCopy = [...skippedUpdates];
            skippedUpdates = [];
            for (let chip of skippedUpdatesCopy) {
                chip.update();
            }
            while (newUpdates.length) {
                updates = [...newUpdates];
                newUpdates = [];
                for (let u of updates) u();
                updates = undefined;
            }
            skippedUpdatesCopy = undefined;
        }*/
        //if (newUpdates.length) needToClearUpdatedChips = true;
        while (newUpdates.length) {
            updates = [...newUpdates];
            newUpdates = [];
            for (let u of updates) u();
            updates = undefined;
        }
        //if (needToClearUpdatedChips) updatedChips = {};
        //needToClearUpdatedChips = false;
    }
    else if (newUpdates.length) {
        updates = [...newUpdates];
        newUpdates = [];
        for (let u of updates) u();
        updates = undefined;
    }
}

function mouseReleased() {
    if (chipToAdd && mouseY < sketch.children.CreateScreen.children.Workspace.actualH) {
        let heightOffset = 0;
        for (let i = 0; i < chipToAddCount; i++) {
            let ch = copyChip(chipToAdd);
            let disp = new ChipDisplay((ch.update(), ch),
            (mouseX - sketch.children.CreateScreen.children.Workspace.actualX)/sketch.children.CreateScreen.children.Workspace.actualW,
            mouseY/sketch.children.CreateScreen.children.Workspace.actualH + heightOffset, chipToAddColor);
            heightOffset += disp.scalarH + 0.01;
            ch = undefined;
            disp = undefined;
        }

        chipToAdd = undefined;
        chipToAddCount = 1;
        chipToAddColor = undefined;
    }
    
    if (draggedWire && !draggedWire.end) {
        if (canConnectTo) {
            if (canConnectTo.wire) canConnectTo.wire.delete();
            draggedWire.end = canConnectTo;
            canConnectTo.update(draggedWire.value);
            canConnectTo = undefined;
            draggedWire = undefined;
        }
        else {
            draggedWire.delete();
            draggedWire = undefined;
        }
    }
}

/**
 * 
 * @param {KeyboardEvent} e 
 */
function keyReleased(e) {
    if (e.code == "Backspace" && selectedChipDisplay) selectedChipDisplay.chip.delete();
    if (e.code == "KeyD" && selectedChipDisplay) { 
        selectedChipDisplay.strokeWeight = 0;
    }
}

function createChip() {
    let numInputs = 0;
    let numOutputs = 0;
    /**@type {Input[]}*/let usedInputs = [];
    /**@type {Output[]}*/let usedOutputs = [];
    for (let input of sketch.getChild("CreateScreen").getChild("InputBar").getChildren()) {
        if (input instanceof Input) {
            if (input.inUse && input.wires.length) {
                numInputs++;
                usedInputs.push(input);
            }
        }
    }
    for (let output of sketch.getChild("CreateScreen").getChild("OutputBar").getChildren()) {
        if (output instanceof Output) {
            if (output.inUse && output.wire) {
                numOutputs++;
                usedOutputs.push(output);
            }
        }
    }
    if (numInputs + numOutputs == 0) return alert("Please add at least one input or output before creating a chip.");

    //delete all the unused chips (outputs do not have connected wires)
    let chip = new Chip(prompt("Name your chip:"), numInputs, numOutputs);
    for (let i = 0; i < usedInputs.length; i++) {
        chip.inputs[i].wires = [...usedInputs[i].wires];
        usedInputs[i].eventListeners.mouseClicked[0].function(usedInputs[i]);   //toggle off the inputs
    }
    for (let i = 0; i < usedOutputs.length; i++) {
        chip.outputs[i].wire = new Wire(usedOutputs[i].wire.start, chip.outputs[i]);
        usedOutputs[i].eventListeners.mouseClicked[0].function(usedOutputs[i]); //toggle off the outputs
    }
    
    new ChipButton(chip,
        sketch.getChild("CreateScreen").getChild("Workspace").getChildren().
        filter(v => v instanceof ChipDisplay).map(v => v.fillColor).reduce((pValue, cValue, _, arr) => 
        [pValue[0] + cValue[0] / arr.length, pValue[1] + cValue[1] / arr.length, pValue[2] + cValue[2] / arr.length], [0, 0, 0]).map(v => Math.min(v, 255)));

    //get rid of all things in workspace
    let children = sketch.getChild("CreateScreen").getChild("Workspace").getChildren();
    children.forEach(v => {
        v.parent = null;
        if (v.chip && v.chip.requestInputConnectionX) v.chip.requestInputConnectionX = undefined;
        if (v.chip && v.chip.requestInputConnectionY) v.chip.requestInputConnectionY = undefined;
        if (v.chip && v.chip.requestOutputConnectionX) v.chip.requestOutputConnectionX = undefined;
        if (v.chip && v.chip.requestOutputConnectionY) v.chip.requestOutputConnectionY = undefined;
    });

    WireDisplay.wireCount = 0;    
    chipId = 0;
}

/**
 * @param {Chip} chip 
 * @returns {Chip} Copied chip
 */
function copyChip(chip) {
    if (chip instanceof BuiltInChip) {
        return new BuiltInChip(chip.name, chip.fn, chip.numInputs, chip.numOutputs);
    }
    let newChip = new Chip(chip.name, chip.numInputs, chip.numOutputs);
    //record chips with their id as key
    let chips = {};
    /**
     * 
     * @param {Wire} wire 
     * @param {ChipInput | ChipOutput} start 
     */
    function recursiveCopy(wire, start) {
        let newWire = new Wire(start);
        if (wire.end instanceof ChipOutput) {
            newWire.end = newChip.outputs[wire.end.index];
        }
        else if (wire.end instanceof ChipInput) {
            if (chips[wire.end.parentChip.id]) {
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                return;
            }
            if (wire.end.parentChip instanceof BuiltInChip) {
                chips[wire.end.parentChip.id] = new BuiltInChip(wire.end.parentChip.name, wire.end.parentChip.fn, wire.end.parentChip.numInputs, wire.end.parentChip.numOutputs);
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                chips[wire.end.parentChip.id].outputs.forEach(/**@param {ChipOutput} output*/(output, i) => {
                    wire.end.parentChip.outputs[i].wires.forEach(w => {
                        recursiveCopy(w, output);
                    });
                });
            } else {
                chips[wire.end.parentChip.id] = copyChip(wire.end.parentChip);
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                chips[wire.end.parentChip.id].outputs.forEach(/**@param {ChipOutput} output*/(output, i) => {
                    wire.end.parentChip.outputs[i].wires.forEach(w => {
                        recursiveCopy(w, output);
                    });
                });
            }
        }
    }
    for (let i = 0; i < chip.numInputs; i++) {
        chip.inputs[i].wires.forEach(v => recursiveCopy(v, newChip.inputs[i]));
    }
    return newChip;
}

/**
 * The format of the data that gets saved
 * @typedef {Object} ChipData
 * @property {string} name Name of chip; If empty string, it is the workspace
 * @property {{name : string, id : number, x? : number, y? : number, outputs : WireData[]}[]} chips A list of all the chips that make up the saved chip
 * @property {{id : number, wires : WireData}[]} inputs A list of used inputs
 * @property {number[]} outputs A list of the indeces of used outputs
 * @property {number[]} [color] Color of the chip (not present for workspace)
 */

/**
 * The format of the data of wires that gets saved.
 * 
 * If the element is a single number, then the wire is connected to an output and the number refers to the index of the chip's output.
 * 
 * If the element is an array of two numbers, then the wire is connected to a chip, the first number refers to the chip's id, and the second number refers to the index of the input.
 * @typedef {Array<number | number[]>} WireData
 */

/**
 * @param {Chip} chip 
 * @returns {ChipData}
 */
function saveChip(chip) {
    /**@type {ChipData} */
    let obj = {};
    if (!chip) {    //save the workspace
        obj.name = "";
        obj.chips = [];
        obj.inputs = [];
        for (let i of sketch.getChild("CreateScreen").getChild("InputBar").getChildren()) {
            if (i instanceof Input) {
                if (i.inUse) obj.inputs.push({
                    id : Number(i.name.slice(5)),
                    wires : getWiresDestinations(i.wires)
                });
            }
        }
        obj.outputs = [];
        for (let i of sketch.getChild("CreateScreen").getChild("OutputBar").getChildren()) {
            if (i instanceof Output) {
                if (i.inUse) obj.outputs.push(Number(i.name.slice(6)));
            }
        }
        for (let i of sketch.getChild("CreateScreen").getChild("Workspace").getChildren()) {
            if (i instanceof ChipDisplay) {
                let chipObj = {name : i.chip.name, id : i.chip.id, x : i.scalarX, y : i.scalarY, outputs : []};
                for (let output of i.chip.outputs) {
                    chipObj.outputs.push(getWiresDestinations(output.wires));
                }
                obj.chips.push(chipObj);
            }
        }
    } else {
        let processedChips = [];
        obj.name = chip.name;
        obj.chips = [];
        obj.inputs = [];
        obj.color = sketch.children.CreateScreen.children.Toolbar.children[chip.name].color;
        /**
         * @param {ChipInput | ChipOutput} start 
         */
        function recursiveSave(start, outputArr) {
            if (outputArr) outputArr.push(getWiresDestinations(start.wires));
            for (let i of start.wires) {
                if (!i.end) continue;
                if (i.end instanceof ChipInput) {
                    if (!processedChips.includes(i.end.parentChip.id)) {
                        processedChips.push(i.end.parentChip.id);
                        let chipObj = {name : i.end.parentChip.name, id : i.end.parentChip.id, outputs : []};
                        for (let output of i.end.parentChip.outputs) {
                            recursiveSave(output, chipObj.outputs);
                        }
                        obj.chips.push(chipObj);
                    } else continue;
                }
            }
        }
        for (let i of chip.inputs) {
            obj.inputs.push({
                id : i.index,
                wires : getWiresDestinations(i.wires)
            });
            recursiveSave(i);
        }
        obj.outputs = [];
        for (let i of chip.outputs) {
            obj.outputs.push(i.index);
        }
    }
    return obj;
}

/**
 * @param {Wire[]} wires 
 * @returns {WireData}
 */
function getWiresDestinations(wires) {
    /**@type {WireData} */
    let destinations = [];
    for (let i of wires) {
        if (!i.end) destinations.push(null);
        else if (i.end instanceof ChipOutput) {
            destinations.push(i.end.index);
        } else if (i.end instanceof Output) {
            destinations.push(Number(i.end.name.slice(6)));
        } else {
            destinations.push([i.end.parentChip.id, i.end.index]);
        }
    }
    return destinations;
}

/**
 * @param {ChipData} data 
 */
function loadChip(data) {
    if (data.name == "") { //load workspace
        //clear all existing chips
        sketch.children.CreateScreen.children.Workspace.getChildren().forEach(v => {
            if (v instanceof ChipDisplay) {
                v.chip.delete();
            }
            if (v instanceof WireDisplay) {
                v.wire.delete();
            }
            v.parent = null;
        });
        for (let i of sketch.children.CreateScreen.children.InputBar.getChildren()) {
            if (i instanceof Input && i.inUse) i.eventListeners.mouseClicked[0].function(i);
        }
        data.inputs.forEach(v => {
            sketch.children.CreateScreen.children.InputBar.children["Input" + v.id].eventListeners.mouseClicked[0].function(sketch.children.CreateScreen.children.InputBar.children["Input" + v.id]);
        });
        for (let i of sketch.children.CreateScreen.children.OutputBar.getChildren()) {
            if (i instanceof Output && i.inUse) i.eventListeners.mouseClicked[0].function(i);
        }
        data.outputs.forEach(v => {
            sketch.children.CreateScreen.children.OutputBar.children["Output" + v].eventListeners.mouseClicked[0].function(sketch.children.CreateScreen.children.OutputBar.children["Output" + v]);
        });

        /**@type {Object<number, Chip>} */
        let processedChips = {};
        /**@param {WireData}wires*/
        function recursiveLoad(wires, start) {
            for (let wire of wires) {
                let newWire;
                new WireDisplay(newWire = new Wire(start));
                if (typeof wire == "number") {
                    newWire.end = sketch.children.CreateScreen.children.OutputBar.children["Output" + wire];
                } else if (Array.isArray(wire)) {
                    if (processedChips[wire[0]]) {
                        newWire.end = processedChips[wire[0]].inputs[wire[1]];
                        continue;
                    }
                    let chipData = data.chips.find(v => v.id == wire[0]);
                    let newChip = copyChip(sketch.children.CreateScreen.children.Toolbar.children[chipData.name].chip);
                    newWire.end = newChip.inputs[wire[1]];
                    processedChips[wire[0]] = newChip;
                    for (let out = 0; out < chipData.outputs.length; out++) {
                        recursiveLoad(chipData.outputs[out], newChip.outputs[out]);
                    }
                    new ChipDisplay(newChip, chipData.x, chipData.y, sketch.children.CreateScreen.children.Toolbar.children[chipData.name].color);
                }
            }
        }
        for (let i of data.inputs) {
            recursiveLoad(i.wires, sketch.children.CreateScreen.children.InputBar.children["Input" + i.id])
        }
    } else {
        let loadedChip = new Chip(data.name, data.inputs.length, data.outputs.length);
        /**@type {Object<number, Chip>} */
        let processedChips = {};
        /**@param {WireData}wires*/
        function recursiveLoad(wires, start) {
            for (let wire of wires) {
                let newWire = new Wire(start);
                if (typeof wire == "number") {
                    newWire.end = loadedChip.outputs[wire];
                } else if (Array.isArray(wire)) {
                    if (processedChips[wire[0]]) {
                        newWire.end = processedChips[wire[0]].inputs[wire[1]];
                        continue;
                    }
                    let chipData = data.chips.find(v => v.id == wire[0]);
                    let newChip = copyChip(sketch.children.CreateScreen.children.Toolbar.children[chipData.name].chip);
                    newWire.end = newChip.inputs[wire[1]];
                    processedChips[wire[0]] = newChip;
                    for (let out = 0; out < chipData.outputs.length; out++) {
                        recursiveLoad(chipData.outputs[out], newChip.outputs[out]);
                    }
                }
            }
        }
        for (let i of data.inputs) {
            recursiveLoad(i.wires, loadedChip.inputs[i.id]);
        }

        new ChipButton(loadedChip, data.color);
    }
}

/**@implements {ConnectionPort} */
class Input extends Rect {
    /**@type {Wire[]}*/
    wires = [];
    constructor(position) {
        super("Input" + position, 0, 0, 5, 0.1 * position, 0, 1, -10, 0.1, sketch.getChild("CreateScreen").getChild("InputBar"), {fillColor : 64, strokeWeight : 0});
        this.value = false;
        this.inUse = false;
        this.buttonHoverEffect(1, 1, 0, "linear", 2, 0.75, {
            mouseClicked : thisShape => {
                this.inUse = !this.inUse;
                if (!this.inUse) {
                    let list = [...this.wires];
                    list.forEach(w => w.delete()); 
                }
                thisShape.children.Ellipse.visible = this.inUse;
                thisShape.children.Ellipse.active = this.inUse;
                thisShape.value = false;
                thisShape.children.Ellipse.fillColor = colors.DARK_NODE;
            }
        })
        let e = new Ellipse("Ellipse", 0, 1, 0, 0.5, 0, 0, 0, 0.5, this, {anchorX : 0.5, anchorY : 0.5, fillColor : colors.DARK_NODE, active : false, visible : false, strokeWeight : 0});
        e.w = e.actualH;
        e.addEventListener("mouseClicked", thisShape => {
            thisShape.parent.value = !thisShape.parent.value;
            if (thisShape.parent.value) {
                thisShape.fillColor = colors.BRIGHT_NODE;
            } else {
                thisShape.fillColor = colors.DARK_NODE;
            }
            thisShape.parent.update(thisShape.parent.value);
        });
        e.addEventListener("mouseDragged", thisShape => {
            if (!draggedWire && dist(thisShape.actualX, thisShape.actualY, mouseX, mouseY) > thisShape.actualH / 2) {
                new WireDisplay(draggedWire = new Wire(thisShape.parent));
            }
        });
    }

    getConnectionX() {
        return this.children.Ellipse.actualX + this.children.Ellipse.actualW / 2;
    }
    getConnectionY() {
        return this.children.Ellipse.actualY;
    }

    update(val) {
        this.value = val;
        if (this.value) {
            this.children.Ellipse.fillColor = colors.BRIGHT_NODE;
        } else {
            this.children.Ellipse.fillColor = colors.DARK_NODE;
        }
        this.wires.forEach(w => {
            w.update(this.value);
        });
    }
}

/**@implements {ConnectionPort} */
class Output extends Rect {
    constructor(position) {
        super("Output" + position, 0, 0, 5, 0.1 * position, 0, 1, -10, 0.1, sketch.getChild("CreateScreen").getChild("OutputBar"), {fillColor : 64, strokeWeight : 0});
        this.value = false;
        this.inUse = false;
        this.wire = null;
        this.buttonHoverEffect(1, 1, 0, "linear", 2, 0.75, {
            mouseClicked : thisShape => {
                this.inUse = !this.inUse;
                if (!this.inUse && this.wire) this.wire.delete();
                thisShape.children.Ellipse.visible = this.inUse;
                thisShape.children.Ellipse.active = this.inUse;
                thisShape.value = false;
                thisShape.children.Ellipse.fillColor = colors.DARK_NODE;
            }
        })
        let e = new Ellipse("Ellipse", 0, 0, 0, 0.5, 0, 0, 0, 0.5, this, {anchorX : 0.5, anchorY : 0.5, fillColor : colors.DARK_NODE, active : false, visible : false, strokeWeight : 0});
        e.w = e.actualH;
        e.addEventListener("mouseEnter", thisShape => {
            if (draggedWire) {
                canConnectTo = thisShape.parent;
            }
        });
        e.addEventListener("mouseLeave", thisShape => {
            if (draggedWire && canConnectTo == thisShape.parent) {
                canConnectTo = undefined;
            }
        });
        e.addEventListener("mouseClicked", thisShape => {
            if (thisShape.parent.wire) thisShape.parent.wire.delete();
        });
    }

    getConnectionX() {
        return this.children.Ellipse.actualX + this.children.Ellipse.actualW / 2;
    }
    getConnectionY() {
        return this.children.Ellipse.actualY;
    }

    update(val) {
        this.value = val;
        if (this.value) {
            this.children.Ellipse.fillColor = colors.BRIGHT_NODE;
        } else {
            this.children.Ellipse.fillColor = colors.DARK_NODE;
        }
    }
}

/**@interface */
class ConnectionPort {
    /**@returns {number} */
    getConnectionX() {}
    getConnectionY() {}
    /**@param {boolean} newValue */
    update(newValue) {}
    /**@type {boolean} */
    value;
    /**@type {boolean} */
    canConnectTo;
}

class WireDisplay extends CustomShape {
    static wireCount = 0;
    constructor(wire) {
        WireDisplay.wireCount++;
        super("Wire" + WireDisplay.wireCount, sketch.getChild("CreateScreen").getChild("Workspace"), (thisShape, superDraw) => {
            if (thisShape.wire.deleted) {
                thisShape.parent = null;
                thisShape.wire = undefined;
                return;
            }
            push();
            stroke(thisShape.wire.value ? colors.BRIGHT_WIRE : colors.DARK_WIRE);
            strokeWeight(3);
            if (!thisShape.wire.end) {
                line(thisShape.wire.start.getConnectionX(), thisShape.wire.start.getConnectionY(), mouseX, mouseY);
            } else {
                line(thisShape.wire.start.getConnectionX(), thisShape.wire.start.getConnectionY(), thisShape.wire.end.getConnectionX(), thisShape.wire.end.getConnectionY());
            }
            superDraw();
            pop();
        });
        this.active = false;
        /**@type {Wire} */
        this.wire = wire;
    }
}

/**@implements {ConnectionPort} */
class Wire {
    constructor(start, end) {
        this.start = start;
        this.start.wires.push(this);
        this.end = end;
        this.value = false;
        this.deleted = false;
        this.update(this.start.value);
    }

    #end;
    get end() {return this.#end}
    set end(val) {
        if (this.#end) this.#end.wire = null;
        this.#end = val;
        if (this.#end) this.#end.wire = this;
    }

    update(val) {
        if (this.deleted) return;
        this.value = val;
        if (this.end) addUpdate(() => this.end.update(this.value));
    }

    delete() {
        if (this.end) {
            this.end.wire = null;
            this.end.update(false);
        }
        this.start.wires.splice(this.start.wires.indexOf(this), 1);
        this.deleted = true;
    }
}

class ChipInput {
    /**
     * 
     * @param {Chip} parentChip 
     * @param {number} index 
     */
    constructor(parentChip, index) {
        this.value = false;
        this.parentChip = parentChip;
        this.canConnectTo = true;
        this.index = index;
        this.wire = null;
        /**@type {Wire[]}*/this.wires = [];
    }

    update(val) {
        this.value = val;
        this.parentChip.update(this.index);
    }

    getConnectionX() {
        return this.parentChip.requestInputConnectionX(this.index);
    }
    getConnectionY() {
        return this.parentChip.requestInputConnectionY(this.index);
    }
}

class ChipOutput {
    constructor(parentChip, index) {
        this.value = false;
        this.parentChip = parentChip;
        this.index = index;
        /**@type {Wire[]} */
        this.wires = [];
        this.wire = null;
    }

    update(val) {
        if (this.value == val) {
            if (this.value) return; //only return if value is true because when a new chip is created everything is false so we need to update the rest anyways
        }
        this.value = val;
        this.wires.forEach(v => {
            addUpdate(() => v.update(this.value));
        });
    }

    getConnectionX() {
        return this.parentChip.requestOutputConnectionX(this.index);
    }
    getConnectionY() {
        return this.parentChip.requestOutputConnectionY(this.index);
    }
}

class ChipDisplay extends Rect {
    /**@readonly*/static CHIP_WIDTH = 1/20;
    /**@readonly*/static NODE_HEIGHT = 0.03;
    constructor(chip, sx, sy, color) {
        ChipDisplay.chipCount++;
        super("Chip" + chip.id, 0, sx, 0, sy, 0, ChipDisplay.CHIP_WIDTH, 0, Math.max(chip.numInputs, chip.numOutputs) * ChipDisplay.NODE_HEIGHT, sketch.getChild("CreateScreen").getChild("Workspace"), {
            fillColor : color,
            strokeWeight : 0,
            strokeColor : colors.SELECTED_OUTLINE
        });
        new TextLabel("Text", chip.name, 10, 0, 0, 0.5, -20, 1, null, null, this, {
            fillColor : 255,
            strokeWeight : 0,
            textSize : this.parent.actualH/40,
            textFont : "Monospace",
            textAlignHorizontal : "center",
            textAlignVertical : "center",
            active : false
        });
        /**@type {Chip} */
        this.chip = chip;
        chip.requestInputConnectionX = (function(index) {
            return this.getChild("Input" + index).actualX;
        }).bind(this);
        chip.requestInputConnectionY = (function(index) {
            return this.getChild("Input" + index).actualY + this.getChild("Input" + index).actualH/2
        }).bind(this);
        chip.requestOutputConnectionX = (function(index) {
            return this.getChild("Output" + index).actualX;
        }).bind(this);
        chip.requestOutputConnectionY = (function(index) {
            return this.getChild("Output" + index).actualY + this.getChild("Output" + index).actualH/2
        }).bind(this);
        this.addEventListener("mouseDragged", (thisShape, movementX, movementY) => {
            thisShape.scalarX += movementX/sketch.children.CreateScreen.children.Workspace.actualW;
            thisShape.scalarY += movementY/sketch.children.CreateScreen.children.Workspace.actualH;
        });
        this.addEventListener("draw", thisShape => {
            if (thisShape.chip.deleted) {
                thisShape.getChildren().forEach(v => v.visible = false);
                thisShape.parent = null;
                thisShape.chip = undefined;
                selectedChipDisplay = undefined;
            }
        });
        this.addEventListener("mouseClicked", thisShape => {
            if (selectedChipDisplay) selectedChipDisplay.strokeWeight = 0;
            selectedChipDisplay = thisShape;
            thisShape.strokeWeight = 0.01 * thisShape.parent.actualH;
        });
        for (let i of chip.inputs) {
            let e = new Ellipse("Input" + i.index, 0, 0, this.parent.actualY + i.index * 0.9 * ChipDisplay.NODE_HEIGHT * this.parent.actualH, 0, 0, 0, 0.9 * ChipDisplay.NODE_HEIGHT * this.parent.actualH, 0, this, {anchorX : 0.5, fillColor : colors.DARK_NODE, strokeWeight : 0});
            e.w = e.actualH;
            e.addEventListener("mouseEnter", thisShape => {
                if (draggedWire) {
                    canConnectTo = i;
                }
            });
            e.addEventListener("mouseLeave", thisShape => {
                if (draggedWire && canConnectTo == i) {
                    canConnectTo = undefined;
                }
            });
            e.addEventListener("mouseClicked", thisShape => {
                if (i.wire) i.wire.delete();
            });
        }
        for (let i of chip.outputs) {
            let e = new Ellipse("Output" + i.index, 0, 1, this.parent.actualY + i.index * 0.9 * ChipDisplay.NODE_HEIGHT * this.parent.actualH, 0, 0, 0, 0.9 * ChipDisplay.NODE_HEIGHT * this.parent.actualH, 0, this, {anchorX : 0.5, fillColor : colors.DARK_NODE, strokeWeight : 0});
            e.w = e.actualH;
            e.addEventListener("mouseDragged", thisShape => {
                if (!draggedWire && dist(thisShape.actualX, thisShape.actualY, mouseX, mouseY) > thisShape.actualH / 2) {
                    new WireDisplay(draggedWire = new Wire(thisShape.parent.chip.outputs[Number(thisShape.name.slice(6))]));
                }
            });
        }
    }
}

class Chip {
    constructor(name, numInputs, numOutputs) {
        this.name = name;
        this.id = chipId;
        chipId++;
        this.numInputs = numInputs;
        this.inputs = [];
        for (let i = 0; i < numInputs; i++) {
            this.inputs.push(new ChipInput(this, i));
        }
        this.numOutputs = numOutputs;
        this.outputs = [];
        for (let i = 0; i < numOutputs; i++) {
            this.outputs.push(new ChipOutput(this, i));
        }
        this.deleted = false;
    }

    update(index) {
        if (this.deleted) return;
        /*if (immediateUpdate) {
            if (updatedChips[this.id]) {
                //skippedUpdates.push(this);
                //return;
            } else {
                updatedChips[this.id] = true;
            }
        }*/
        //if (index || index === 0) this.inputs[index].wires.forEach(wire => wire.update(this.inputs[index].value));
        //else {
            this.inputs.forEach(input => {
                input.wires.forEach(wire => wire.update(input.value));
            });
        //}
    }

    delete() {
        for (let i of this.outputs) {
            i.wires.forEach(v => v.delete());
        }
        for (let i of this.inputs) {
            if (i.wire) i.wire.delete();
        }
        this.deleted = true;
    }
}

class BuiltInChip extends Chip {
    constructor(name, fn, numInputs, numOutputs) {
        super(name, numInputs, numOutputs);
        this.fn = fn;
    }

    update() {
        /*if (immediateUpdate) {
            if (updatedChips[this.id]) {
                //skippedUpdates.push(this);
                //return;
            } else {
                updatedChips[this.id] = true;
            }
        }*/
        let outs = this.fn(this.inputs.map(c => c.value), this.outputs.map(c => c.value));
        this.outputs.forEach((o, i) => o.update(outs[i]));
    }
}

class ChipButton extends Rect {
    static buttonOffset = 0;
    constructor(chip, color) {
        let toolbar = sketch.getChild("CreateScreen").getChild("Toolbar");
        super(chip.name, 10 + toolbar.getChildren().length * 10, ChipButton.buttonOffset, 0, -0.5, 0, 1, 0, 0.7, toolbar, {
            fillColor : 96,
            strokeWeight : 0,
            anchorX : 0,
            anchorY : 0.5
        });
        let text = new TextLabel("Text", chip.name, 10, 0, 0, 0, -20, 1, null, null, this, {
            fillColor : 255,
            strokeWeight : 0,
            textSize : 0,
            textSizeScalar : 0.8,
            textFont : "Monospace",
            textAlignHorizontal : "center",
            textAlignVertical : "center",
            active : false
        });
        this.scalarW = text.getTextWidth()/toolbar.actualW;
        ChipButton.buttonOffset += this.scalarW;
        this.chip = chip;
        this.color = color;
        this.buttonHoverEffect(1, 1, 0, "", 2, 0.5, {
            mouseClicked : thisShape => {
                if (chipToAdd == thisShape.chip) {
                    chipToAddCount++;
                    thisShape.children.Text.text = "x" + chipToAddCount;
                    setTimeout(() => thisShape.children.Text.text = thisShape.chip.name, 1000);
                    return;
                }
                chipToAdd = thisShape.chip;
                chipToAddColor = this.color;
                chipToAddCount = 1;
            }
        });
    }
}

class Menu extends Rect {
    heightOffset = 0;
    numItems = 0;
    itemHeight = 1/20;
    padding = 10;
    textFont = "Arial";
    //implicit constructor
}

class MenuItem extends Rect {
    /**
     * @param {Menu} menu 
     * @param {string} name 
     * @param {any} color 
     * @param {(thisShape: MenuItem) => void} mouseClicked 
     */
    constructor(menu, name, label, color, mouseClicked) {
        super(name, 0, 0, (menu.numItems + 1) * menu.padding, menu.heightOffset, 0, 1, 0, menu.itemHeight, menu, {
            fillColor : color,
            strokeWeight : 0,
            active : !(!mouseClicked)
        });
        new TextLabel("Text", label, 10, 0, 0, 0.5, null, null, null, null, this, {
            fillColor : 255,
            strokeWeight : 0,
            textAlignHorizontal : "left",
            textAlignVertical : "center",
            textSize : 0,
            textSizeScalar : 0.8,
            textFont : menu.textFont,
            active : false
        });
        if (mouseClicked) {
            this.buttonHoverEffect(1, 1, 0, "", 2, 0.5, {
                "mouseClicked" : mouseClicked
            });
        }
        menu.numItems++;
        menu.heightOffset += menu.itemHeight;
    }
}

class MenuSwitch extends MenuItem {
    constructor(menu, name, label, color, value, onToggle, active=true) {
        super(menu, name, label, color, thisShape => {
            if (!thisShape.canToggle) return;
            thisShape.value = !thisShape.value;
            if (thisShape.onToggle) thisShape.onToggle(thisShape.value);
        });
        this.value = value;
        this.onToggle = onToggle;
        this.canToggle = active;
        this.addEventListener("draw", thisShape => {
            push();
            fill(this.canToggle ? (this.value ? [0, 128, 0] : 196) : (this.value ? [0, 255, 0] : 96));
            rectMode(CENTER);
            noStroke();
            rect(this.actualX + this.actualW * 3/4, this.actualY + this.actualH/2, this.actualW/6, this.actualH * 0.6, Number.MAX_SAFE_INTEGER);
            fill(220);
            ellipse(this.actualX + this.actualW * 2/3 + this.value * this.actualW/6, this.actualY + this.actualH/2, this.actualH * 0.8);
            pop();
        });
    }
}

//setup();
//setInterval(() => {TweenManager.update(100); draw()}, 100);