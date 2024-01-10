'use strict';
/**
 * @type {SketchObject}
 */
//sketch's h will be replaced with half of the final width in setup function
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
                            function : (/**@type {Script}*/script) => {
                                //this script is disabled
                                /**@type {Shape} */
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
                    function : (/**@type {Script}*/script) => {
                        const buttonNames = ["ContinueButton", "NewGameButton", "SandboxButton"];
                        /**@type {Shape[]} */
                        const buttons = buttonNames.map(name => script.parent.getChild(name));
                        for (let button of buttons) {
                            button.buttonHoverEffect(1.1, 0.95, 250, "easeOutQuad", 3, 0.75, {
                                mouseClicked : (function(){
                                    switch (button.name) {
                                        case "ContinueButton":
                                            return thisShape => {thisShape.strokeColor = [random(256), random(256), random(256)].map(Math.floor);};
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
                    scalarW : 0.975,
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
                    children : [
                        {
                            type : "Script",
                            name : "Script",
                            disabled : false,
                            function : (/**@type {Script}*/script) => {
                                script.parent.addEventListener("mouseClicked", () => {
                                    if (selectedChipDisplay) {
                                        selectedChipDisplay.strokeWeight = 0;
                                        selectedChipDisplay = undefined;
                                    }
                                });
                            },
                            children : null
                        }
                    ]
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
                            function : (/**@type {Script}*/script) => {
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
                    scalarX : 0.975,
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
                            function : (/**@type {Script}*/script) => {
                                for (let i = 0; i < 10; i++) {
                                    new Output(i);
                                }
                            },
                            children : [
                            ]
                        }
                    ]
                },
                {
                    type : "Shape",
                    name : "ScreenDarken",
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
                    visible : false,
                    active : false
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
            draw : (/**@type {Shape}*/thisShape, /**@type {function}*/superDraw) => {
                push();
                if (!thisShape.graphics) thisShape.graphics = createGraphics(width, height);
                thisShape.graphics.background(thisShape.fillColor || 0);
                thisShape.graphics.erase();
                thisShape.graphics.strokeWeight(0);
                thisShape.graphics.fill(255);
                thisShape.graphics.circle(thisShape.actualX, thisShape.actualY, thisShape.scale);
                thisShape.graphics.noErase();
                thisShape.graphics.fill(0, 0);
                thisShape.graphics.strokeWeight((thisShape.strokeWeight * thisShape.scale/width) || 0);
                thisShape.graphics.stroke(thisShape.strokeColor || 0);
                thisShape.graphics.circle(thisShape.actualX, thisShape.actualY, thisShape.scale);
                image(thisShape.graphics, 0, 0, width, height);
                superDraw();
                pop();
            },
            wipe : (x, y, scalarX, scalarY, time, easing, callback) => {
                /**@type {Shape} */
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
                /**@type {Shape} */
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