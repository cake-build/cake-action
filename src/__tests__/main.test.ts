import * as core from '@actions/core';
import * as action from '../action';
import * as dotnet from '../dotnet';
import * as cakeTool from '../cakeTool';
import * as cake from '../cake';
import { ToolsDirectory } from '../toolsDirectory';
import { CakeArgument } from '../cakeParameter';
import { run } from '../main';

jest.mock('@actions/core');
jest.mock('../action');
jest.mock('../dotnet');
jest.mock('../cakeTool');
jest.mock('../cake');
jest.mock('../toolsDirectory');

describe('When running the action without any input arguments', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeToolsDirectory = ToolsDirectory as jest.MockedClass<typeof ToolsDirectory>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      buildFile: { type: 'script', path: 'build.cake' },
      buildArguments: []
    });
  });

  test('it should create the tools directory', async () => {
    await run();
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
      buildFile: { type: 'script', path: 'path/to/script.cake' },
      buildArguments: []
    });
  });

  test('it should run the specified Cake script', async () => {
    await run();
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/script.cake');
  });
});

describe('When running the action with the csproj path input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunProject = cake.runProject as jest.MockedFunction<typeof cake.runProject>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      buildFile: { type: 'project', path: 'path/to/build.csproj' },
      buildArguments: []
    });
  });

  test('it should run the Cake Frosting Project', async () => {
    await run();
    expect(cake.runProject).toHaveBeenCalled();
  });

  test('it should run the specified Cake Frosting project', async () => {
    await run();
    expect(fakeRunProject.mock.calls[0][0]).toBe('path/to/build.csproj');
  });
});

describe('When running the action with tool-manifest as the Cake version input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeInstallCakeTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      buildFile: { type: 'script', path: 'build.cake' },
      cakeVersion: { version: 'tool-manifest' },
      buildArguments: []
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
      buildFile: { type: 'script', path: 'build.cake' },
      cakeVersion: { version: 'latest' },
      buildArguments: []
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
      buildFile: { type: 'script', path: 'build.cake' },
      cakeVersion: { version: 'specific', number: 'the.version.number' },
      buildArguments: []
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
      buildFile: { type: 'script', path: 'build.cake' },
      cakeBootstrap: 'auto',
      buildArguments: []
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
      buildFile: { type: 'script', path: 'custom.cake' },
      cakeBootstrap: 'explicit',
      buildArguments: []
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
      buildFile: { type: 'script', path: 'build.cake' },
      cakeBootstrap: 'skip',
      buildArguments: []
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
      buildFile: { type: 'script', path: 'build.cake' },
      buildArguments: [new CakeArgument('target', 'Task-To-Run')]
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
      buildFile: { type: 'script', path: 'build.cake' },
      buildArguments: [new CakeArgument('verbosity', 'Verbosity-Level')]
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
      buildFile: { type: 'script', path: 'build.cake' },
      buildArguments: [
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
    fakeRunScript.mockImplementation(() => {
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
    fakeRunScript.mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'the error message';
    });
  });

  test('it should mark the action as failed with the specific error message', async () => {
    await run();
    expect(fakeSetFailed).toHaveBeenCalledWith('the error message');
  });
});

describe('When running the action with the file path input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRunFile = cake.runFile as jest.MockedFunction<typeof cake.runFile>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      buildFile: { type: 'file', path: 'path/to/file.cs' },
      buildArguments: [new CakeArgument('target', 'Task-To-Run')]
    });
  });

  test('it should run the specified Cake file', async () => {
    await run();
    expect(fakeRunFile).toHaveBeenCalledWith('path/to/file.cs', expect.any(ToolsDirectory), expect.any(CakeArgument));
  });

  test('it should run script with the specified target', async () => {
    await run();
    expect(fakeRunFile.mock.calls[0][2]).toMatchObject(
      new CakeArgument('target', 'Task-To-Run'));
  });
});
