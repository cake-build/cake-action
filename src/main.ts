import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import { CakeToolSettings } from './cakeToolSettings';
import { isError, isString } from './guards';
import * as dotnet from './dotnet';
import * as cakeTool from './cakeTool';
import * as cake from './cake';
import * as action from './action';

export async function run() {
  try {
    const inputs = action.getInputs();
    const file = inputs.file;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    const cakeToolSettings = new CakeToolSettings(toolsDir, version?.version === 'tool-manifest');

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    if (file.type === 'project') {
      await cake.runProject(file.path, toolsDir, ...inputs.scriptArguments);
    } else {
      await cakeTool.install(toolsDir, version);

      if (bootstrap === 'explicit') {
        await cake.bootstrapScript(file.path, cakeToolSettings);
      }

      await cake.runScript(file.path, cakeToolSettings, ...inputs.scriptArguments);
    }
  } catch (error) {
    if (isError(error)) {
      core.setFailed(error.message);
    } else if (isString(error)) {
      core.setFailed(error);
    }
  }
}

run();
