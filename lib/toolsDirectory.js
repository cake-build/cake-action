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
const platform_1 = require("./platform");
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
    append(...segment) {
        return path.join(this.path, ...segment);
    }
    containsFile(fileName) {
        return fs.existsSync(this.append(fileName));
    }
    containsTool(toolName) {
        const executableName = platform_1.Platform.isWindows() ? `${toolName}.exe` : toolName;
        return fs.existsSync(this.append(executableName));
    }
    containsToolWithVersion(packageId, version) {
        return fs.existsSync(this.append('.store', packageId, version ? version : '', 'project.assets.json'));
    }
    toString() {
        return this.path;
    }
}
exports.ToolsDirectory = ToolsDirectory;
