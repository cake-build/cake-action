/* eslint @typescript-eslint/no-unused-vars: off */
import { ToolsDirectory } from './toolsDirectory';
/* eslint @typescript-eslint/no-unused-vars: error */

export class CakeToolSettings {
  readonly workingDirectory?: ToolsDirectory;
  readonly useToolManifest: boolean;

  constructor(
    workingDirectory: ToolsDirectory | undefined,
    useToolManifest: boolean = false
  ) {
    this.workingDirectory = workingDirectory;
    this.useToolManifest = useToolManifest;
  }
}
