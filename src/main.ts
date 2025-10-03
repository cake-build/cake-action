import * as input from './input';
import * as dotnet from './dotnet';
import * as exec from './exec';
import * as action from './action';

export async function run() {
  try {
    const inputs = input.getInputs();
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
    action.setFailed(error);
  }
}

void run();
