import { exec } from '@actions/exec';
import { which } from '@actions/io';
/* eslint @typescript-eslint/no-unused-vars: off */
import { ToolsDirectory } from './toolsDirectory';
import { CakeParameter } from './cakeParameter';
/* eslint @typescript-eslint/no-unused-vars: error */

const dotnetCake = 'dotnet-cake';

export async function runScript(
  scriptPath: string = 'build.cake',
  workingDirectory?: ToolsDirectory,
  ...params: CakeParameter[]
) {
  const cakeToolPath = await resolveCakeToolPath(workingDirectory);
  const cakeParams = formatParameters(params);
  const exitCode = await exec(cakeToolPath, [scriptPath, ...cakeParams]);

  if (exitCode != 0) {
    throw new Error(`Failed to run the build script. Exit code: ${exitCode}`);
  }
}

export async function bootstrapScript(
  scriptPath: string = 'build.cake',
  workingDirectory?: ToolsDirectory
) {
  const cakeToolPath = await resolveCakeToolPath(workingDirectory);
  const exitCode = await exec(cakeToolPath, [scriptPath, '--bootstrap']);

  if (exitCode != 0) {
    throw new Error(`Failed to bootstrap the build script. Exit code: ${exitCode}`);
  }
}

async function resolveCakeToolPath(workingDirectory?: ToolsDirectory): Promise<string> {
  return workingDirectory
    ? workingDirectory.append(dotnetCake)
    : await which(dotnetCake);
}

function formatParameters(params: CakeParameter[]): string[] {
  return params
    .filter(p => p.isValid())
    .map(p => p.format());
}
