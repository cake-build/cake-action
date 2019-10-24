import * as core from '@actions/core';
import { ToolsDirectory } from "./toolsDirectory";
import { CakeTool } from "./cake";
import { CakeArgument } from './cakeParameter';

export async function run() {
  try {
    const scriptPath = core.getInput('script-path');
    const target = new CakeArgument('target', core.getInput('target'));

    const toolsDir = new ToolsDirectory();
    await toolsDir.create();

    await CakeTool.installLocally(toolsDir);
    await CakeTool.runScript(scriptPath, toolsDir, target);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
