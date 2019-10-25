"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("@actions/exec");
const toolsDirectory_1 = require("./toolsDirectory");
const dotnetToolInstall = 'dotnet tool install';
class DotNet {
    static installLocalCakeTool(targetDirectory = new toolsDirectory_1.ToolsDirectory()) {
        return __awaiter(this, void 0, void 0, function* () {
            return DotNet.installLocalTool('Cake.Tool', targetDirectory);
        });
    }
    static installLocalTool(toolName, targetDirectory = new toolsDirectory_1.ToolsDirectory()) {
        return __awaiter(this, void 0, void 0, function* () {
            const exitCode = yield exec_1.exec(dotnetToolInstall, ['--tool-path', targetDirectory.path, toolName]);
            if (exitCode != 0) {
                throw new Error(`Failed to install ${toolName}. Exit code: ${exitCode}`);
            }
        });
    }
}
exports.DotNet = DotNet;
