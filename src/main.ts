import * as core from '@actions/core';
import { ToolsDirectory } from "./toolsDirectory";
import { CakeTool } from "./cake";

export async function run() {
  try {
    const scriptPath = core.getInput('script-path');

    const toolsDir = new ToolsDirectory();
    await toolsDir.create();

    await CakeTool.installLocally(toolsDir);
    await CakeTool.runScript(scriptPath, toolsDir);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
