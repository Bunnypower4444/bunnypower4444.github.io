'use strict';
/*
  Stuff to add:
    Maybe more stuff from roblox like BindableEvents
 */
/**
 * General class representing a node in the engine hierarchy
 */
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
    /**
     * Name of the node
     */
    get name() {
        return this.#name;
    };
    set name(val) {
        if (this.#parent) delete this.#parent.children[this.#name];
        this.#name = val;
        if (this.#parent) this.#parent.children[this.#name] = this;
    }
    #parent;
    /**
     * The parent container for the node. If unset and strictly not null, the parent will become the sketch. 
     * If null, this node has no parent, and will not be processed. (e.g. drawn, checked for clicking, etc.)
     * @type {EngineNode | Shape | Script | Value | Folder}
     */
    get parent() {
        return this.#parent;
    }
    set parent(val) {
        if (this.#parent) delete this.#parent.children[this.name];
        this.#parent = val;
        if (this.#parent) this.#parent.children[this.name] = this;
    }
    /**
     * An object containing all the node's children as keys
     * @type {Object<string, EngineNode>}
     */
    children = {};
    /**
     * Returns the list of children of this node.
     * @returns {EngineNode[]}
     */
    getChildren() {
        if (!this.children) return [];
        return Object.values(this.children);
    }

    /**
     * Gets a child of the node using the child object's name.
     * @param {string} name Name of the child object
     * @returns {EngineNode | Shape | Script | Value | Folder}
     */
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
/*class ShapeData extends EngineNode {
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
    /**
     * @type {"Rect" | "Ellipse" | "Triangle" | "CustomPolygon" | "CustomPolygonCurved" | "Text" | "CustomShape"}
     *
    get shapeType() {return this.#shapeType;}

    //POSITION PROPERTIES
    //#region
    x = 0; y = 0; w = 0; h = 0; 
    scalarX = 0; scalarY = 0; scalarW = 0; scalarH = 0; 
    /**@type {number}*get actualX() {return this.x + this.scalarX * this.parent.actualW + this.parent.actualX}
    /**@type {number}*get actualY() {return this.y + this.scalarY * this.parent.actualH + this.parent.actualY}
    /**@type {number}*get actualW() {return this.w + this.scalarW * this.parent.actualW}
    /**@type {number}*get actualH() {return this.h + this.scalarH * this.parent.actualH}
    /**
     * For triangles and custom shapes:
     * List of coordinate pairs, which are stored as [{x, scalarX, y, scalarY}]
     * @type {{x : number, scalarX? : number, y : number, scalarY? : number}[]}
     *
    vertices;
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned horizontally (e.g. 0 is left side, 0.5 is center, 1 is right side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    *anchorX = 0; 
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned vertically (e.g. 0 is top side, 0.5 is center, 1 is bottom side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    *anchorY = 0; 
    //#endregion

    //TEXT PROPERTIES
    //#region 
    text = "";
    /** Specifies horizontal text alignment for text shapes. @type {LEFT | CENTER | RIGHT} *textAlignHorizontal = "center";
    /** Specifies vertical text alignment for text shapes. @type {TOP | CENTER | BOTTOM | BASELINE} *textAlignVertical = "center";
    textSize = 18;
    /** Scalar text size based on parent element's height. *textSizeScalar = 0;
    textFont = "Arial";
    /** Specifies style of the text. @type {NORMAL | BOLD | ITALIC | BOLDITALIC} *textStyle = "normal";
    //#endregion
    
    //VISUAL PROPERTIES
    //#region 
    scale = 1; 
    /**
     * Rotation of the shape counter-clockwise in degrees.
     * The point the shape rotates around depends on anchorX and anchorY. For triangles and custom shapes, it depends on actualX and actualY, since they are defined by their vertices instead.
    *rotation = 0;
    fillColor = 128; strokeColor = 0; strokeWeight = 1; 
    visible = true; active = true;
    //#endregion

    //MISC PROPERTIES
    //#region 
    /**
     * Corner curve of a rectangle. If the value is a number, that curve value is used for all corners. If it is an array, each value corresponds to a corner in the order: [top-left, top-right, bot-right, bot-left]
     * @type {number | number[]}
    *cornerCurve = 0;
    /**
     * The type of a custom shape, used with beginShape(). Will not be used with curved custom shapes.
     * @type {null | POINTS | LINES | TRIANGLES | TRIANGLE_FAN | TRIANGLE_STRIP | QUADS | QUAD_STRIP | TESS}
     *
    customPolygonType = null;
    /**
     * Used with endShape(); Defaults to CLOSE
     * @type {CLOSE | null}
     *
    customPolygonEndType = "close";
    //#endregion
}*/

class Shape extends EngineNode {
    /**
     * Basic shape constructor
     * @param {string} name 
     * @param {Shape} args Properties of the shape
     * @param {EngineNode} parent Parent container for the shape. If not specified, uses the sketch
     * @param {string} shapeType Type of the shape
     */
    constructor(name, args, parent, shapeType) {
        super("Shape", name || type, parent);
        this.#shapeType = shapeType;
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
    /**
     * @type {"Rect" | "Ellipse" | "Triangle" | "CustomPolygon" | "CustomPolygonCurved" | "Text" | "CustomShape"}
     */
    get shapeType() {return this.#shapeType;}

    //POSITION PROPERTIES
    //#region
    x = 0; y = 0; w = 0; h = 0; 
    scalarX = 0; scalarY = 0; scalarW = 0; scalarH = 0; 
    /**@type {number}*/get actualX() {return this.x + this.scalarX * this.parent.actualW + this.parent.actualX}
    /**@type {number}*/get actualY() {return this.y + this.scalarY * this.parent.actualH + this.parent.actualY}
    /**@type {number}*/get actualW() {return this.w + this.scalarW * this.parent.actualW}
    /**@type {number}*/get actualH() {return this.h + this.scalarH * this.parent.actualH}
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned horizontally (e.g. 0 is left side, 0.5 is center, 1 is right side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    */anchorX = 0; 
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned vertically (e.g. 0 is top side, 0.5 is center, 1 is bottom side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    */anchorY = 0; 
    //#endregion
    //VISUAL PROPERTIES
    //#region 
    scale = 1; 
    /**
     * Rotation of the shape counter-clockwise in degrees.
     * The point the shape rotates around depends on anchorX and anchorY. For triangles and custom shapes, it depends on actualX and actualY, since they are defined by their vertices instead.
    */rotation = 0;
    fillColor = 128; strokeColor = 0; strokeWeight = 1; 
    visible = true; active = true;
    //#endregion

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
    /**
     * @returns {boolean}
     */
    mouseIsOver() {};

    /**If the mouse was pressed while on the shape, used to check if a full click was completed */
    mousePressedWhileOn = false;
    mouseOver = false;

    /**
     * @type {{draw : EventConnection[],
     *  mouseReleased : EventConnection[],
     *  mousePressed : EventConnection[],
     *  mouseClicked : EventConnection[],
     *  mouseEnter : EventConnection[],
     *  mouseLeave : EventConnection[],
     *  mouseDragged : EventConnection[]}}
     */
    eventListeners = {
    };
    /**
     * Add an event listener.
     * @param {("draw" | "mouseReleased" | "mousePressed" | "mouseEnter" | "mouseLeave" | "mouseClicked" | "mouseDragged")} eventType Event to listen for
     * @param {(thisShape: this, movementX? : number, movementY? : number) => void} fn The function to be run when the event happens. If the event is mouseDragged, two more arguments are given
     * @returns {EventConnection} The event connection for the function
     */
    addEventListener(eventType, fn) {
        let connection = new EventConnection(eventType, fn, thisConnection => {
            this.eventListeners[eventType].splice(this.eventListeners[eventType].indexOf(thisConnection), 1);
        });
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(connection);
        return connection;
    }

    /**
     * Tweens one of the shape's properties
     * @param {string} property Property to tween
     * @param {number} target Target amount
     * @param {number} time Time
     * @param {string} [easing] Tween easing (defaults to linear, see TweenManager.EASINGS for the easing styles)
     * @param {(thisShape: this) => any} [callback] Callback for when the tween finishes
     * @returns {Promise} The event for when the tween finishes
     */
    tweenProperty(property, target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }

    static drawAllShapes() {
        /** @param {EngineNode} node*/
        function recursiveDraw(node) {
            if (node instanceof Shape) node.draw();
            let children = node.getChildren();
            for (let c of children) {
                recursiveDraw(c);
            }
        }
        recursiveDraw(sketch);
    }

    /**
     * Creates a scaling and color effect when the shape is hovered over and pressed. Useful for buttons.
     * @param {number} maxScale 
     * @param {number} minScale 
     * @param {number} scaleTime 
     * @param {string} easing 
     * @param {number} lightenFactor 
     * @param {number} darkenFactor 
     * @param {{mouseEnter?: ((thisShape: Shape) => void),
     * mouseLeave?: ((thisShape: Shape) => void),
     * mousePressed?: ((thisShape: Shape) => void), 
     * mouseReleased?: ((thisShape: Shape) => void),
     * mouseClicked?: ((thisShape: Shape) => void)}} [events] 
     * @param {number} [defaultColor=this.fillColor] 
     * @param {number} [defaultScale=1] 
     * @returns {function} A function that when called, will disconnect all of the event listeners for scaling and specified events from the `events` parameter.
     */
    buttonHoverEffect(maxScale, minScale, scaleTime, easing, lightenFactor, darkenFactor, events={}, defaultColor=this.fillColor, defaultScale=1) {
        /**
         * @type {EventConnection[]}
         */
        const connections = [];
        connections.push(this.addEventListener("mouseEnter", shape => {
            if (maxScale != 1) shape.tweenProperty("scale", maxScale, scaleTime, easing); 
            if (lightenFactor != 1) shape.fillColor = color(defaultColor).levels.slice(0, 3).map((v, i) => i == 3 ? v : v * lightenFactor);
            if (events.mouseEnter) events.mouseEnter(shape);
        }));
        connections.push(this.addEventListener("mouseLeave", shape => {
            if (maxScale != 1 || minScale != 1) shape.tweenProperty("scale", defaultScale, scaleTime, easing); 
            if (lightenFactor != 1 || darkenFactor != 1) shape.fillColor = defaultColor;
            if (events.mouseLeave) events.mouseLeave(shape);
        }));
        connections.push(this.addEventListener("mousePressed", shape => {
            if (minScale != 1) shape.tweenProperty("scale", minScale, scaleTime, easing); 
            if (darkenFactor != 1) shape.fillColor = color(defaultColor).levels.slice(0, 3).map((v, i) => i == 3 ? v : v * darkenFactor);
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
    /**
     * Rotates a point
     * @param {number} x X position of point
     * @param {number} y Y position of point
     * @param {number} cx X position of point to rotate around
     * @param {number} cy Y position of point to rotate around
     * @param {number} rotation Rotation of point (in degrees, clockwise)
     * @returns {number[]} Array containing x and y of new point
     */
    static rotatePoint(x, y, cx, cy, rotation) {
        return [
            (x - cx) * Math.cos(Math.PI * rotation/180) - (y - cy) * Math.sin(Math.PI * rotation/180) + cx,
            (x - cx) * Math.sin(Math.PI * rotation/180) + (y - cy) * Math.cos(Math.PI * rotation/180) + cy,
        ];
    }

    /**
     * Calculates the side of a half-plane a given point is on.
     * @param {*} x x of point to check
     * @param {*} y y of point to check
     * @param {*} x1 x of 1st point of plane
     * @param {*} y1 y of 1st point of plane
     * @param {*} x2 x of 2nd point of plane
     * @param {*} y2 y of 2nd point of plane
     * @returns {boolean} If the point is on the positive side or on the line
     */
    static sign(x, y, x1, y1, x2, y2) {
        return ((x - x2) * (y1 - y2) - (x1 - x2) * (y - y2)) >= 0;
    }
}

class Rect extends Shape {
    /**
     * Corner curve of a rectangle. If the value is a number, that curve value is used for all corners. If it is an array, each value corresponds to a corner in the order: [top-left, top-right, bot-right, bot-left]
     * @type {number | number[]}
    */cornerCurve = 0;
    /**
     * Creates a new rectangle
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {EngineNode} [parent]
     * @param {Rect} [args]
     */
    /**
     * Creates a new rectangle with scalar values for its position and dimension
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} sx
     * @param {number} y
     * @param {number} sy
     * @param {number} w
     * @param {number} sw
     * @param {number} h
     * @param {number} sh
     * @param {EngineNode} [parent]
     * @param {Rect} [args]
     */
    constructor() {
        if (arguments.length <= 7) {
            super(arguments[0], {x : arguments[1], y : arguments[2], w : arguments[3], h : (arguments[4] || arguments[3]), ...(arguments[6] || {})}, arguments[5], "Rect");
            if (arguments[6] && arguments[6].cornerCurve) this.cornerCurve = arguments[6].cornerCurve;
        }
        else {
            super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], w : arguments[5], scalarW : arguments[6], h : arguments[7], scalarH : arguments[8], ...(arguments[10] || {})}, arguments[9], "Rect");
            if (arguments[10] && arguments[10].cornerCurve) this.cornerCurve = arguments[10].cornerCurve;
        }
    }

    draw() {
        push();
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        translate(this.actualX, this.actualY);
        rotate(this.rotation);
        scale(this.scale);
        rectMode(CORNER);
        if (Array.isArray(this.cornerCurve)) {
            rect(-this.anchorX * this.actualW, -this.anchorY * this.actualH, this.actualW, this.actualH, ...this.cornerCurve);
        } else {
            rect(-this.anchorX * this.actualW, -this.anchorY * this.actualH, this.actualW, this.actualH, this.cornerCurve);
        }
        translate(-this.actualX, -this.actualY);
        super.draw();
        pop();
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

class Ellipse extends Shape {
    /**
     * Creates a new ellipse
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {EngineNode} [parent]
     * @param {Ellipse} [args]
     */
    /**
     * Creates a new ellipse with scalar values for its position and dimension
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} sx
     * @param {number} y
     * @param {number} sy
     * @param {number} w
     * @param {number} sw
     * @param {number} h
     * @param {number} sh
     * @param {EngineNode} [parent]
     * @param {Ellipse} [args]
     */
    constructor() {
        if (arguments.length <= 7) super(arguments[0], {x : arguments[1], y : arguments[2], w : arguments[3], h : (arguments[4] || arguments[3]), ...(arguments[6] || {})}, arguments[5], "Ellipse");
        else super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], w : arguments[5], scalarW : arguments[6], h : arguments[7], scalarH : arguments[8], ...(arguments[10] || {})}, arguments[9], "Ellipse");
    }

    draw() {
        push();
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        translate(this.actualX, this.actualY);
        rotate(this.rotation);
        scale(this.scale);
        ellipseMode(CENTER);
        ellipse(this.actualW * 0.5 - this.anchorX * this.actualW, this.actualH * 0.5 - this.anchorY * this.actualH, this.actualW, this.actualH);
        translate(-this.actualX, -this.actualY);
        super.draw();
        pop();
    }

    mouseIsOver() {
        //center coordinates
        let cx = this.actualX + (0.5 - this.anchorX) * this.actualW, cy = this.actualY + (0.5 - this.anchorY) * this.actualH;
        //rotated mouse coordinates
        let [mx, my] = Shape.rotatePoint(mouseX, mouseY, cx, cy, -this.rotation);
        
        return Math.pow(mx - cx, 2) / Math.pow(this.actualW/2 * this.scale, 2) + Math.pow(my - cy, 2) / Math.pow(this.actualH/2 * this.scale, 2) <= 1;
    }
}

class Triangle extends Shape {
    /**
     * For triangles and custom shapes:
     * List of coordinate pairs, which are stored as [{x, scalarX, y, scalarY}]
     * @type {{x : number, scalarX? : number, y : number, scalarY? : number}[]}
     */
    vertices;
    /**
     * @overload
     * @param {string} name
     * @param {number} x General x position of the shape, can be thought of as x translation
     * @param {number} y General y position of the shape, can be thought of as y translation
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     * @param {number} x3 
     * @param {number} y3 
     * @param {EngineNode} [parent] 
     * @param {Triangle} [args] 
     */

    /**
     * @overload
     * @param {string} name
     * @param {number} x General x position of the shape, can be thought of as x translation
     * @param {number} sx General scalar x position of the shape, can be thought of as x translation
     * @param {number} y General y position of the shape, can be thought of as y translation
     * @param {number} sy General scalar y position of the shape, can be thought of as y translation
     * @param {number} x1 
     * @param {number} sx1 
     * @param {number} y1 
     * @param {number} sy1 
     * @param {number} x2 
     * @param {number} sx2 
     * @param {number} y2 
     * @param {number} sy2 
     * @param {number} x3 
     * @param {number} sx3 
     * @param {number} y3 
     * @param {number} sy3 
     * @param {EngineNode} [parent] 
     * @param {Triangle} [args] 
     */
    constructor() {
        if (arguments.length <= 12) {
            super(arguments[0], {
                x : arguments[1], y : arguments[2],
                ...(arguments[10] || {})
            }, arguments[9], "Triangle");
            this.vertices = [
                {x : arguments[3], scalarX : 0, y : arguments[4], scalarY : 0},
                {x : arguments[5], scalarX : 0, y : arguments[6], scalarY : 0},
                {x : arguments[7], scalarX : 0, y : arguments[8], scalarY : 0}
            ];
        }
        else {
            super(arguments[0], {
                x : arguments[1], sx : arguments[2], y : arguments[3], sy : arguments[4],
                ...(arguments[18] || {})
            }, arguments[17], "Triangle");
            this.vertices = [
                {x : arguments[5], scalarX : arguments[6], y : arguments[7], scalarY : arguments[8]},
                {x : arguments[9], scalarX : arguments[10], y : arguments[11], scalarY : arguments[12]},
                {x : arguments[13], scalarX : arguments[14], y : arguments[15], scalarY : arguments[16]}
            ];
        }
    }

    draw() {
        push();
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        translate(this.actualX, this.actualY);
        rotate(this.rotation);
        scale(this.scale);
        triangle(this.vertices[0].x + this.vertices[0].scalarX * this.parent.actualW,
            this.vertices[0].y + this.vertices[0].scalarY * this.parent.actualH,
            this.vertices[1].x + this.vertices[1].scalarX * this.parent.actualW,
            this.vertices[1].y + this.vertices[1].scalarY * this.parent.actualH,
            this.vertices[2].x + this.vertices[2].scalarX * this.parent.actualW,
            this.vertices[2].y + this.vertices[2].scalarY * this.parent.actualH
        );
        translate(-this.actualX, -this.actualY);
        super.draw();
        pop();
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

    /**
     * Tweens one of the shape vertices
     * @param {number} vertice Index of the vertice
     * @param {string} property Property to tween
     * @param {number} target Target amount
     * @param {number} time Time
     * @param {string} [easing] Tween easing (defaults to linear, see TweenManager.EASINGS for the easing styles)
     * @param {(thisShape: this) => any} [callback] Callback for when the tween finishes
     * @returns {Promise} The event for when the tween finishes
     */
    tweenVertice(vertice, property, target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this.vertices[vertice]).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }
}

class CustomPolygon extends Shape {
    /**
     * For triangles and custom shapes:
     * List of coordinate pairs, which are stored as [{x, scalarX, y, scalarY}]
     * @type {{x : number, scalarX? : number, y : number, scalarY? : number}[]}
     */
    vertices;
    /**
     * The type of a custom shape, used with beginShape(). Will not be used with curved custom shapes.
     * @type {null | POINTS | LINES | TRIANGLES | TRIANGLE_FAN | TRIANGLE_STRIP | QUADS | QUAD_STRIP | TESS}
     */
    customPolygonType = null;
    /**
     * Used with endShape(); Defaults to CLOSE
     * @type {CLOSE | null}
     */
    customPolygonEndType = "close";
    /**
     * Creates a custom shape.
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} y  
     * @param {{x : number, scalarX? : number, y : number, scalarY? : number}[]} vertices List of vertices of the shape
     * @param {EngineNode} [parent] 
     * @param {CustomPolygon} [args] 
     */

    /**
     * Creates a custom shape with scalar values for x and y.
     * @overload
     * @param {string} name
     * @param {number} x
     * @param {number} sx 
     * @param {number} y
     * @param {number} sy 
     * @param {{x : number, scalarX? : number, y : number, scalarY? : number}[]} vertices List of vertices of the shape
     * @param {EngineNode} [parent] 
     * @param {CustomPolygon} [args] 
     */
    constructor() {
        if (arguments.length <= 6) {
            super(arguments[0], {x : arguments[1], y : arguments[2], ...(arguments[5] || {})}, arguments[4], (arguments[5] && arguments[5].curvedType) ? "CustomPolygonCurved" : "CustomPolygon");
            this.vertices = arguments[3];
            if (arguments[5]) {
                if (arguments[5].customPolygonType) this.customPolygonType = arguments[5].customPolygonType;
                if (arguments[5].customPolygonEndType) this.customPolygonEndType = arguments[5].customPolygonEndType;
            }
        }
        else {
            super(arguments[0], {x : arguments[1], scalarX : arguments[2], y : arguments[3], scalarY : arguments[4], ...(arguments[7] || {})}, arguments[6], (arguments[7] && arguments[7].curvedType) ? "CustomPolygonCurved" : "CustomPolygon");
            this.vertices = arguments[5];
            if (arguments[7]) {
                if (arguments[7].customPolygonType) this.customPolygonType = arguments[7].customPolygonType;
                if (arguments[7].customPolygonEndType) this.customPolygonEndType = arguments[7].customPolygonEndType;
            }
        }
    }

    draw() {
        push();
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        translate(this.actualX, this.actualY);
        rotate(this.rotation);
        scale(this.scale);
        if (this.customPolygonType) beginShape(this.customPolygonType);
        else beginShape();
        for (let v of this.vertices) {
            vertex(v.x + v.scalarX * this.parent.actualW, v.y + v.scalarY * this.parent.actualW);
        }
        if (this.customPolygonEndType) endShape(CLOSE);
        else endShape();
        translate(-this.actualX, -this.actualY);
        super.draw();
        pop();
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

    /**
     * Tweens one of the shape vertices
     * @param {number} vertice Index of the vertice
     * @param {string} property Property to tween
     * @param {number} target Target amount
     * @param {number} time Time
     * @param {string} [easing] Tween easing (defaults to linear, see TweenManager.EASINGS for the easing styles)
     * @param {(thisShape: this) => any} [callback] Callback for when the tween finishes
     * @returns {Promise} The event for when the tween finishes
     */
    tweenVertice(vertice, property, target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this.vertices[vertice]).addMotion(property, target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }

    static Curved = class Curved extends CustomPolygon {
        /**
         * Creates a custom shape with curved edges.
         * @overload
         * @param {string} name
         * @param {number} x
         * @param {number} y  
         * @param {{x : number, scalarX? : number, y : number, scalarY? : number}[]} vertices List of vertices of the shape
         * @param {EngineNode} [parent] 
         * @param {CustomPolygon} [args] 
         */

        /**
         * Creates a custom shape with curved edges with scalar values for x and y.
         * @overload
         * @param {string} name
         * @param {number} x
         * @param {number} sx 
         * @param {number} y
         * @param {number} sy 
         * @param {{x : number, scalarX? : number, y : number, scalarY? : number}[]} vertices List of vertices of the shape
         * @param {EngineNode} [parent] 
         * @param {CustomPolygon} [args] 
         */
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
            push();
            fill(this.fillColor);
            stroke(this.strokeColor);
            strokeWeight(this.strokeWeight);
            translate(this.actualX, this.actualY);
            rotate(this.rotation);
            scale(this.scale);
            beginShape();
            for (let v of this.vertices) {
                curveVertex(v.x + v.scalarX * this.parent.actualW + this.parent.actualX, v.y + v.scalarY * this.parent.actualW + this.parent.actualY);
            }
            if (this.customPolygonEndType) endShape(CLOSE);
            else endShape();
            translate(-this.actualX, -this.actualY);
            if (this.eventListeners.draw) {
                for (let connection of this.eventListeners.draw) {
                    connection.function(this);
                }
            }
            for (let child of this.getChildren()) {
                if (child instanceof Shape) child.draw();
            }
            pop();
        }
    }
}

class TextLabel extends Shape {
    text = "";
    /** Specifies horizontal text alignment for text shapes. @type {LEFT | CENTER | RIGHT} */textAlignHorizontal = "center";
    /** Specifies vertical text alignment for text shapes. @type {TOP | CENTER | BOTTOM | BASELINE} */textAlignVertical = "center";
    textSize = 18;
    /** Scalar text size based on parent element's height. */textSizeScalar = 0;
    textFont = "Arial";
    /** Specifies style of the text. @type {NORMAL | BOLD | ITALIC | BOLDITALIC} */textStyle = "normal";

    /**
     * Creates a new text object
     * @overload
     * @param {string} name
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} w Width of text box. Use null for none
     * @param {number} h Height of text box. Use null for none. If present, requires width to be present too.
     * @param {EngineNode} [parent]
     * @param {TextLabel} [args]
     */
    /**
     * Creates a new text object with scalar values for its position and dimension
     * @overload
     * @param {string} name
     * @param {string} text
     * @param {number} x
     * @param {number} sx
     * @param {number} y
     * @param {number} sy
     * @param {number} w Width of text box. Use null for none
     * @param {number} sw Width of text box. Use null for none
     * @param {number} h Height of text box. Use null for none. If present, requires width to be present too.
     * @param {number} sh Height of text box. Use null for none. If present, requires width to be present too.
     * @param {EngineNode} [parent]
     * @param {TextLabel} [args]
     */
    constructor() {
        if (arguments.length <= 8) {
            super(arguments[0], {x : arguments[2], y : arguments[3], w : arguments[4], h : arguments[5], ...(arguments[7] || {})}, arguments[6], "Text");
            if (arguments[7]) {
                if (arguments[7].textSize || arguments[7].textSize === 0) this.textSize = arguments[7].textSize;
                if (arguments[7].textSizeScalar) this.textSizeScalar = arguments[7].textSizeScalar;
                if (arguments[7].textAlignHorizontal) this.textAlignHorizontal = arguments[7].textAlignHorizontal;
                if (arguments[7].textAlignVertical) this.textAlignVertical = arguments[7].textAlignVertical;
                if (arguments[7].textFont) this.textFont = arguments[7].textFont;
                if (arguments[7].textStyle) this.textStyle = arguments[7].textStyle;
            }
        }
        else {
            super(arguments[0], {x : arguments[2], scalarX : arguments[3], y : arguments[4], scalarY : arguments[5], w : arguments[6], scalarW : arguments[7], h : arguments[8], scalarH : arguments[9], ...(arguments[11] || {})}, arguments[10], "Text");
            if (arguments[11]) {
                if (arguments[11].textSize || arguments[11].textSize === 0) this.textSize = arguments[11].textSize;
                if (arguments[11].textSizeScalar) this.textSizeScalar = arguments[11].textSizeScalar;
                if (arguments[11].textAlignHorizontal) this.textAlignHorizontal = arguments[11].textAlignHorizontal;
                if (arguments[11].textAlignVertical) this.textAlignVertical = arguments[11].textAlignVertical;
                if (arguments[11].textFont) this.textFont = arguments[11].textFont;
                if (arguments[11].textStyle) this.textStyle = arguments[11].textStyle;
            }
        }
        this.text = arguments[1];
    }

    draw() {
        push();
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        translate(this.actualX, this.actualY);
        rotate(this.rotation);
        scale(this.scale);
        textAlign(this.textAlignHorizontal, this.textAlignVertical);
        textStyle(this.textStyle);
        textSize(this.textSize + this.textSizeScalar * this.parent.actualH);
        textFont(this.textFont);
        rectMode(CORNER);
        if (this.w !== null || this.scalarW !== null) {
            if (this.h !== null || this.scalarH !== null) text(this.text, 0, 0, this.actualW, this.actualH); 
            else text(this.text, 0, 0, this.actualW)
        } else text(this.text, 0, 0);
        super.draw();
        pop();
    }

    /**
     * Gets each individual line of the text, width text wrapping taken into account.
     * @returns {string[]} An array containing each line of text
     */
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
            let testWidth = textWidth(testLine);
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
        push();
        textStyle(this.textStyle);
        textSize(this.textSize + this.textSizeScalar * this.parent.actualH);
        textFont(this.textFont);
        let lines = this.getTextLines();
        let widths = [];
        for (let line of lines) {
            widths.push(textWidth(line));
        }
        pop();
        return Math.max(...widths);
    }

    getTextHeight() {
        push();
        textStyle(this.textStyle);
        textSize(this.textSize + this.textSizeScalar * this.parent.actualH);
        textFont(this.textFont);
        let h = this.getTextLines().length * textLeading();
        pop();
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

class CustomShape extends Shape {
    /**
     * Creates a custom shape.
     * @param {string} name The name of the CustomShape
     * @param {EngineNode} parent The parent of the CustomShape. Defaults to the sketch.
     * @param {(thisShape: this, superDraw: function) => void} draw What the custom shape should draw. Make sure to call the function given by the second parameter at the end of the function.
     * @param {(thisShape: this) => boolean} mouseIsOver Optional function to determine if the mouse is over the shape. If not given, there will be no mouse detection for this shape.
     * @param {Shape} [args] Optional arguments to the shape's properties.
     */
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

/**
 * A class representing the entire sketch
 */
class Sketch extends Shape {
    constructor() {
        super("Sketch", null, null, "Sketch");
        //stuff declared in class body is done before constructing :/ at least thats what i think is happening so we need to do this
        Object.defineProperty(this, "x", {get : () => 0});
        Object.defineProperty(this, "actualX", {get : () => 0});
        Object.defineProperty(this, "y", {get : () => 0});
        Object.defineProperty(this, "actualY", {get : () => 0});
        Object.defineProperty(this, "w", {get : () => width, set : v => {resizeCanvas(v, this.h)}});
        Object.defineProperty(this, "actualW", {get : () => width});
        Object.defineProperty(this, "h", {get : () => height, set : v => {resizeCanvas(this.w, v)}});
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
        background(this.fillColor);
        push();
        angleMode(DEGREES);
        super.draw();
        pop();
    }

    mouseIsOver() {
        if (mouseX >= 0 && mouseX <= this.actualW && mouseY >= 0 && mouseY <= this.actualH) return true;
        return false;
    }
}

var sketch = new Sketch();

class EventConnection {
    /** @type {() => any}*/function;
    /** @type {(thisConnection: this) => any}*/#disconnectFn;
    /**
     * 
     * @param {string} type 
     * @param {function} fn 
     * @param {(thisConnection: EventConnection) => any} disconnect 
     */
    constructor(type, fn, disconnect) {
        this.type = type;
        this.function = fn;
        this.#disconnectFn = disconnect;
    }

    disconnect() {
        this.#disconnectFn(this);
    }
}

class Script extends EngineNode {
    /**
     * Creates a new script
     * @param {string} name 
     * @param {EngineNode} parent 
     * @param {(script : Script) => any} fn 
     * @param {boolean} [disabled=false] 
     */
    constructor(name, parent, fn, disabled=false) {
        super("Script", name, parent);
        this.#function = fn;
        this.disabled = disabled;
    }

    /**
     * Executes the script.
     */
    execute() {
        this.#returnValue = this.#function(this);
    }

    #function;
    /**
     * A function containing the code for the script, passing an argument that is the script itself. Will be executed automatically. The return value is stored in this.returnValue
     * @type {(script : this) => any}
     */
    get function() {return this.#function};
    #returnValue;
    /**
     * The return value from the script
     * @type {any}
     */
    get returnValue() {return this.#returnValue};
}

class Value extends EngineNode {
    constructor(name, parent, value) {
        super("Value", name, parent);
        this.#value = value;
    }

    #value;
    /**The value the Value node contains */
    get value() {return this.#value;};
    set value(val) {
        this.#value = val;
        if (this.eventListeners.valueChanged) this.eventListeners.valueChanged.forEach(connection => connection.function(this));
    }

    /**
     * @type {{valueChanged : EventConnection[]}}
     */
    eventListeners = {
    };
    /**
     * Add an event listener.
     * @param {"valueChanged"} eventType Event to listen for
     * @param {(thisValue: this) => void} fn The function to be run when the event happens
     * @returns {EventConnection} The event connection for the function
     */
    addEventListener(eventType, fn) {
        let connection = new EventConnection(eventType, fn, () => {
            this.eventListeners[eventType].splice(this.eventListeners[eventType].indexOf(connection), 1);
        });
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(connection);
        return connection;
    }

   /**
    * Tweens the Value's stored value
    * @param {number} target Target amount
    * @param {number} time Time
    * @param {string} [easing] Tween easing (defaults to linear, see TweenManager.EASINGS for the easing styles)
    * @param {(thisValue: this) => any} [callback] Callback for when the tween finishes
    * @returns {Promise} The event for when the tween finishes
    */
    tween(target, time, easing, callback) {
        let resolve, promise = new Promise(r => resolve = r);
        TweenManager.addTween(this).addMotion("value", target, time, easing).startTween().onEnd((() => {if (callback) callback(this); resolve();}).bind(this));
        return promise;
    }
}

var p5;
(function(p5){p5['prototype'].registerMethod('pre', () => TweenManager.update(window['deltaTime']));})(p5 || (p5 = {}));
/**
 * Call in your sketch's setup() method
 * @param {SketchObject} [sketchObj] The SketchObject to parse as the engine stuff (optional)
 * @param {EngineOptions} [options] Optional object following interface EngineOptions
 */
function initializeEngine(sketchObj, options) {
    if (sketchObj) {
        //setup the sketch
        sketch.w = (sketchObj.w || 0) + (sketchObj.scalarW || 0) * windowWidth;
        sketch.h = (sketchObj.h || 0) + (sketchObj.scalarH || 0) * windowHeight;
        sketch.fillColor = sketchObj.fillColor;
        //setup the children
        /**
         * @param {NodeObject | ShapeObject | ScriptObject | ValueObject} node 
         * @param {EngineNode | Shape | Script | Value | Folder} obj 
         */
        function recursiveInitialize(node, obj) {
            if (node.children) {
                for (let child of node.children) {
                    let newObj;
                    switch (child.type) {
                        case "Shape":
                            switch (child.shapeType) {
                                case "Rect":
                                    newObj = new  Rect(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
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
                                    newObj = new  Ellipse(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.w, child.scalarW || 0, child.h, child.scalarH || 0, obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale
                                        });
                                    break;
                                case "Triangle":
                                    newObj = new  Triangle(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices[0].x, child.vertices[0].scalarX, child.vertices[0].y, child.vertices[0].scalarY,
                                        child.vertices[1].x, child.vertices[1].scalarX, child.vertices[1].y, child.vertices[1].scalarY,
                                        child.vertices[2].x, child.vertices[2].scalarX, child.vertices[2].y, child.vertices[2].scalarY,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale
                                        });
                                    break;
                                case "CustomPolygon":
                                    newObj = new  CustomPolygon(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale,
                                        customPolygonType : child.customPolygonType,
                                        customPolygonEndType : child.customPolygonEndType
                                        });
                                    break;
                                case "CustomPolygonCurved":
                                    newObj = new  CustomPolygon.Curved(child.name, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        child.vertices,
                                        obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
                                        anchorX : child.anchorX,
                                        anchorY : child.anchorY,
                                        rotation : child.rotation,
                                        scale : child.scale,
                                        customPolygonEndType : child.customPolygonEndType
                                        });
                                    break;
                                case "Text":
                                    newObj = new TextLabel(child.name, child.text, child.x, child.scalarX || 0, child.y, child.scalarY || 0,
                                        (!child.w && child.w !== 0) ? null : child.w, (!child.scalarW && child.scalarW !== 0) ? null : child.scalarW, (!child.h && child.h !== 0) ? null : child.h, (!child.scalarH && child.scalarH !== 0) ? null : child.scalarH, obj, {
                                        visible : child.visible,
                                        active : child.active,
                                        fillColor : child.fillColor,
                                        strokeColor : child.strokeColor,
                                        strokeWeight : child.strokeWeight,
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
                                    newObj = new  CustomShape(child.name, obj, child.draw, child.mouseIsOver, (function(){
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

    //skip all the mouse stuff if options.noMouseDetection
    if (options && options.noMouseDetection) return;
    document.getElementById("defaultCanvas0").addEventListener("mousedown", () => {
        let tentativeObj;
        /** @param {EngineNode} node*/
        function recursiveCheck(node) {
            if (node instanceof Shape) {
                if (node.sceneDisabled) return;
                if (node.active && node.mouseIsOver()) {
                    tentativeObj = node;
                }
            }
            let children = node.getChildren();
            for (let child of children) recursiveCheck(child);
        }
        recursiveCheck(sketch);
        if (tentativeObj) {
            tentativeObj.mousePressedWhileOn = true;
            if (tentativeObj.eventListeners.mousePressed) tentativeObj.eventListeners.mousePressed.forEach(connection => {
                connection.function(tentativeObj);
            });
        }
    });

    document.getElementById("defaultCanvas0").addEventListener("mouseup", () => {
        let tentativeObj;
        let tentativeObjPressedOn;
        /** @param {EngineNode} node*/
        function recursiveCheck(node) {
            if (node instanceof Shape) {
                if (node.sceneDisabled) return;
                if (node.active) {
                    if (node.mouseIsOver()) {
                        tentativeObj = node;
                        tentativeObjPressedOn = node.mousePressedWhileOn;
                    }
                    node.mousePressedWhileOn = false;
                }
            }
            let children = node.getChildren();
            for (let child of children) recursiveCheck(child);
        }
        recursiveCheck(sketch);
        if (tentativeObj) {
            if (tentativeObjPressedOn) {
                if (tentativeObj.eventListeners.mouseClicked) tentativeObj.eventListeners.mouseClicked.forEach(connection => {
                    connection.function(tentativeObj);
                });
            }
            if (tentativeObj.eventListeners.mouseReleased) tentativeObj.eventListeners.mouseReleased.forEach(connection => {
                connection.function(tentativeObj);
            });
        }
    });

    document.getElementById("defaultCanvas0").addEventListener("mousemove", e => {
        /** @param {EngineNode} node*/
        function recursiveCheck(node) {
            if (node instanceof Shape) {
                if (node.sceneDisabled) return;
                if (node.active && (node.eventListeners.mouseEnter || node.eventListeners.mouseLeave || node.eventListeners.mouseDragged)) {
                    let over = node.mouseIsOver();
                    if (node.eventListeners.mouseDragged && node.mousePressedWhileOn) node.eventListeners.mouseDragged.forEach(connection => {
                        connection.function(node, e.movementX, e.movementY);
                    });
                    if (node.eventListeners.mouseEnter && node.mouseOver == false && over) node.eventListeners.mouseEnter.forEach(connection => {
                        connection.function(node);
                        node.mouseOver = true;
                    });
                    else if (node.eventListeners.mouseLeave && node.mouseOver == true && !over) node.eventListeners.mouseLeave.forEach(connection => {
                        connection.function(node);
                        node.mouseOver = false;
                    });
                }
            }
            let children = node.getChildren();
            for (let child of children) recursiveCheck(child);
        }
        recursiveCheck(sketch);
    });
}

class SketchObject {
    w = 100; scalarW = 0; h = 100; scalarH = 0; fillColor = 220;
    /**@type {(NodeObject | ShapeObject | ScriptObject | ValueObject)[]}*/
    children;
}

class NodeObject {
    name = "";
    /**
     * The type of object it is.
     * @type {"Shape" | "Script" | "Value"}
     */
    type;
    /**@type {(NodeObject | ShapeObject | ScriptObject | ValueObject)[]}*/
    children;
}

class ShapeObject extends NodeObject {
    /**
     * @type {"Rect" | "Ellipse" | "Triangle" | "CustomPolygon" | "CustomPolygonCurved" | "Text" | "CustomShape"}
     */
    shapeType;

    x = 0; y = 0; w = 0; h = 0; 
    scalarX = 0; scalarY = 0; scalarW = 0; scalarH = 0; 
    /**
     * For triangles and custom shapes:
     * List of coordinate pairs, which are stored as [{x, scalarX, y, scalarY}]
     * @type {{x : number, scalarX? : number, y : number, scalarY? : number}[]}
     */
    vertices = [];
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned horizontally (e.g. 0 is left side, 0.5 is center, 1 is right side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    */anchorX = 0; 
    /**
     * A number between 0 and 1 that specifies where the shape should be aligned vertically (e.g. 0 is top side, 0.5 is center, 1 is bottom side). Also used as the origin for rotating and scaling except for in triangles and custom shapes.
    */anchorY = 0; 

    text = "";
    /** Specifies horizontal text alignment for text shapes. @type {LEFT | CENTER | RIGHT} */textAlignHorizontal = "center";
    /** Specifies vertical text alignment for text shapes. @type {TOP | CENTER | BOTTOM | BASELINE} */textAlignVertical = "center";
    textSize = 18;
    /** Scalar text size based on parent element's height. */textSizeScalar = 0;
    textFont = "Arial";
    /** Specifies style of the text. @type {NORMAL | BOLD | ITALIC | BOLDITALIC} */textStyle = "normal";
    
    scale = 1; 
    /**
     * Rotation of the shape counter-clockwise in degrees.
     * The point the shape rotates around depends on anchorX and anchorY. For triangles and custom shapes, it depends on actualX and actualY, since they are defined by their vertices instead.
    */rotation = 0;
    fillColor = 128; strokeColor = 0; strokeWeight = 1; 
    visible = true; active = true;

    /**
     * Corner curve of a rectangle. If the value is a number, that curve value is used for all corners. If it is an array, each value corresponds to a corner in the order: [top-left, top-right, bot-right, bot-left]
     * @type {number | number[]}
    */cornerCurve = 0;
    /**
     * The type of a custom shape, used with beginShape(). Will not be used with curved custom shapes.
     * @type {POINTS | LINES | TRIANGLES | TRIANGLE_FAN | TRIANGLE_STRIP | QUADS | QUAD_STRIP | TESS}
     */
    customPolygonType = null;
    /**
     * Used with endShape(); Defaults to CLOSE
     * @type {CLOSE | null}
     */
    customPolygonEndType = "close";

    /**@type {(thisShape: Shape) => void} */
    draw;
    /**@type {(thisShape: Shape) => void} */
    mouseIsOver;
}

class ScriptObject extends NodeObject {
    /**
     * A function containing the code for the script, passing an argument that is the script itself. Will be executed automatically. The return value is stored in this.returnValue
     * @type {(thisScript : Script) => any} 
     */
    function;
    /**
     * If `disabled = true`, then the script will not run.
     * @type {boolean}
     */
    disabled = false;
}

class ValueObject extends NodeObject {
    value;
}

/**
 * Manages scene switching and sets up scenes.
 */
class SceneManager {
    sceneObjects = {};
    sceneEnterEvents = {};
    sceneExitEvents = {};
    currentScene = null;

    /**
     * @param {number|string} id 
     * @param {Shape[] | Shape} objects 
     * @param {(sceneId:number|string) => any} [enterFunction] 
     * @param {(sceneId:number|string) => any} [exitFunction] 
     * @returns {this} Chainable
     */
    registerScene(id, objects, enterFunction, exitFunction) {
        if (!Array.isArray(objects)) objects = [objects];
        this.sceneObjects[id] = objects;
        this.sceneEnterEvents[id] = [];
        this.sceneExitEvents[id] = [];
        if (enterFunction) this.sceneEnterEvents[id].push(new EventConnection("sceneEnter", enterFunction, thisConnection => this.sceneEnterEvents[id].splice(this.sceneEnterEvents.indexOf(thisConnection), 1)));
        if (exitFunction) this.sceneExitEvents[id].push(new EventConnection("sceneExit", exitFunction, thisConnection => this.sceneExitEvents[id].splice(this.sceneExitEvents.indexOf(thisConnection), 1)));
        return this;
    }

    /**
     * @param {"sceneEnter" | "sceneExit"} eventType 
     * @param {string | number} id 
     * @param {(sceneId: number|string) => any} fn 
     * @returns {EventConnection}
     */
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

/**
 * @interface
 */
class EngineOptions {
    /**
     * If set to true, the engine will not check for mouse events, like clicking, moving, etc. Cannot be changed after the engine is initialized.
     * @type {boolean}
     */
    noMouseDetection;
}