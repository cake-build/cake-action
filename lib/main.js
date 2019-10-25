"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const toolsDirectory_1 = require("./toolsDirectory");
const dotnet_1 = require("./dotnet");
const cake_1 = require("./cake");
const cakeParameter_1 = require("./cakeParameter");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const scriptPath = core.getInput('script-path');
            const target = new cakeParameter_1.CakeArgument('target', core.getInput('target'));
            const toolsDir = new toolsDirectory_1.ToolsDirectory();
            yield toolsDir.create();
            yield dotnet_1.DotNet.installLocalCakeTool(toolsDir);
            yield cake_1.CakeTool.runScript(scriptPath, toolsDir, target);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
exports.run = run;
run();
