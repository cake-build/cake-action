import * as core from '@actions/core';
import * as action from './action';
import * as dotnet from './dotnet';
import * as exec from './exec';
import { isError, isString } from './guards';

export async function run() {
  try {
    const inputs = action.getInputs();
    const file = inputs.file;
    const version = inputs.cakeVersion;
    const bootstrap = inputs.cakeBootstrap;

    dotnet.disableTelemetry();
    dotnet.disableWelcomeMessage();

    switch (file.type) {
      case 'project':
        await exec.project(file.path, ...inputs.scriptArguments);
        break;
      case 'script': {
        await exec.script(file.path, version, bootstrap, ...inputs.scriptArguments);
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

run();
