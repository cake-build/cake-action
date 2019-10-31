import * as fs from 'fs';
import * as path from 'path';
import { Platform } from './platform';

export class ToolsDirectory {
  private readonly _path: string;

  constructor(path: string = 'tools') {
    this._path = path;
  }

  get path(): string {
    return path.normalize(this._path);
  }

  create() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
  }

  append(...segment: string[]): string {
    return path.join(this.path, ...segment);
  }

  containsFile(fileName: string): boolean {
    return fs.existsSync(this.append(fileName));
  }

  containsTool(toolName: string): boolean {
    const executableName = Platform.isWindows() ? `${toolName}.exe` : toolName;
    return fs.existsSync(this.append(executableName));
  }

  containsToolWithVersion(packageId: string, version: string): boolean {
    return fs.existsSync(
      this.append('.store', packageId, version ? version : '', 'project.assets.json'));
  }

  toString(): string {
    return this.path;
  }
}
