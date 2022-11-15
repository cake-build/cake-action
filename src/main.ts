import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import { CakeToolSettings } from './cakeToolSettings';
import { isError, isString } from './guards';
import * as dotnet from './dotnet';
import * as cake from './cake';
import * as action from './action';

export async function run() {
  try {
    const inputs = action.getInputs();
    const scriptPath = inputs.scriptPath;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    const cakeTookSettings = new CakeToolSettings(toolsDir, version === true);

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    if (cakeTookSettings.useToolManifest) {
      await dotnet.restoreTool();
    } else {
      await dotnet.installLocalCakeTool(toolsDir, typeof version === "string" ? version : undefined);
    }

    if (bootstrap) {
      await cake.bootstrapScript(scriptPath, cakeTookSettings);
    }

    await cake.runScript(scriptPath, cakeTookSettings, ...inputs.scriptArguments);
  } catch (error) {
    if (isError(error)) {
      core.setFailed(error.message);
    } else if (isString(error)) {
      core.setFailed(error);
    }
  }
}

run();
