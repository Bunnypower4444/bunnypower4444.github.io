const vscode = require('vscode');

/**@type {"Rectangle" | "Ellipse" | "Triangle" | "Custom Polygon" | "Curved Custom Polygon" | "Text" | "Custom Shape"}*/
let lastShapeType = "Rectangle";
let setup = false;
/**@type {EngineExplorerProvider}*/
let treeDataProvider;
/**@type {EngineExplorerDragAndDropController}*/
let treeDragAndDropController;
/**@type {vscode.TreeView<EngineExplorerItem>} */
let treeView;
let isDirty = false;
/**@type {vscode.StatusBarItem}*/
let saveButton;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    //test hello world command
	context.subscriptions.push(vscode.commands.registerCommand('p5-engine.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	}));

    const addShapeCommandId = 'p5-engine.addShape';
    //adds a shape object to the engine hierarchy
	context.subscriptions.push(vscode.commands.registerCommand(addShapeCommandId, () => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        let editor = vscode.window.activeTextEditor;
        if (!editor) return;
        editor.edit(editBuilder => {
            let selection = editor.selection;
            if (!selection) {
                vscode.window.showErrorMessage("Please select where you want to add the shape.");
            }
            let shapeType = lastShapeType;
            switch (lastShapeType) {
                case 'Rectangle':
                    shapeType = "Rect";
                    break;
                case 'Custom Polygon':
                    shapeType = "CustomPolygon";
                    break;
                case 'Curved Custom Polygon':
                    shapeType = "CustomPolygonCurved";
                    break;
                case 'Custom Shape':
                    shapeType = "CustomShape";
                    break;
            }
            editBuilder.replace(selection, defaultShapeObjects[shapeType]);

            vscode.window.showInformationMessage(`${lastShapeType} added at line ${selection.active.line + 1}`);
        });
	}));

    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.addShapeFromList", () => {
        vscode.window.showQuickPick(["Rectangle", "Ellipse", "Triangle", "Custom Polygon", "Curved Custom Polygon", "Text", "Custom Shape"], {canPickMany : false, placeHolder : "Select a shape to add"}, undefined).then(selection => {
            if (!selection) return;
            lastShapeType = selection;
            vscode.commands.executeCommand("p5-engine.addShape");
            //addShapeButton.text = "Add " + lastShapeType;
        });
    }));

    /*const addShapeOptions = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    addShapeOptions.text = "$(chevron-up)";
    addShapeOptions.command = "p5-engine.addShapeFromList";
    addShapeOptions.tooltip = "Shape options";
    addShapeOptions.show();
    context.subscriptions.push(addShapeOptions);
    
	const addShapeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1001);
    addShapeButton.text = "Add " + lastShapeType;
	addShapeButton.command = addShapeCommandId;
    addShapeButton.tooltip = "Adds a p5.engine Shape node to your SketchObject at the position of the cursor";
    addShapeButton.show();
	context.subscriptions.push(addShapeButton);*/
    
    //status bar stuff
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.setupEditor", skipConfirmation => {
        if (!vscode.window.activeTextEditor) {
            vscode.window.showErrorMessage("Please open a file first.");
            return;
        }
        if (skipConfirmation) {
            let text = vscode.window.activeTextEditor.document.getText();
            text = text.trim();
            text = text.match(/(let |var |const )? *[a-zA-Z\$_][a-zA-Z\$0-9_]* *= *({(.|\n)*}) *;?/);
            if (!text) {
            //if (text[0] != "{" || text[text.length - 1] != "}") {
                vscode.window.showErrorMessage("Please use a valid object/file.");
                return;
            }
            text = text[2];

            let obj;
            try {
                eval("obj = " + text);
                treeDataProvider = new EngineExplorerProvider(obj);
                treeDragAndDropController = new EngineExplorerDragAndDropController(obj);
                vscode.window.createTreeView("p5-engine.treeView", {showCollapseAll : true, treeDataProvider : treeDataProvider, dragAndDropController : treeDragAndDropController, canSelectMany : true});
            } catch (err) {
                vscode.window.showErrorMessage("There was an error parsing the object. Make sure it is a valid p5.engine object.");
                console.log(err);
                return;
            }
            setup = true;
            return;
        }
        vscode.window.showQuickPick([{label : "Go", description : "Make sure that it is a valid object and follow guidelines; highlighting abritrary code may cause problems. It is recommended that you save your files first."}, {label : "Create new object", description : "Creates a new p5.engine object. Use a file that will only contain the object."}, {label : "Cancel"}], {canPickMany : false, placeHolder : "Please confirm your selection.", ignoreFocusOut : true}, undefined).then(selection => {
            if (!selection || selection.label == "Cancel") return;
            if (selection.label == "Create new object") {
                let obj;
                eval("obj = " + defaultSketchObject);
                vscode.window.activeTextEditor.edit(editBuilder => {
                    editBuilder.insert(vscode.window.activeTextEditor.document.validateRange(new vscode.Range(Number.MAX_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER, 0)).start, "\n/**\n * @type {SketchObject}\n */\nconst mySketchObject = " + defaultSketchObject);
                });
                treeDataProvider = new EngineExplorerProvider(obj);
                treeDragAndDropController = new EngineExplorerDragAndDropController(obj);
                vscode.window.createTreeView("p5-engine.treeView", {showCollapseAll : true, treeDataProvider : treeDataProvider, dragAndDropController : treeDragAndDropController, canSelectMany : true});
                setup = true;
                return;
            }

            let text = vscode.window.activeTextEditor.document.getText();
            text = text.trim();
            text = text.match(/(let |var |const )? *[a-zA-Z\$_][a-zA-Z\$0-9_]* *= *({(.|\n)*}) *;?/);
            if (!text) {
            //if (text[0] != "{" || text[text.length - 1] != "}") {
                vscode.window.showErrorMessage("Please use a valid object/file.");
                return;
            }
            text = text[2];

            let obj;
            try {
                eval("obj = " + text);
                treeDataProvider = new EngineExplorerProvider(obj);
                treeDragAndDropController = new EngineExplorerDragAndDropController(obj);
                treeView = vscode.window.createTreeView("p5-engine.treeView", {showCollapseAll : true, treeDataProvider : treeDataProvider, dragAndDropController : treeDragAndDropController, canSelectMany : true});
            } catch (err) {
                vscode.window.showErrorMessage("There was an error parsing the object. Make sure it is a valid p5.engine object.");
                console.log(err);
                return;
            }
            setup = true;
        });
    }));

    /* const startEditorButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    startEditorButton.text = "Set up/Refresh Editor";
    startEditorButton.command = "p5-engine.setupEditor";
    startEditorButton.tooltip = "Sets up or refreshes the p5.engine editor with the engine object to edit";
    startEditorButton.show();
    context.subscriptions.push(startEditorButton); */

    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.save", () => {
        if (!isDirty) return;
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        
        try {
            treeDataProvider.saveObject();
            //saveButton.text = "Save Changes";
        }
        catch (err) {
            console.log(err);
        }
    }));

    /* saveButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1001);
    saveButton.text = "Save Changes";
    saveButton.command = "p5-engine.save";
    saveButton.tooltip = "Updates the engine object in the file with changes";
    saveButton.show();
    context.subscriptions.push(saveButton); */

    //tree item actions
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.editItem", /**@param {EngineExplorerItem}node*/node => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        if (!node) {
            vscode.window.showErrorMessage("Cannot execute command 'Edit Item' in this context.");
            return;
        }
        let line = treeDataProvider.saveObject(null, null, node.obj);
        vscode.window.activeTextEditor.revealRange(new vscode.Range(line - 1, 0, line - 1, 0), vscode.TextEditorRevealType.AtTop);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.addItem", /**@param {EngineExplorerItem}node*/node => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        if (!node) {
            vscode.window.showErrorMessage("Cannot execute command 'Add Item' in this context.");
            return;
        }
        vscode.window.showQuickPick(["Shape", "Script", "Value", "Folder"], {canPickMany : false, placeHolder : `Select an object to add as a child of "${node.label}"`}).then(value => {
            if (!value) return;
            let obj;
            switch (value) {
                case "Shape":
                    vscode.window.showQuickPick(["Rectangle", "Ellipse", "Triangle", "Custom Polygon", "Curved Custom Polygon", "Text", "Custom Shape"], {canPickMany : false, placeHolder : `Select a shape to add as a child of "${node.label}"`}).then(selection => {
                        if (!selection) return;
                        lastShapeType = selection;
                        let shapeType = lastShapeType;
                        switch (lastShapeType) {
                            case 'Rectangle':
                                shapeType = "Rect";
                                break;
                            case 'Custom Polygon':
                                shapeType = "CustomPolygon";
                                break;
                            case 'Curved Custom Polygon':
                                shapeType = "CustomPolygonCurved";
                                break;
                            case 'Custom Shape':
                                shapeType = "CustomShape";
                                break;
                        }
                        eval("obj = " + defaultShapeObjects[shapeType]);
                        if (!node.obj.children) node.obj.children = [];
                        node.obj.children.push(obj);
                        treeDataProvider.refresh();
                    });
                    break;
                case "Script":
                    eval("obj = " + defaultScriptObject);
                    break;
                case "Value":
                    eval("obj = " + defaultValueObject);
                    break;
                case "Folder":
                    eval("obj = " + defaultFolderObject);
                    break;
            }
            if (value != "Shape") {
                if (!node.obj.children) node.obj.children = [];
                node.obj.children.push(obj);
                treeDataProvider.refresh();
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.deleteItem", /**@param {EngineExplorerItem}node*/node => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        if (!node) {
            vscode.window.showErrorMessage("Cannot execute command 'Delete Item' in this context.");
            return;
        }
        node.parent.obj.children.splice(node.parent.obj.children.indexOf(node.obj), 1);
        treeDataProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.copyItems", /**@param {EngineExplorerItem}node*/node => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        if (!node) {
            vscode.window.showErrorMessage("Cannot execute command 'Copy' in this context.");
            return;
        }
        if (node.contextValue == "sketch") return;
        if (treeView.selection.length <= 1) treeDataProvider.clipboardItems = [node];
        else {
            treeDataProvider.clipboardItems = [...treeView.selection];
            if (!treeView.selection.includes(node)) treeDataProvider.clipboardItems.push(node);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.pasteItems", /**@param {EngineExplorerItem}node*/node => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        if (!node) {
            vscode.window.showErrorMessage("Cannot execute command 'Paste' in this context.");
            return;
        }

        try {
            let treeItems = treeDataProvider.clipboardItems;
            //also filter out items that are the target
            treeItems = treeItems.filter(value => {
                if (node == value) return false;
                return true;
            });
            function toStr(obj) {
                function getIndent(indentAmount) {
                    let string = "";
                    for (let i = 0; i < indentAmount; i++) {
                        string += "    ";
                    }
                    return string;
                }
                
                function recursiveAddObj(obj, indentAmount, stringSoFar) {
                    let notFirst = false;
                    let string = "{";
                    for (let key in obj) {
                        if (notFirst) string += ",";
                        string += "\n" + getIndent(indentAmount) + key + " : ";
                        if (typeof obj[key] == "function") {
                            string += obj[key].toString();
                        }
                        else if (typeof obj[key] == "object" && obj[key] !== null) {
                            if (Array.isArray(obj[key])) {
                                string += recursiveAddArray(obj[key], indentAmount + 1, stringSoFar + string);
                            } else {
                                string += recursiveAddObj(obj[key], indentAmount + 1, stringSoFar + string);
                            }
                        } else if (obj[key] === null) {
                            string += "null"
                        } else if (typeof obj[key] == "string") {
                            string += '"' + obj[key].replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
                        } else {
                            string += obj[key];
                        }
                        notFirst = true;
                    }
                    string += "\n" + getIndent(indentAmount - 1) + "}";
                    return string;
                }
        
                function recursiveAddArray(arr, indentAmount, stringSoFar) {
                    let notFirst = false;
                    let string = "[";
                    for (let value of arr) {
                        if (notFirst) string += ",";
                        string += "\n" + getIndent(indentAmount);
                        if (typeof value == "function") {
                            string += value.toString();
                        }
                        else if (typeof value == "object" && value !== null) {
                            if (Array.isArray(value)) {
                                string += recursiveAddArray(value, indentAmount + 1, stringSoFar + string);
                            } else {
                                string += recursiveAddObj(value, indentAmount + 1, stringSoFar + string);
                            }
                        } else if (value === null) {
                            string += "null"
                        } else if (typeof value == "string") {
                            string += '"' + value.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
                        } else {
                            string += value;
                        }
                        notFirst = true;
                    }
                    string += "\n" + getIndent(indentAmount - 1) + "]";
                    return string;
                }
        
                let stringified = recursiveAddObj(obj, 1, "");
                return stringified;
            }
            for (let i = 0; i < treeItems.length; i++) {
                let o, str;
                str = toStr(treeItems[i].obj);
                console.log(str);
                eval("o = " + str);
                treeItems[i] = new EngineExplorerItem(o, treeItems[i].collapsibleState, node, false);
            }
            
            if (treeItems.length == 0) return;
            if (!node.obj.children) node.obj.children = [];
            
            for (let item of treeItems) {
                node.obj.children.push(item.obj);
            }

            treeDataProvider.refresh();
        } catch(err) {
            console.log(err);
            vscode.window.showErrorMessage("An error occured.");
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand("p5-engine.refreshEditor", () => {
        if (!setup) {
            vscode.window.showErrorMessage("Please set up the editor first.");
            return;
        }
        vscode.commands.executeCommand("p5-engine.setupEditor", true);
    }));
}

function deactivate() {
    setup = false;
    treeDataProvider = undefined;
    treeDragAndDropController = undefined;
    treeView = undefined;
    isDirty = false;
    saveButton = undefined;
}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
    deactivate
}

const defaultSketchObject = '{\n\
    w : 400,\n\
    h : 400,\n\
    fillColor : [220, 220, 200]\n\
}';
const defaultShapeObjects = {
    "Rect" : '{\n\
    type : "Shape",\n\
    name : "Rect",\n\
    shapeType : "Rect",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    w : 0,\n\
    scalarW : 0,\n\
    h : 0,\n\
    scalarH : 0,\n\
    anchorX : 0,\n\
    anchorY : 0,\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    cornerCurve : 0,\n\
    children : []\n\
}',
    "Ellipse" : '{\n\
    type : "Shape",\n\
    name : "Ellipse",\n\
    shapeType : "Ellipse",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    w : 0,\n\
    scalarW : 0,\n\
    h : 0,\n\
    scalarH : 0,\n\
    anchorX : 0,\n\
    anchorY : 0,\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}',
    "Triangle" : '{\n\
    type : "Shape",\n\
    name : "Triangle",\n\
    shapeType : "Triangle",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    vertices : [\n\
        {x : 0, scalarX : 0, y : 0, scalarY : 0},\n\
        {x : 0, scalarX : 0, y : 0, scalarY : 0},\n\
        {x : 0, scalarX : 0, y : 0, scalarY : 0}\n\
    ],\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}',
    "CustomPolygon" : '{\n\
    type : "Shape",\n\
    name : "CustomPolygon",\n\
    shapeType : "CustomPolygon",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    vertices : [\n\
        {x : 0, scalarX : 0, y : 0, scalarY : 0}\n\
    ],\n\
    customPolygonType : null,\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}',
    "CustomPolygonCurved" : '{\n\
    type : "Shape",\n\
    name : "CustomPolygonCurved",\n\
    shapeType : "CustomPolygonCurved",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    vertices : [\n\
        {x : 0, scalarX : 0, y : 0, scalarY : 0}\n\
    ],\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}',
    "Text" : '{\n\
    type : "Shape",\n\
    name : "Text",\n\
    shapeType : "Text",\n\
    x : 0,\n\
    scalarX : 0,\n\
    y : 0,\n\
    scalarY : 0,\n\
    fillColor : [128, 128, 128],\n\
    strokeColor : [0, 0, 0],\n\
    strokeWeight : 3,\n\
    text : "",\n\
    textAlignHorizontal : "center",\n\
    textAlignVertical : "center",\n\
    textSize : 18,\n\
    textSizeScalar : 0,\n\
    textFont : "Arial",\n\
    textStyle : "normal",\n\
    scale : 1,\n\
    rotation : 0,\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}',
    "CustomShape" : '{\n\
    type : "Shape",\n\
    name : "CustomShape",\n\
    shapeType : "CustomShape",\n\
    draw : (/**@type {Shape}*/thisShape, /**@type {function}*/superDraw) => {\n\
        push();\n\
        superDraw();\n\
        pop();\n\
    },\n\
    mouseIsOver : (/**@type {Shape}*/thisShape) => {\n\
        return false;\n\
    },\n\
    visible : true,\n\
    active : true,\n\
    children : []\n\
}'
}
const defaultScriptObject = '{\n\
    type : "Script",\n\
    name : "Script",\n\
    disabled : false,\n\
    function : (/**@type {Script}*/script) => {\n\
        \n\
    },\n\
    children : []\n\
}';
const defaultValueObject = '{\n\
    type : "Value",\n\
    name : "Value",\n\
    value : null,\n\
    children : []\n\
}';
const defaultFolderObject = '{\n\
    type : "Folder",\n\
    name : "Folder",\n\
    children : []\n\
}';

class EngineExplorerProvider {
    _onChange = new vscode.EventEmitter();
    onDidChangeTreeData = this._onChange.event;

    /**@type {EngineExplorerItem[]} */
    clipboardItems = [];

    constructor(obj) {
        this.obj = obj;
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (element) {
            let arr = [];
            for (let i of element.obj.children) {
                arr.push(new EngineExplorerItem(i, (i.children && i.children.length) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None, element));
            }
            return arr;
        } else {
            return [new EngineExplorerItem(this.obj, (this.obj.children && this.obj.children.length) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None, undefined, true)];
        }
    }

    refresh() {
        this._onChange.fire();
        isDirty = true;
        vscode.commands.executeCommand("p5-engine.save");
        //saveButton.text = "Save Changes$(close-dirty)";
    }

    /**
     * @param {object} [lineofobj] Optional parameter to specify an object to get the line of
     * @returns {string | [string, number | null]} String version of object
     */
    convertObjToString(lineofobj) {
        let objline = null;
        function getIndent(indentAmount) {
            let string = "";
            for (let i = 0; i < indentAmount; i++) {
                string += "    ";
            }
            return string;
        }
        
        function recursiveAddObj(obj, indentAmount, stringSoFar) {
            if (obj == lineofobj) objline = stringSoFar.split("\n").length;
            let notFirst = false;
            let string = "{";
            for (let key in obj) {
                if (notFirst) string += ",";
                string += "\n" + getIndent(indentAmount) + key + " : ";
                if (typeof obj[key] == "function") {
                    string += obj[key].toString();
                }
                else if (typeof obj[key] == "object" && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        string += recursiveAddArray(obj[key], indentAmount + 1, stringSoFar + string);
                    } else {
                        string += recursiveAddObj(obj[key], indentAmount + 1, stringSoFar + string);
                    }
                } else if (obj[key] === null) {
                    string += "null"
                } else if (typeof obj[key] == "string") {
                    string += '"' + obj[key].replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
                } else {
                    string += obj[key];
                }
                notFirst = true;
            }
            string += "\n" + getIndent(indentAmount - 1) + "}";
            return string;
        }

        function recursiveAddArray(arr, indentAmount, stringSoFar) {
            if (arr == lineofobj) objline = stringSoFar.split("\n").length;
            let notFirst = false;
            let string = "[";
            for (let value of arr) {
                if (notFirst) string += ",";
                string += "\n" + getIndent(indentAmount);
                if (typeof value == "function") {
                    string += value.toString();
                }
                else if (typeof value == "object" && value !== null) {
                    if (Array.isArray(value)) {
                        string += recursiveAddArray(value, indentAmount + 1, stringSoFar + string);
                    } else {
                        string += recursiveAddObj(value, indentAmount + 1, stringSoFar + string);
                    }
                } else if (value === null) {
                    string += "null"
                } else if (typeof value == "string") {
                    string += '"' + value.replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
                } else {
                    string += value;
                }
                notFirst = true;
            }
            string += "\n" + getIndent(indentAmount - 1) + "]";
            return string;
        }

        let stringified = recursiveAddObj(this.obj, 1, "");
        return lineofobj ? [stringified, objline] : stringified;
    }

    saveObject(successCallback, errorCallback, lineofobj) {
        let text = vscode.window.activeTextEditor.document.getText();
        let text2 = text.replace(/\n/g, "");
        let match = text2.match(/(let |var |const )?( *[a-zA-Z\$_][a-zA-Z\$0-9_]* *= *)({(.|\n)*}) *;?/);        
        if (!match) {
            vscode.window.showErrorMessage("Please use a valid object/file.");
            return;
        }
        let lines = text.split("\n");
        let startLine = 0;
        let endLine = 0;
        let charactersLeftStart = text2.indexOf(match[3]);
        let charactersLeftEnd = match[3].length + charactersLeftStart;
        let foundStart = false;
        
        while (true) {
            if (!foundStart) {
                if ((charactersLeftStart - lines[startLine].length) < 0) {
                    foundStart = true;
                    continue;
                }
                charactersLeftStart -= lines[startLine].length;
                charactersLeftEnd -= lines[startLine].length;
                startLine++;
                endLine++;
            } else {
                if ((charactersLeftEnd - lines[endLine].length) <= 0) {
                    break;
                }
                charactersLeftEnd -= lines[endLine].length;
                endLine++;
            }
        }
        let returnValue;
        vscode.window.activeTextEditor.edit(editBuilder => {
            let string;
            if (lineofobj) {
                [string, returnValue] = this.convertObjToString(lineofobj);
            } else string = this.convertObjToString();
            editBuilder.replace(new vscode.Range(startLine, charactersLeftStart, endLine, charactersLeftEnd), string);
        }).then(value => {
            if (value && successCallback) successCallback();
            else if (!value && errorCallback) errorCallback();
        });
        return returnValue;
    }
}

class EngineExplorerItem {
    /**
     * @param {{children: object[] | undefined}} obj 
     * @param {vscode.TreeItemCollapsibleState} collapsibleState 
     * @param {EngineExplorerItem | undefined} parent 
     * @param {boolean} isSketch 
     */
    constructor(obj, collapsibleState, parent, isSketch = false) {
        this.obj = obj;
        this.parent = parent;
        this.isSketch = isSketch;
        this.label = isSketch ? "Sketch" : `${obj.name}`;
        this.contextValue = isSketch ? "sketch" : "node";
        this.collapsibleState = collapsibleState;
        this.tooltip = `Edit ${obj.type}${obj.type == "Shape" ? " " + obj.shapeType : ""} "${obj.name}"`;
        if (isSketch) {
            this.tooltip = "Edit Sketch";
        }
    }
}

class EngineExplorerDragAndDropController {
    constructor(obj) {
        this.obj = obj;
    }

    dragMimeTypes = ["application/vnd.code.tree.p5-engine.treeView"];
    dropMimeTypes = ["application/vnd.code.tree.p5-engine.treeView"];

    /**
     * @param {EngineExplorerItem[]} source 
     * @param {vscode.DataTransfer} dataTransfer 
     */
    handleDrag(source, dataTransfer) {
        //cannot drag sketch
        source = source.filter(value => !value.isSketch);
        if (source.length == 0) return;
        dataTransfer.set("application/vnd.code.tree.treeView", new vscode.DataTransferItem(source));
    }

    /**
     * @param {EngineExplorerItem | undefined} target 
     * @param {vscode.DataTransfer} sources 
     */
    handleDrop(target, sources) {
        //cannot put directly in root, must be inside sketch
        if (!target) return;
        let transferItem = sources.get("application/vnd.code.tree.treeView");
        if (!transferItem) return;
        /**@type {EngineExplorerItem[]}*/
        let treeItems = transferItem.value;
        //filter out items that are already a child of target
        //also filter out items that are an ancestor of the target
        //also filter out items that are the target
        treeItems = treeItems.filter(value => {
            if (target == value) return false;
            if (target != value.parent) {
                if (!value.obj.children) return true;
                function recursiveCheck(obj) {
                    if (!obj.children) return false;
                    for (let c of obj.children) {
                        if (c == target.obj || recursiveCheck(c)) return true;
                    }
                    return false;
                }
                return !recursiveCheck(value.obj);
            } else return false;
        });
        if (treeItems.length == 0) return;
        if (!target.obj.children) target.obj.children = [];
        for (let item of treeItems) {
            item.parent.obj.children.splice(item.parent.obj.children.indexOf(item.obj), 1);
            if (item.parent.obj.children.length == 0) item.parent.obj.children = null;
            target.obj.children.push(item.obj);
        }
        treeDataProvider.refresh();
    }
}
