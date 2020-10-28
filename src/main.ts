import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
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

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    await dotnet.installLocalCakeTool(toolsDir, version);

    if (bootstrap) {
      await cake.bootstrapScript(scriptPath, toolsDir);
    }

    await cake.runScript(scriptPath, toolsDir, ...inputs.scriptArguments);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
