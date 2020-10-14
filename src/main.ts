import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import * as dotnet from './dotnet';
import * as cake from './cake';
import { CakeArgument, CakeParameter, CakeSwitch } from './cakeParameter';
import yargsParser from 'yargs-parser';

export async function run() {
  try {
    const scriptPath = core.getInput('script-path');
    const version = core.getInput('cake-version');
    const bootstrap =
      (core.getInput('cake-bootstrap') || '').toLowerCase() === 'true';
    const target = new CakeArgument('target', core.getInput('target'));
    const verbosity = new CakeArgument('verbosity', core.getInput('verbosity'));
    const scriptArgs = getScriptArguments();

    const toolsDir = new ToolsDirectory();
    toolsDir.create();

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    await dotnet.installLocalCakeTool(toolsDir, version);

    if (bootstrap) {
      await cake.bootstrapScript(scriptPath, toolsDir);
    }

    await cake.runScript(
      scriptPath,
      toolsDir,
      target,
      verbosity,
      ...scriptArgs
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getScriptArguments(): CakeParameter[] {
  const result: CakeParameter[] = [];
  const input: string = core.getInput('script-arguments');
  if (!input) {
    return [];
  }

  const options = yargsParser(input);
  const optionsKeys: string[] = Object.keys(options);
  optionsKeys.forEach((optionsKey) => {
    // we ignore that because of yargs-parser implementation
    if (optionsKey === "_") {
      return;
    }

    const cakeArgument = new CakeArgument(optionsKey, options[optionsKey]);
    result.push(cakeArgument);
  });
  return result;
}

run();
