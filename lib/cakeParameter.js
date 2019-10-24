"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CakeArgument {
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }
    isValid() {
        return !!this._name && !!this._value;
    }
    format() {
        return this.isValid() ? `--${this._name}=${this._value}` : '';
    }
}
exports.CakeArgument = CakeArgument;
class CakeSwitch {
    constructor(name) {
        this._name = name;
    }
    isValid() {
        return !!this._name;
    }
    format() {
        return this.isValid() ? `--${this._name}` : '';
    }
}
exports.CakeSwitch = CakeSwitch;
