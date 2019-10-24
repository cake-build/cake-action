import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { ToolsDirectory } from './toolsDirectory';
import { CakeParameter } from './cakeParameter';

const dotnetToolInstall = 'dotnet tool install';
const dotnetCake = 'dotnet-cake';

export class CakeTool {
  static async installLocally(targetDirectory: ToolsDirectory = new ToolsDirectory()) {
    const exitCode = await exec(dotnetToolInstall, ['--tool-path', targetDirectory.path, 'Cake.Tool']);

    if (exitCode != 0) {
      throw new Error(`Failed to install the Cake.Tool. Exit code: ${exitCode}`);
    }
  }

  static async runScript(scriptPath: string, toolDirectory?: ToolsDirectory, ...params: CakeParameter[]) {
    const cakeToolPath = await CakeTool.resolveCakeToolPath(toolDirectory);
    const cakeParams = CakeTool.formatParameters(params);
    const exitCode = await exec(cakeToolPath, [scriptPath, ...cakeParams]);

    if (exitCode != 0) {
      throw new Error(`Failed to run the build script. Exit code: ${exitCode}`);
    }
  }

  private static async resolveCakeToolPath(toolDirectory?: ToolsDirectory): Promise<string> {
    return toolDirectory ? toolDirectory.appendFileName(dotnetCake) : await which(dotnetCake);
  }

  private static formatParameters(params: CakeParameter[]): string[] {
    return params
      .filter(p => p.isValid())
      .map(p => p.format());
  }
}
