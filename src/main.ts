import * as core from '@actions/core';
import * as action from './action';
import * as dotnet from './dotnet';
import * as exec from './exec';
import { isError, isString } from './guards';

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
