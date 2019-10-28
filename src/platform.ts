export class Platform {
  static isWindows(): boolean {
    return process.platform === 'win32';
  }
}
