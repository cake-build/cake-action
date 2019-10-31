import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { ToolsDirectory } from './toolsDirectory';

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
    if (!version && targetDirectory.containsTool(toolName)) {
      core.info(`The ${packageId} already exists in ${targetDirectory}, skipping installation`);
      return;
    }

    if (version && targetDirectory.containsToolWithVersion(packageId, version)) {
      core.info(`The ${packageId} version ${version} already exists in ${targetDirectory}, skipping installation`);
      return;
    }

    if (version && !targetDirectory.containsToolWithVersion(packageId, version)) {
      await DotNet.uninstallLocalTool(packageId, targetDirectory);
    }

    const versionArg = version ? ['--version', version] : [];
    const installArgs = [...versionArg, '--tool-path', targetDirectory.path, packageId];

    const exitCode = await exec(dotnetToolInstall, installArgs);

    if (exitCode != 0) {
      throw new Error(`Failed to install ${packageId}. Exit code: ${exitCode}`);
    }
  }

  static async uninstallLocalTool(
    packageId: string,
    targetDirectory: ToolsDirectory = new ToolsDirectory()
  ) {
    const exitCode = await exec(dotnetToolUnInstall, ['--tool-path', targetDirectory.path, packageId]);

    if (exitCode != 0) {
      throw new Error(`Failed to uninstall ${packageId}. Exit code: ${exitCode}`);
    }
  }
}
