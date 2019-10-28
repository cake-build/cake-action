"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Platform {
    static isWindows() {
        return process.platform === 'win32';
    }
}
exports.Platform = Platform;
