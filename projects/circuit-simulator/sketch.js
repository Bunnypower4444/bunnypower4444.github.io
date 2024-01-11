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
