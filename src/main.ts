import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import { DotNet } from './dotnet';
import { CakeTool } from './cake';
import { CakeArgument } from './cakeParameter';

export async function run() {
  try {
    const scriptPath = core.getInput('script-path');
    const version = core.getInput('cake-version');
    const target = new CakeArgument('target', core.getInput('target'));

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    DotNet.disableTelemetry();

    await DotNet.installLocalCakeTool(toolsDir, version);
    await CakeTool.runScript(scriptPath, toolsDir, target);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
