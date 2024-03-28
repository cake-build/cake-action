import * as core from '@actions/core';

import * as action from './action';
import * as cake from './cake';
import * as cakeTool from './cakeTool';
import { CakeToolSettings } from './cakeToolSettings';
import * as dotnet from './dotnet';
import { isError, isString } from './guards';
import { ToolsDirectory } from './toolsDirectory';

export async function run() {
  try {
    const inputs = action.getInputs();
    const scriptPath = inputs.scriptPath;
    const csprojPath = inputs.csprojPath;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    const cakeToolSettings = new CakeToolSettings(toolsDir, version?.version === 'tool-manifest');

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    if (!csprojPath) {
      await cakeTool.install(toolsDir, version);

      if (bootstrap === 'explicit') {
        await cake.bootstrapScript(scriptPath, cakeToolSettings);
      }

      await cake.runScript(scriptPath, cakeToolSettings, ...inputs.scriptArguments);
    } else {
      await cake.runProject(csprojPath, toolsDir, ...inputs.scriptArguments);
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
