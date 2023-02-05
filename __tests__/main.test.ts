import * as core from '@actions/core';
import * as action from '../src/action';
import * as dotnet from '../src/dotnet';
import * as cakeTool from '../src/cakeTool';
import * as cake from '../src/cake';
import { ToolsDirectory } from '../src/toolsDirectory';
import { CakeArgument } from '../src/cakeParameter';
import { run } from '../src/main';

jest.mock('@actions/core');
jest.mock('../src/action');
jest.mock('../src/dotnet');
jest.mock('../src/cakeTool');
jest.mock('../src/cake');
jest.mock('../src/toolsDirectory');

describe('When running the action without any input arguments', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeToolsDirectory = ToolsDirectory as jest.MockedClass<typeof ToolsDirectory>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptArguments: []
    });
  });

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
    expect(cakeTool.install).toHaveBeenCalled();
  });

  test('it should run the default Cake script', async () => {
    await run();
    expect(cake.runScript).toHaveBeenCalled();
  });
});

describe('When running the action with the script path input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptPath: 'path/to/script.cake',
      scriptArguments: []
    });
  });

  test('it should run the specified Cake script', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/script.cake');
  });
});

describe('When running the action with tool-manifest as the Cake version input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeInstallCakeTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeVersion: { version: 'tool-manifest' },
      scriptArguments: []
    });
  });

  test('it should install Cake from the tool manifest', async () => {
    await run();
    expect(fakeInstallCakeTool.mock.calls[0][1]).toMatchObject({ version: 'tool-manifest' });
  });
});

describe('When running the action with latest as the Cake version input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeInstallCakeTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeVersion: { version: 'latest' },
      scriptArguments: []
    });
  });

  test('it should install the latest version of Cake', async () => {
    await run();
    expect(fakeInstallCakeTool.mock.calls[0][1]).toMatchObject({ version: 'latest' });
  });
});

describe('When running the action with a specific version as the Cake version input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeInstallCakeTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeVersion: { version: 'specific', number: 'the.version.number' },
      scriptArguments: []
    });
  });

  test('it should install the specified version of Cake', async () => {
    await run();
    expect(fakeInstallCakeTool.mock.calls[0][1]).toMatchObject({
      version: 'specific',
      number: 'the.version.number'
    });
  });
});

describe('When running the action with auto as the Cake bootstrap input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeBootstrap: 'auto',
      scriptArguments: []
    });
  });

  test('it should not bootstrap the Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).not.toHaveBeenCalled();
  });
});

describe('When running the action with explicit as the Cake bootstrap input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptPath: 'custom.cake',
      cakeBootstrap: 'explicit',
      scriptArguments: []
    });
  });

  test('it should bootstrap the specified Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).toHaveBeenCalledWith('custom.cake', expect.anything());
  });
});

describe('When running the action with skip as the Cake bootstrap input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeBootstrap: 'skip',
      scriptArguments: []
    });
  });

  test('it should not bootstrap the Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).not.toHaveBeenCalled();
  });
});

describe('When running the action with the target input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptArguments: [new CakeArgument('target', 'Task-To-Run')]
    });
  });

  test('it should run script with the specified target', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][2]).toMatchObject(
      new CakeArgument('target', 'Task-To-Run'));
  });
});

describe('When running the action with the verbosity input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptArguments: [new CakeArgument('verbosity', 'Verbosity-Level')]
    });
  });

  test('it should run the script with the specified verbosity level', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][2]).toMatchObject(
      new CakeArgument('verbosity', 'Verbosity-Level'));
  });
});

describe('When running the action with custom script input arguments', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptArguments: [
        new CakeArgument('string-parameter', '\'value\''),
        new CakeArgument('numeric-parameter', '3'),
        new CakeArgument('boolean-parameter', 'true'),
      ]
    });
  });

  test('it should run the script with the specified custom string parameter', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][2]).toMatchObject(
      new CakeArgument('string-parameter', '\'value\''));
  });

  test('it should run the script with the specified custom numeric parameter', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][3]).toMatchObject(
      new CakeArgument('numeric-parameter', '3'));
  });

  test('it should run the script with the specified custom boolean parameter', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][4]).toMatchObject(
      new CakeArgument('boolean-parameter', 'true'));
  });
});

describe('When the script fails with an Error object', () => {
  const fakeSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeRunScript.mockImplementation(async () => {
      throw new Error('the error message');
    });
  });

  test('it should mark the action as failed with the specific error message', async () => {
    await run();
    expect(fakeSetFailed).toHaveBeenCalledWith('the error message');
  });
});

describe('When the script fails with a string', () => {
  const fakeSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeAll(() => {
    fakeRunScript.mockImplementation(async () => {
      throw 'the error message';
    });
  });

  test('it should mark the action as failed with the specific error message', async () => {
    await run();
    expect(fakeSetFailed).toHaveBeenCalledWith('the error message');
  });
});
