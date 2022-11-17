import { ToolsDirectory } from './toolsDirectory';

export class CakeToolSettings {
  readonly workingDirectory?: ToolsDirectory;
  readonly useToolManifest: boolean;

  constructor(
    workingDirectory?: ToolsDirectory,
    useToolManifest = false
  ) {
    this.workingDirectory = workingDirectory;
    this.useToolManifest = useToolManifest;
  }
}
