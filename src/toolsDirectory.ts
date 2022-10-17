import * as fs from 'fs';
import * as path from 'path';
import { Platform } from './platform';

export class ToolsDirectory {
  private readonly _path: string;

  constructor(path = 'tools') {
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

  containsFile(fileName: string, ...subdirectory: string[]): boolean {
    return fs.existsSync(this.append(...subdirectory, fileName));
  }

  containsTool(toolName: string): boolean {
    const executableName = Platform.isWindows() ? `${toolName}.exe` : toolName;
    return this.containsFile(executableName);
  }

  containsToolWithVersion(packageId: string, version: string): boolean {
    return this.containsFile('project.assets.json', '.store', packageId, version);
  }

  toString(): string {
    return this.path;
  }
}
