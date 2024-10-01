import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { CakeToolSettings } from './cakeToolSettings';
import { CakeParameter } from './cakeParameter';
import { ToolsDirectory } from './toolsDirectory';

const dotnetCake = 'dotnet-cake';
const dotnetLocalToolCake = 'dotnet tool run dotnet-cake';
const dotnetRun = 'dotnet run';

export async function runScript(
  scriptPath = 'build.cake',
  cakeToolSettings?: CakeToolSettings,
  ...params: CakeParameter[]
) {
  const cakeToolPath = await resolveCakeToolPath(cakeToolSettings);
  const cakeParams = formatParameters(params);
  const exitCode = await exec(cakeToolPath, [scriptPath, ...cakeParams]);

  if (exitCode != 0) {
    throw new Error(`Failed to run the build script. Exit code: ${exitCode}`);
  }
}

export async function runProject(
  csprojPath: string,
  toolsDir: ToolsDirectory,
  ...params: CakeParameter[]
) {
  const cakeParams = formatParameters(params);
  const exitCode = await exec(dotnetRun, [
    '--project', csprojPath,
    '--no-launch-profile',
    '--verbosity', 'minimal',
    '--configuration', 'Release',
    '--',
    `--paths_tools="${toolsDir}"`,
    ...cakeParams
  ]);

  if (exitCode != 0) {
    throw new Error(`Failed to run the csproj. Exit code: ${exitCode}`);
  }
}

export async function bootstrapScript(
  scriptPath = 'build.cake',
  cakeToolSettings?: CakeToolSettings
) {
  const cakeToolPath = await resolveCakeToolPath(cakeToolSettings);
  const exitCode = await exec(cakeToolPath, [scriptPath, '--bootstrap']);

  if (exitCode != 0) {
    throw new Error(`Failed to bootstrap the build script. Exit code: ${exitCode}`);
  }
}

async function resolveCakeToolPath(
  cakeToolSettings?: CakeToolSettings
): Promise<string> {
  return cakeToolSettings?.useToolManifest
    ? dotnetLocalToolCake
    : cakeToolSettings?.workingDirectory
      ? cakeToolSettings.workingDirectory.append(dotnetCake)
      : await which(dotnetCake);
}

function formatParameters(params: CakeParameter[]): string[] {
  return params
    .filter(p => p.isValid())
    .map(p => p.format());
}
