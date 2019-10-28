import * as fs from 'fs';
import * as io from '@actions/io';
import * as path from 'path';

export class ToolsDirectory {
  private readonly _path: string;

  constructor(path: string = 'tools') {
    this._path = path;
  }

  get path(): string {
    return path.normalize(this._path);
  }

  create() {
    return io.mkdirP(this.path);
  }

  appendFileName(fileName: string): string {
    return path.join(this.path, fileName);
  }

  containsFile(fileName: string): boolean {
    return fs.existsSync(this.appendFileName(fileName));
  }

  toString(): string {
    return this.path;
  }
}
