import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { ToolsDirectory } from './toolsDirectory';

const dotnetToolInstall = 'dotnet tool install';
const dotnetToolUnInstall = 'dotnet tool uninstall';
const dotnetToolRestore = 'dotnet tool restore';

export function disableTelemetry() {
  core.exportVariable('DOTNET_CLI_TELEMETRY_OPTOUT', 'true');
}

export function disableWelcomeMessage() {
  core.exportVariable('DOTNET_NOLOGO', 'true');
}

export async function installLocalTool(
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

  if (version && (targetDirectory.containsTool(toolName) && !targetDirectory.containsToolWithVersion(packageId, version))) {
    await uninstallLocalTool(packageId, targetDirectory);
  }

  const versionArg = version ? ['--version', version] : [];
  const installArgs = [...versionArg, '--tool-path', targetDirectory.path, packageId];

  const exitCode = await exec(dotnetToolInstall, installArgs);

  if (exitCode != 0) {
    throw new Error(`Failed to install ${packageId}. Exit code: ${exitCode}`);
  }
}

export async function uninstallLocalTool(
  packageId: string,
  targetDirectory: ToolsDirectory = new ToolsDirectory()
) {
  const exitCode = await exec(dotnetToolUnInstall, ['--tool-path', targetDirectory.path, packageId]);

  if (exitCode != 0) {
    throw new Error(`Failed to uninstall ${packageId}. Exit code: ${exitCode}`);
  }
}

export async function restoreLocalTools() {
  const exitCode = await exec(dotnetToolRestore);

  if (exitCode != 0) {
    throw new Error(`Failed to restore the local tools. Exit code: ${exitCode}`);
  }
}
