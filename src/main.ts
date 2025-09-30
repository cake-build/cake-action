import * as core from '@actions/core';
import * as action from './action.js';
import * as dotnet from './dotnet.js';
import * as exec from './exec.js';
import { isError, isString } from './guards.js';

export async function run() {
  try {
    const inputs = action.getInputs();
    const buildFile = inputs.buildFile;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    switch (buildFile.type) {
      case 'project':
        await exec.project(buildFile.path, ...inputs.buildArguments);
        break;
      case 'file':
        await exec.file(buildFile.path, ...inputs.buildArguments);
        break;
      case 'script': {
        await exec.script(buildFile.path, version, bootstrap, ...inputs.buildArguments);
        break;
      }
    }
  } catch (error) {
    if (isError(error)) {
      core.setFailed(error.message);
    } else if (isString(error)) {
      core.setFailed(error);
    }
  }
}

void run();
