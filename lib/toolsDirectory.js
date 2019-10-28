"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ToolsDirectory {
    constructor(path = 'tools') {
        this._path = path;
    }
    get path() {
        return path.normalize(this._path);
    }
    create() {
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path);
        }
    }
    appendFileName(fileName) {
        return path.join(this.path, fileName);
    }
    containsFile(fileName) {
        return fs.existsSync(this.appendFileName(fileName));
    }
    toString() {
        return this.path;
    }
}
exports.ToolsDirectory = ToolsDirectory;
