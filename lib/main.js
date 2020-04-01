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
const dotnet = __importStar(require("./dotnet"));
const cake = __importStar(require("./cake"));
const cakeParameter_1 = require("./cakeParameter");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const scriptPath = core.getInput('script-path');
            const version = core.getInput('cake-version');
            const bootstrap = (core.getInput('cake-bootstrap') || '').toLowerCase() === 'true';
            const target = new cakeParameter_1.CakeArgument('target', core.getInput('target'));
            const verbosity = new cakeParameter_1.CakeArgument('verbosity', core.getInput('verbosity'));
            const toolsDir = new toolsDirectory_1.ToolsDirectory();
            toolsDir.create();
            dotnet.disableTelemetry();
            yield dotnet.installLocalCakeTool(toolsDir, version);
            if (bootstrap) {
                yield cake.bootstrapScript(scriptPath, toolsDir);
            }
            yield cake.runScript(scriptPath, toolsDir, target, verbosity);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
exports.run = run;
run();
