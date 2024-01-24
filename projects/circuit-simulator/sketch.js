/**
 * @todo
 * - Organize code, maybe put some functions into classes (like copyChip() could be Chip.copy())
 * - Fix extra gates changing color
 * - Make it so wires aren't just a straight line, and can click wires for deleting/add a wire by dragging off of one
 * - Add a mode with gate delays based on time, not frames, and have random delay deviations (also make it work with immediate update: only delay on loops)
 * - 15 inputs/outputs
 * - Align inputs/outputs on chips correctly
 * - Change chip width to fit text
 * - Make it so saving/loading a chip also saves/loads the chips it uses (unless the chip already exists)
 * - Do something if saved chips in cookies is too long
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
const NUM_INPUTS_OUTPUTS = 10;

function setup() {
    createCanvas(100, 100);
    mySketchObject.h = (windowWidth + mySketchObject.w) / widthToHeightRatio;
    if (mySketchObject.h > windowHeight) {
        mySketchObject.h = windowHeight;
        mySketchObject.w = (mySketchObject.h * widthToHeightRatio) - windowWidth;
    }
    workspaceChip = new Chip("Workspace", NUM_INPUTS_OUTPUTS, NUM_INPUTS_OUTPUTS, true);
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
                        objs[ind] = i.chip;
                    } else objs.push(i.chip);
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
    new MenuItem(loadMenu, "SelectAll", "Select All", 64, () => {
        let ch = loadMenu.getChildren();
        for (/**@type {MenuItem}*/let item of ch) {
            if (item instanceof MenuSwitch && (item.name == "Workspace" || item.name.slice(0, 4) == "Chip")) {
                item.value = true;
            }
        }
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

    
    customChipData.AND = new BuiltInChipPrototype("AND", ins => [ins[0] && ins[1]], 2, 1);
    new ChipButton(customChipData.AND, colors.AND_CHIP);
    customChipData.NOT = new BuiltInChipPrototype("NOT", ins => [!ins[0]], 1, 1)
    new ChipButton(customChipData.NOT, colors.NOT_CHIP);
}

/**@type {Object<string, ChipData>}*/
let customChipData = {};
/**@type {Chip} */
let workspaceChip;

let immediateUpdate = false;
let paused = false;
let chipId = 0;
/**@type {WireDisplay} */
let draggedWireDisplay;
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
    //process floating pins that haven't been updated with correct value yet
    //input pins also appear as floating, so they are accounted too
    for (let i of ChipPin.floatingPins) {
        if (!i.valueUpToDate) i.update(false);
    }
    
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
        //process cyclic pins
        for (let i of CycleDetector.cyclicPins) {
            i.propogateSignal();
        }

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
            let ch = buildChip(chipToAdd);
            workspaceChip.addSubChip(ch);
            let disp = new ChipDisplay((ch.update(), ch),
                (mouseX - sketch.children.CreateScreen.children.Workspace.actualX)/sketch.children.CreateScreen.children.Workspace.actualW,
                (mouseY - sketch.children.CreateScreen.children.Workspace.actualY)/sketch.children.CreateScreen.children.Workspace.actualH + heightOffset, chipToAddColor);
            heightOffset += disp.scalarH + 0.01;
            ch = undefined;
            disp = undefined;
            CycleDetector.updateCycles(workspaceChip);
        }

        chipToAdd = undefined;
        chipToAddCount = 1;
        chipToAddColor = undefined;
    }
    
    if (draggedWireDisplay && !draggedWireDisplay.wire.end) {
        if (canConnectTo) {
            if (canConnectTo.wire) canConnectTo.wire.delete();
            draggedWireDisplay.wire.end = canConnectTo;
            CycleDetector.updateCycles(workspaceChip);
            canConnectTo.update(draggedWireDisplay.wire.value);
            canConnectTo = undefined;
            draggedWireDisplay = undefined;
        }
        else {
            let nextPoint = [
                (mouseX - sketch.children.CreateScreen.children.Workspace.actualX)/sketch.children.CreateScreen.children.Workspace.actualW,
                (mouseY - sketch.children.CreateScreen.children.Workspace.actualY)/sketch.children.CreateScreen.children.Workspace.actualH];
            if (keyIsDown(SHIFT)) { //snap angle to 45 degree multiples
                let lastPoint = draggedWireDisplay.points[draggedWireDisplay.points.length - 1];
                if (draggedWireDisplay.points.length == 0) {
                    lastPoint = [
                        draggedWireDisplay.wire.start.getConnectionX(),
                        draggedWireDisplay.wire.start.getConnectionY()
                    ];
                } else lastPoint = [
                    lastPoint[0] * sketch.children.CreateScreen.children.Workspace.actualW + sketch.children.CreateScreen.children.Workspace.actualX,
                    lastPoint[1] * sketch.children.CreateScreen.children.Workspace.actualH + sketch.children.CreateScreen.children.Workspace.actualY
                ];
                let angle = Math.atan2(mouseY - lastPoint[1], mouseX - lastPoint[0]) * (180/Math.PI);
                let targetAngle = Math.round(angle/45) * 45;
                let targetPoint = Shape.rotatePoint(mouseX, mouseY, ...lastPoint, targetAngle - angle);

                targetPoint[0] = (targetPoint[0] - sketch.children.CreateScreen.children.Workspace.actualX)/sketch.children.CreateScreen.children.Workspace.actualW;
                targetPoint[1] = (targetPoint[1] - sketch.children.CreateScreen.children.Workspace.actualY)/sketch.children.CreateScreen.children.Workspace.actualH;
                draggedWireDisplay.points.push(targetPoint);
            }
            else {
                draggedWireDisplay.points.push(nextPoint);
            }
        }
    }
}

/**
 * 
 * @param {KeyboardEvent} e 
 */
function keyReleased(e) {
    if (e.code == "Backspace" && selectedChipDisplay) {
        selectedChipDisplay.chip.delete();
        workspaceChip.removeSubChip(selectedChipDisplay.chip);
        selectedChipDisplay.parent = null;
        selectedChipDisplay = undefined;
        CycleDetector.updateCycles(workspaceChip);
    }
    if (e.code == "KeyD" && selectedChipDisplay) { 
        selectedChipDisplay.strokeWeight = 0;
        selectedChipDisplay = undefined;
    }
    if (e.code == "Backspace" && draggedWireDisplay) { 
        draggedWireDisplay.wire.delete();
        draggedWireDisplay = undefined;
    }
}

function createChip() {
    let numInputs = 0;
    let numOutputs = 0;
    /**@type {Input[]}*/let usedInputs = [];
    /**@type {Output[]}*/let usedOutputs = [];
    for (let input of sketch.getChild("CreateScreen").getChild("InputBar").getChildren()) {
        if (input instanceof Input) {
            if (input.inUse && input.chipPin.wires.length) {
                numInputs++;
                usedInputs.push(input);
            }
        }
    }
    for (let output of sketch.getChild("CreateScreen").getChild("OutputBar").getChildren()) {
        if (output instanceof Output) {
            if (output.inUse && output.chipPin.wire) {
                numOutputs++;
                usedOutputs.push(output);
            }
        }
    }
    if (numInputs + numOutputs == 0) return alert("Please add at least one input or output before creating a chip.");

    //delete all the unused chips (outputs do not have connected wires)
    let chip = saveChip();
    chip.name = prompt("Name your chip:");
    let color = sketch.getChild("CreateScreen").getChild("Workspace").getChildren().
        filter(v => v instanceof ChipDisplay).map(v => v.fillColor).reduce((pValue, cValue, _, arr) => 
        [pValue[0] + cValue[0] / arr.length, pValue[1] + cValue[1] / arr.length, pValue[2] + cValue[2] / arr.length], [0, 0, 0]).map(v => Math.min(v, 255));
    chip.color = color;
    for (let i = 0; i < usedInputs.length; i++) {
        usedInputs[i].eventListeners.mouseClicked[0].function(usedInputs[i]);   //toggle off the inputs
    }
    for (let i = 0; i < usedOutputs.length; i++) {
        usedOutputs[i].eventListeners.mouseClicked[0].function(usedOutputs[i]); //toggle off the outputs
    }
    
    new ChipButton(chip,
        color);
    customChipData[chip.name] = chip;

    //get rid of all things in workspace
    let children = sketch.getChild("CreateScreen").getChild("Workspace").getChildren();
    children.forEach(v => {
        v.parent = null;
        if (v.chip && v.chip.requestInputConnectionX) v.chip.requestInputConnectionX = undefined;
        if (v.chip && v.chip.requestInputConnectionY) v.chip.requestInputConnectionY = undefined;
        if (v.chip && v.chip.requestOutputConnectionX) v.chip.requestOutputConnectionX = undefined;
        if (v.chip && v.chip.requestOutputConnectionY) v.chip.requestOutputConnectionY = undefined;
    });

    CycleDetector.cyclicPins = [];
    ChipPin.floatingPins = [];
    WireDisplay.wireCount = 0;    
    chipId = 0;
}

/**
 * @param {Chip} chip 
 * @returns {Chip} Copied chip
 */
function copyChip(chip) {
    if (chip instanceof BuiltInChipPrototype) {
        return new BuiltInChip(chip.name, chip.fn, chip.numInputs, chip.numOutputs);
    }
    let newChip = new Chip(chip.name, chip.numInputs, chip.numOutputs);
    //record chips with their id as key
    let chips = {};
    /**
     * 
     * @param {Wire} wire 
     * @param {ChipPin} start 
     */
    function recursiveCopy(wire, start) {
        let newWire = new Wire(start);
        if (wire.end instanceof ChipPin && !wire.end.isInputPin) {
            newWire.end = newChip.outputs[wire.end.index];
        }
        else if (wire.end instanceof ChipPin && wire.end.isInputPin) {
            if (chips[wire.end.parentChip.id]) {
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                return;
            }
            if (wire.end.parentChip instanceof BuiltInChip) {
                chips[wire.end.parentChip.id] = new BuiltInChip(wire.end.parentChip.name, wire.end.parentChip.fn, wire.end.parentChip.numInputs, wire.end.parentChip.numOutputs);
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                newChip.addSubChip(chips[wire.end.parentChip.id]);
                chips[wire.end.parentChip.id].outputs.forEach(/**@param {ChipPin & {isInputPin : false}} output*/(output, i) => {
                    wire.end.parentChip.outputs[i].wires.forEach(w => {
                        recursiveCopy(w, output);
                    });
                });
            } else {
                chips[wire.end.parentChip.id] = copyChip(wire.end.parentChip);
                newWire.end = chips[wire.end.parentChip.id].inputs[wire.end.index];
                newChip.addSubChip(chips[wire.end.parentChip.id]);
                chips[wire.end.parentChip.id].outputs.forEach(/**@param {ChipPin & {isInputPin : false}} output*/(output, i) => {
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
                    wires : getWiresDestinations(i.chipPin.wires)
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
        obj.color = customChipData[chip.name].color;
        /**
         * @param {ChipPin} start 
         */
        function recursiveSave(start, outputArr) {
            if (outputArr) outputArr.push(getWiresDestinations(start.wires));
            for (let i of start.wires) {
                if (!i.end) continue;
                if (i.end instanceof ChipPin && i.end.isInputPin) {
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
        else if (i.end instanceof ChipPin && !i.end.isInputPin) {
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
        workspaceChip = new Chip("Workspace", NUM_INPUTS_OUTPUTS, NUM_INPUTS_OUTPUTS, true);
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
            if (i instanceof Input) i.chipPin = workspaceChip.inputs[i.chipPin.index];
        }
        data.inputs.forEach(v => {
            sketch.children.CreateScreen.children.InputBar.children["Input" + v.id].eventListeners.mouseClicked[0].function(sketch.children.CreateScreen.children.InputBar.children["Input" + v.id]);
        });
        for (let i of sketch.children.CreateScreen.children.OutputBar.getChildren()) {
            if (i instanceof Output && i.inUse) i.eventListeners.mouseClicked[0].function(i);
            if (i instanceof Output) i.chipPin = workspaceChip.outputs[i.chipPin.index];
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
                    newWire.end = workspaceChip.outputs[wire];
                } else if (Array.isArray(wire)) {
                    if (processedChips[wire[0]]) {
                        newWire.end = processedChips[wire[0]].inputs[wire[1]];
                        continue;
                    }
                    let chipData = data.chips.find(v => v.id == wire[0]);
                    let newChip = buildChip(customChipData[chipData.name]);
                    workspaceChip.addSubChip(newChip);
                    newWire.end = newChip.inputs[wire[1]];
                    processedChips[wire[0]] = newChip;
                    for (let out = 0; out < chipData.outputs.length; out++) {
                        recursiveLoad(chipData.outputs[out], newChip.outputs[out]);
                    }
                    new ChipDisplay(newChip, chipData.x, chipData.y, customChipData[chipData.name].color);
                }
            }
        }
        for (let i of data.inputs) {
            recursiveLoad(i.wires, workspaceChip.inputs[i.id])
        }
    } else {
        new ChipButton(data, data.color);
        customChipData[data.name] = data;
    }
}

/**
 * @param {ChipData} data 
 * @returns {Chip}
 */
function buildChip(data) {
    if (data instanceof BuiltInChipPrototype) {
        return copyChip(data);
    }
    let loadedChip = new Chip(data.name, data.inputs.length, data.outputs.length);
    /**@type {Object<number, Chip>} */
    let processedChips = {};

    /**@type {number[]} */
    let remappedOutputs = [];
    for (let i = 0; i < data.outputs.length; i++) {
        remappedOutputs[data.outputs[i]] = i;
    }

    /**@param {WireData}wires*/
    function recursiveLoad(wires, start) {
        for (let wire of wires) {
            let newWire = new Wire(start);
            if (typeof wire == "number") {
                newWire.end = loadedChip.outputs[remappedOutputs[wire]];
            } else if (Array.isArray(wire)) {
                if (processedChips[wire[0]]) {
                    newWire.end = processedChips[wire[0]].inputs[wire[1]];
                    continue;
                }
                let chipData = data.chips.find(v => v.id == wire[0]);
                let newChip = buildChip(customChipData[chipData.name]);
                loadedChip.addSubChip(newChip);
                newWire.end = newChip.inputs[wire[1]];
                processedChips[wire[0]] = newChip;
                for (let out = 0; out < chipData.outputs.length; out++) {
                    recursiveLoad(chipData.outputs[out], newChip.outputs[out]);
                }
            }
        }
    }
    for (let i = 0; i < data.inputs.length; i++) {
        recursiveLoad(data.inputs[i].wires, loadedChip.inputs[i]);
    }

    //load the chips without input wires
    for (let chip of data.chips) {
        if (!processedChips[chip.id]) {
            let newChip = buildChip(customChipData[chip.name]);
            loadedChip.addSubChip(newChip);
            processedChips[chip.id] = newChip;
            for (let out = 0; out < chip.outputs.length; out++) {
                recursiveLoad(chip.outputs[out], newChip.outputs[out]);
            }
        }
    }
    CycleDetector.updateCycles(loadedChip);
    return loadedChip;
}

/**
 * Code for CycleDetector adapted from Sebastian Lague's Digital Logic Simulator
 */
class CycleDetector {
    /**@type {ChipPin[]} */
    static cyclicPins = [];

    /**
     * @param {Chip} chip
     * @param {ChipPin[]} cyclicPinList 
     */
    static updateCycles(chip, cyclicPinList) {
        this.cyclicPins = [];
        if (!cyclicPinList) cyclicPinList = [];

        /**@type {Object<number, Wire[]>} */
        let connectionsOutByChipID = {};

        let subChips = chip.subChips;
        for (let subChip of subChips) {
            let subChipID = subChip.id;

            // Group connections by the subchip that they're being output from (to make cycle detection easier).
            /**@type {Wire[]} */
            let connectionsOut = [];

            subChip.outputs.forEach(pin => {
                // Only interested in connections between the subchips of the current chip (i.e. no connections involving chip's own input/output pins)
                connectionsOut.push(...(pin.wires.filter(v => !v.end.isWorkspaceOutputPin && subChips.includes(v.end.parentChip))));
                // Reset cycle flags in case they've been set previously.
                pin.isCyclic = false;
            });
            // Reset cycle flags in case they've been set previously.
            subChip.inputs.forEach(pin => {pin.isCyclic = false;});

            connectionsOutByChipID[subChipID] = connectionsOut;            
        }  

        for (let subChip of subChips) {
            /**@type {number[]} Keeps track of the IDs of the chips on the path*/
            let chipsOnPath = [];
            let id = subChip.id;
            if (!(subChip instanceof BuiltInChip)) CycleDetector.updateCycles(subChip, cyclicPinList);
            this.markChipInputCycles(id, id, connectionsOutByChipID, chipsOnPath, cyclicPinList);
        }
        this.cyclicPins = cyclicPinList;
    }

    /**
     * Given an initialSubChipIndex, this function recursively loops at all paths, and if any of them loop back around to the initial chip, marks
     * the input pin to the chip as cycle.
     * Note: if a cyclic pin is encountered then the current path is abandoned so that only one pin will be marked as cyclic in any given loop
     * @param {number} initialSubChipID 
     * @param {number} subChipID 
     * @param {Object<number, Wire[]>} connectionsOutByChipID 
     * @param {number[]} chipsOnPath 
     * @param {ChipPin[]} cyclicPinList 
     */
    static markChipInputCycles(initialSubChipID, subChipID, connectionsOutByChipID, chipsOnPath, cyclicPinList) {
        // If this chip has already been seen on this path, then we're in a cycle, but not one that comes back to the original chip.
        // So, just break out of it.
        if (chipsOnPath.includes(subChipID)) return;

        chipsOnPath.push(subChipID);

        let connectionsOut = connectionsOutByChipID[subChipID];
        for (let outputWire of connectionsOut)
        {
            if (!outputWire.end.isCyclic)
            {
                // We've looped back around to the original chip, so mark input pin as cyclical.
                if (outputWire.end.parentChip.id == initialSubChipID)
                {
                    outputWire.end.isCyclic = true;
                    cyclicPinList.push(outputWire.end);
                }
                else
                {
                    this.markChipInputCycles(initialSubChipID, outputWire.end.parentChip.id, connectionsOutByChipID, chipsOnPath, cyclicPinList);
                }
            }
        }
    }
}

class Input extends Rect {
    /**@type {Input[]} */
    static allInputsInUse = [];
    /**@type {Input[]} */
    static allInputs = [];

    constructor(position) {
        super("Input" + position, 0, 0, 5, 0.1 * position, 0, 1, -10, 0.1, sketch.getChild("CreateScreen").getChild("InputBar"), {fillColor : 64, strokeWeight : 0});
        Input.allInputs.push(this);
        this.inUse = false;
        /**@type {ChipPin} */
        this.chipPin = workspaceChip.inputs[position];
        this.buttonHoverEffect(1, 1, 0, "linear", 2, 0.75, {
            mouseClicked : thisShape => {
                this.inUse = !this.inUse;
                if (!this.inUse) {
                    let list = [...this.chipPin.wires];
                    list.forEach(w => w.delete()); 
                    Input.allInputsInUse.splice(Input.allInputsInUse.indexOf(this.chipPin), 1);
                    this.chipPin.valueUpToDate = false;
                } else Input.allInputsInUse.push(this.chipPin);
                thisShape.children.Ellipse.visible = this.inUse;
                thisShape.children.Ellipse.active = this.inUse;
                thisShape.value = false;
                thisShape.children.Ellipse.fillColor = colors.DARK_NODE;
            }
        })
        let e = new Ellipse("Ellipse", 0, 1, 0, 0.5, 0, 0, 0, 0.5, this, {anchorX : 0.5, anchorY : 0.5, fillColor : colors.DARK_NODE, active : false, visible : false, strokeWeight : 0});
        e.w = e.actualH;
        e.addEventListener("mouseClicked", thisShape => {
            thisShape.parent.chipPin.update(!thisShape.parent.chipPin.value);
            if (thisShape.parent.chipPin.value) {
                thisShape.fillColor = colors.BRIGHT_NODE;
            } else {
                thisShape.fillColor = colors.DARK_NODE;
            }
        });
        e.addEventListener("mouseDragged", thisShape => {
            if (!draggedWireDisplay && dist(thisShape.actualX, thisShape.actualY, mouseX, mouseY) > thisShape.actualH / 2) {
                draggedWireDisplay = new WireDisplay(new Wire(thisShape.parent.chipPin));
            }
        });
    }

    static getConnectionX(index) {
        let input = this.allInputs[index];
        return input.children.Ellipse.actualX + input.children.Ellipse.actualW / 2;
    }
    static getConnectionY(index) {
        let input = this.allInputs[index];
        return input.children.Ellipse.actualY;
    }
}

class Output extends Rect {
    /**@type {Output[]} */
    static allOutputs = [];
    constructor(position) {
        super("Output" + position, 0, 0, 5, 0.1 * position, 0, 1, -10, 0.1, sketch.getChild("CreateScreen").getChild("OutputBar"), {fillColor : 64, strokeWeight : 0});
        Output.allOutputs.push(this);
        this.inUse = false;
        /**@type {ChipPin} */
        this.chipPin = workspaceChip.outputs[position];
        this.buttonHoverEffect(1, 1, 0, "linear", 2, 0.75, {
            mouseClicked : thisShape => {
                this.inUse = !this.inUse;
                if (!this.inUse && this.chipPin.wire) this.chipPin.wire.delete();
                thisShape.children.Ellipse.visible = this.inUse;
                thisShape.children.Ellipse.active = this.inUse;
                this.chipPin.value = false;
                thisShape.children.Ellipse.fillColor = colors.DARK_NODE;
            }
        })
        let e = new Ellipse("Ellipse", 0, 0, 0, 0.5, 0, 0, 0, 0.5, this, {anchorX : 0.5, anchorY : 0.5, fillColor : colors.DARK_NODE, active : false, visible : false, strokeWeight : 0});
        e.w = e.actualH;
        e.addEventListener("mouseEnter", thisShape => {
            if (draggedWireDisplay) {
                canConnectTo = thisShape.parent.chipPin;
            }
        });
        e.addEventListener("mouseLeave", thisShape => {
            if (draggedWireDisplay && canConnectTo == thisShape.parent.chipPin) {
                canConnectTo = undefined;
            }
        });
        e.addEventListener("mouseClicked", thisShape => {
            if (thisShape.parent.chipPin.wire) thisShape.parent.chipPin.wire.delete();
        });
    }

    static getConnectionX(index) {
        let output = this.allOutputs[index];
        return output.children.Ellipse.actualX + output.children.Ellipse.actualW / 2;
    }
    static getConnectionY(index) {
        let output = this.allOutputs[index];
        return output.children.Ellipse.actualY;
    }

    static updateColor(index) {
        let output = this.allOutputs[index];
        if (output.chipPin.value) {
            output.children.Ellipse.fillColor = colors.BRIGHT_NODE;
        } else {
            output.children.Ellipse.fillColor = colors.DARK_NODE;
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
            strokeWeight(0.003 * this.parent.actualW);
            for (let i = -1; i < this.points.length; i++) {
                let thisPoint = i == -1 ? [this.wire.start.getConnectionX(), this.wire.start.getConnectionY()] : [...this.points[i]];
                let nextPoint = i + 1 == this.points.length ? (this.wire.end ? [this.wire.end.getConnectionX(), this.wire.end.getConnectionY()] : [mouseX, mouseY]) : [...this.points[i + 1]];

                if (i != -1) {
                    thisPoint[0] = thisPoint[0] * this.parent.actualW + this.parent.actualX;
                    thisPoint[1] = thisPoint[1] * this.parent.actualH + this.parent.actualY;
                }
                if (i + 1 != this.points.length) {
                    nextPoint[0] = nextPoint[0] * this.parent.actualW + this.parent.actualX;
                    nextPoint[1] = nextPoint[1] * this.parent.actualH + this.parent.actualY;
                }
                else if (keyIsDown(SHIFT) && !this.wire.end) {    //snap to multiples of 45 degree angles
                    let angle = Math.atan2(nextPoint[1] - thisPoint[1], nextPoint[0] - thisPoint[0]) * (180/Math.PI);
                    let targetAngle = Math.round(angle/45) * 45;
                    nextPoint = Shape.rotatePoint(...nextPoint, ...thisPoint, targetAngle - angle);
                }
                line(...thisPoint, ...nextPoint);
                if (i + 1 < this.points.length) {
                    push();
                    strokeWeight(0.008 * this.parent.actualW);
                    point(...nextPoint);
                    pop();
                }
            }
            superDraw();
            pop();
        });
        this.active = false;
        /**@type {Wire} */
        this.wire = wire;
        /**@type {number[][]} */
        this.points = [];
    }
}

class Wire {
    constructor(start, end) {
        this.start = start;
        this.start.wires.push(this);
        this.end = end;
        this.value = false;
        this.deleted = false;
        this.update(this.start.value);
    }

    /**@type {ChipPin} */
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
        this.propogateSignal();
    }

    propogateSignal() {
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

class ChipPin {
    /**@type {ChipPin[]}*/
    static floatingPins = [];
    /**
     * 
     * @param {Chip} parentChip 
     * @param {number} index 
     * @param {boolean} [isInputPin=false]
     * @param {boolean} [isWorkspaceInputPin=false] 
     * @param {boolean} [isWorkspaceOutputPin=false] 
     */
    constructor(parentChip, index, isInputPin = false, isWorkspaceInputPin = false, isWorkspaceOutputPin = false) {
        this.value = false;
        this.parentChip = parentChip;
        /**@type {boolean} */
        this.isBuiltInChipInput = parentChip instanceof BuiltInChip && isInputPin;
        /**@type {boolean} */
        this.isBuiltInChipOutput = parentChip instanceof BuiltInChip && !isInputPin;
        this.isWorkspaceInputPin = isWorkspaceInputPin;
        this.isWorkspaceOutputPin = isWorkspaceOutputPin;
        this.isInputPin = isInputPin;
        this.valueUpToDate = false;
        this.isFloating = false;
        //outputs of built-in chips should not be counted as a floating pin
        if (!this.isBuiltInChipOutput) {
            this.isFloating = true;
            ChipPin.floatingPins.push(this);
        }
        this.index = index;
        /**@type {Wire[]}*/this.wires = [];
        this.isCyclic = false;
    }
    /**@type {Wire} */
    #wire = null;
    get wire() {return this.#wire}
    set wire(w) {
        this.#wire = w;
        //if its an output of a built-in chip, stop because it can't be floating
        if (this.isBuiltInChipOutput) return;

        if (this.isFloating && w) {
            this.isFloating = false;
            ChipPin.floatingPins.splice(ChipPin.floatingPins.indexOf(this), 1);
        }
        else if (!this.isFloating && !w) {
            this.isFloating = true;
            ChipPin.floatingPins.push(this);

        }
    }

    update(val) {
        if (this.value == val && this.valueUpToDate) {
            return;
        }
        
        this.valueUpToDate = true;
        this.value = val;
        if (this.isWorkspaceOutputPin) {
            Output.updateColor(this.index);
        }
        if (!this.isCyclic) this.propogateSignal();
    }

    propogateSignal() {
        if (this.isBuiltInChipInput) {
            this.parentChip.update(this.index);
        } else {
            this.wires.forEach(v => {
                addUpdate(() => v.update(this.value));
            });
        }
    }

    getConnectionX() {
        if (this.isWorkspaceOutputPin) return Output.getConnectionX(this.index);
        if (this.isWorkspaceInputPin) return Input.getConnectionX(this.index);
        if (this.isInputPin) return this.parentChip.requestInputConnectionX(this.index);
        else return this.parentChip.requestOutputConnectionX(this.index);
    }
    getConnectionY() {
        if (this.isWorkspaceOutputPin) return Output.getConnectionY(this.index);
        if (this.isWorkspaceInputPin) return Input.getConnectionY(this.index);
        if (this.isInputPin) return this.parentChip.requestInputConnectionY(this.index);
        else return this.parentChip.requestOutputConnectionY(this.index);
    }
}

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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
    /**
     * @param {Chip} chip 
     * @param {number} sx 
     * @param {number} sy 
     * @param {number[]} color 
     */
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
                if (draggedWireDisplay) {
                    canConnectTo = i;
                }
            });
            e.addEventListener("mouseLeave", thisShape => {
                if (draggedWireDisplay && canConnectTo == i) {
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
                if (!draggedWireDisplay && dist(thisShape.actualX, thisShape.actualY, mouseX, mouseY) > thisShape.actualH / 2) {
                    draggedWireDisplay = new WireDisplay(new Wire(thisShape.parent.chip.outputs[Number(thisShape.name.slice(6))]));
                }
            });
        }
    }
}

class Chip {
    constructor(name, numInputs, numOutputs, isWorkspace=false) {
        this.name = name;
        this.id = chipId;
        chipId++;
        this.numInputs = numInputs;
        /**@type {(ChipPin & {isInputPin: true})[]}*/
        this.inputs = [];
        this.isWorkspace = isWorkspace
        for (let i = 0; i < numInputs; i++) {
            this.inputs.push(new ChipPin(this, i, true, isWorkspace, false));
        }
        this.numOutputs = numOutputs;
        /**@type {(ChipPin & {isInputPin: false})[]}*/
        this.outputs = [];
        for (let i = 0; i < numOutputs; i++) {
            this.outputs.push(new ChipPin(this, i, false, false, isWorkspace));
        }
        this.deleted = false;
    }

    /**@type {Chip[]} */
    subChips;

    /**
     * @param {Chip} chip 
     */
    addSubChip(chip) {
        if (!this.subChips) this.subChips = [];
        this.subChips.push(chip);
    }

    /**
     * @param {Chip} chip 
     */
    removeSubChip(chip) {
        let index = this.subChips.indexOf(chip);
        if (index > -1) this.subChips.splice(index, 1);
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
            if (ChipPin.floatingPins.includes(i)) ChipPin.floatingPins.splice(ChipPin.floatingPins.indexOf(i), 1);
            if (i.isCyclic) CycleDetector.cyclicPins.splice(CycleDetector.cyclicPins.indexOf(i), 1);
        }
        for (let i of this.inputs) {
            if (i.wire) i.wire.delete();
            if (ChipPin.floatingPins.includes(i)) ChipPin.floatingPins.splice(ChipPin.floatingPins.indexOf(i), 1);
            if (i.isCyclic) CycleDetector.cyclicPins.splice(CycleDetector.cyclicPins.indexOf(i), 1);
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

class BuiltInChipPrototype {
    constructor(name, fn, numInputs, numOutputs) {
        this.name = name;
        this.fn = fn;
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;
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
        });
        this.#value = value;
        this.onToggle = onToggle;
        this.canToggle = active;
        this.addEventListener("draw", thisShape => {
            push();
            fill(this.canToggle ? (this.#value ? [0, 128, 0] : 196) : (this.#value ? [0, 255, 0] : 96));
            rectMode(CENTER);
            noStroke();
            rect(this.actualX + this.actualW * 3/4, this.actualY + this.actualH/2, this.actualW/6, this.actualH * 0.6, Number.MAX_SAFE_INTEGER);
            fill(220);
            ellipse(this.actualX + this.actualW * 2/3 + this.#value * this.actualW/6, this.actualY + this.actualH/2, this.actualH * 0.8);
            pop();
        });
    }

    #value = false;
    get value() {return this.#value;}
    set value(val) {
        if (val != this.#value && this.onToggle) this.onToggle(val);
        this.#value = val;
    }
}
