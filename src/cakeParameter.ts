export interface CakeParameter {
  isValid(): boolean;

  format(): string;
}

export class CakeArgument implements CakeParameter {
  private readonly _name: string;
  private readonly _value: string;

  constructor(name: string, value: string) {
    this._name = name;
    this._value = value;
  }

  isValid(): boolean {
    return !!this._name && !!this._value;
  }

  format(): string {
    return this.isValid() ? `--${this._name}=${this._value}` : '';
  }
}

export class CakeSwitch implements CakeParameter {
  private readonly _name: string;

  constructor(name: string) {
    this._name = name;
  }

  isValid(): boolean {
    return !!this._name;
  }

  format(): string {
    return this.isValid() ? `--${this._name}` : '';
  }
}
