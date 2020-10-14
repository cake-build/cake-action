import * as core from '@actions/core';
import { ToolsDirectory } from './toolsDirectory';
import * as dotnet from './dotnet';
import * as cake from './cake';
// It is disabled, because CakeParameter is an interface and eslit tells us that is 'is defined but never used'. I would suggest option 1 or 2, but can we do it in next PR?
// There are options:
// 1. We can change that one eslint rules
// 2. We can add rules "plugin:@typescript-eslint/recommended" to eslintrc.json, but it will require more changes
// 3. Leave like it is
// 4. Use 'function getScriptArguments(): [] {' instead of 'function getScriptArguments(): CakeParameter[] {'
// eslint-disable-next-line no-unused-vars
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
  var input: string = core.getInput('script-arguments');

  const yargsOptions = { configuration: { 'short-option-groups': false } };
  const options = yargsParser(input, yargsOptions);
  const optionsKeys: string[] = Object.keys(options);

  const result: CakeParameter[] = optionsKeys
    .filter(key => key !== '_') // we ignore that because of yargs-parser implementation
    .map(optionsKey => {
      const value = options[optionsKey];
      if (value === true) {
        return new CakeSwitch(optionsKey);
      }

      return new CakeArgument(optionsKey, value);
    });
  return result;
}

run();
