import * as path from 'path';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { ToolsDirectory } from './toolsDirectory';
import { Platform } from './platform';

const dotnetToolInstall = 'dotnet tool install';
const dotnetToolUnInstall = 'dotnet tool uninstall';
const dotnetCake = 'dotnet-cake';

export class DotNet {
  static disableTelemetry() {
    core.exportVariable('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
  }

  static async installLocalCakeTool(
    targetDirectory: ToolsDirectory = new ToolsDirectory(),
    version?: string
    ) {
    return DotNet.installLocalTool('Cake.Tool', dotnetCake, targetDirectory, version);
  }

  static async installLocalTool(
    packageId: string,
    toolName: string,
    targetDirectory: ToolsDirectory = new ToolsDirectory(),
    version?: string
    ) {
    const toolExecutable = `${toolName}${Platform.isWindows() ? '.exe' : ''}`;

    if (targetDirectory.containsFile(toolExecutable)) {
      if (version) {
        const toolInstallPath = path.join(
              '.store',
              packageId.toLowerCase(),
              version.toLowerCase(),
              'project.assets.json'
            );

        if (targetDirectory.containsFile(toolInstallPath)) {
          core.info(`The ${packageId} version ${version} already exists in ${targetDirectory}, skipping installation`);
          return;
        }

        const uninstallExitCode = await exec(dotnetToolUnInstall, ['--tool-path', targetDirectory.path, packageId]);

        if (uninstallExitCode != 0) {
          throw new Error(`Failed to uninstall previous version of ${packageId}. Exit code: ${uninstallExitCode}`);
        }
      } else {
        core.info(`The ${packageId} already exists in ${targetDirectory}, skipping installation`);
        return;
      }
    }

    const versionArg = (version) ? ['--version', version] : [];
    const installArgs = [...versionArg, '--tool-path', targetDirectory.path, packageId];

    const exitCode = await exec(dotnetToolInstall, installArgs);

    if (exitCode != 0) {
      throw new Error(`Failed to install ${packageId}. Exit code: ${exitCode}`);
    }
  }
}
