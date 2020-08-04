import * as core from '@actions/core';
import { when } from 'jest-when';
import { run } from '../src/main';
import { ToolsDirectory } from '../src/toolsDirectory';
import * as dotnet from '../src/dotnet';
import * as cake from '../src/cake';
import { CakeArgument } from '../src/cakeParameter';

jest.mock('@actions/core');
jest.mock('../src/toolsDirectory');
jest.mock('../src/dotnet');
jest.mock('../src/cake');

describe('When running the action without any input arguments', () => {
  const fakeToolsDirectory = ToolsDirectory as jest.MockedClass<typeof ToolsDirectory>;

  test('it should create the tools directory', async () => {
    await run();
    expect(fakeToolsDirectory.prototype.create).toHaveBeenCalled();
  });

  test('it should disable the .NET Core telemetry', async () => {
    await run();
    expect(dotnet.disableTelemetry).toHaveBeenCalled();
  });

  test('it should disable the .NET Core CLI welcome message', async () => {
    await run();
    expect(dotnet.disableWelcomeMessage).toHaveBeenCalled();
  });

  test('it should install the Cake tool locally', async () => {
    await run();
    expect(dotnet.installLocalCakeTool).toHaveBeenCalled();
  });

  test('it should run the default Cake script', async () => {
    await run();
    expect(cake.runScript).toHaveBeenCalled();
  });
});

describe('When running the action with the script path input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('path/to/script.cake');
  });

  test('it should run the specified Cake script', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/script.cake');
  });
});

describe('When running the action with the Cake version input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeInstallLocalCakeTool =
    dotnet.installLocalCakeTool as jest.MockedFunction<typeof dotnet.installLocalCakeTool>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('the.version.number');
  });

  test('it should install the specified version of Cake', async () => {
    await run();
    expect(fakeInstallLocalCakeTool.mock.calls[0][1]).toBe('the.version.number');
  });
});

describe('When running the action with the target input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('target').mockReturnValue('Task-To-Run');
  });

  test('it should run script with the specified target', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][2]).toMatchObject(
      new CakeArgument('target', 'Task-To-Run'));
  });
});

describe('When running the action with the verbosity input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('verbosity').mockReturnValue('Verbosity-Level');
  });

  test('it should run the script with the specified verbosity level', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][3]).toMatchObject(
      new CakeArgument('verbosity', 'Verbosity-Level'));
  });
});

describe('When the script fails to run', () => {
  const fakeSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    when(fakeRunScript).calledWith(expect.anything()).mockImplementation(async () => {
      throw new Error('the error message');
    });
  });

  test('it should mark the action as failed with the specific error message', async () => {
    await run();
    expect(fakeSetFailed).toHaveBeenCalledWith('the error message');
  });
});

describe('When running the action with the cake-bootstrap input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('true');
  });

  test('it should bootstrap the default Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).toHaveBeenCalled();
  });

  test('it should bootstrap the specified Cake script', async () => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('custom.cake');
    await run();
    expect(fakeBootstrapScript).toHaveBeenCalledWith(
      'custom.cake',
      expect.anything());
  });
});
