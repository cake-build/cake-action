import { exec } from '@actions/exec';
import { which } from '@actions/io';
/* eslint @typescript-eslint/no-unused-vars: off */
import { ToolsDirectory } from './toolsDirectory';
import { CakeParameter } from './cakeParameter';
/* eslint @typescript-eslint/no-unused-vars: error */

const dotnetCake = 'dotnet-cake';

export class CakeTool {
  static async runScript(
    scriptPath: string = 'build.cake',
    workingDirectory?: ToolsDirectory,
    ...params: CakeParameter[]
  ) {
    const cakeToolPath = await CakeTool.resolveCakeToolPath(workingDirectory);
    const cakeParams = CakeTool.formatParameters(params);
    const exitCode = await exec(cakeToolPath, [scriptPath, ...cakeParams]);

    if (exitCode != 0) {
      throw new Error(`Failed to run the build script. Exit code: ${exitCode}`);
    }
  }

  private static async resolveCakeToolPath(workingDirectory?: ToolsDirectory): Promise<string> {
    return workingDirectory
      ? workingDirectory.append(dotnetCake)
      : await which(dotnetCake);
  }

  private static formatParameters(params: CakeParameter[]): string[] {
    return params
      .filter(p => p.isValid())
      .map(p => p.format());
  }
}
