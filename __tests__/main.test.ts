import * as core from '@actions/core';
import { run } from '../src/main';
import { ToolsDirectory } from '../src/toolsDirectory';
import * as action from '../src/action';
import * as dotnet from '../src/dotnet';
import * as cake from '../src/cake';
import { CakeArgument } from '../src/cakeParameter';

jest.mock('@actions/core');
jest.mock('../src/toolsDirectory');
jest.mock('../src/action');
jest.mock('../src/dotnet');
jest.mock('../src/cake');

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
    expect(dotnet.installLocalCakeTool).toHaveBeenCalled();
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

describe('When running the action with the Cake version input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeInstallLocalCakeTool =
    dotnet.installLocalCakeTool as jest.MockedFunction<typeof dotnet.installLocalCakeTool>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      cakeVersion: 'the.version.number',
      scriptArguments: []
    });
  });

  test('it should install the specified version of Cake', async () => {
    await run();
    expect(fakeInstallLocalCakeTool.mock.calls[0][1]).toBe('the.version.number');
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

describe('When the script fails to run', () => {
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

describe('When running the action with the cake-bootstrap input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptPath: 'custom.cake',
      cakeBootstrap: true,
      scriptArguments: []
    });
  });

  test('it should bootstrap the default Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).toHaveBeenCalled();
  });

  test('it should bootstrap the specified Cake script', async () => {
    await run();
    expect(fakeBootstrapScript).toHaveBeenCalledWith(
      'custom.cake',
      expect.anything());
  });
});

describe('When running the action with the Cake tool manifest input argument', () => {
  const fakeGetInputs = action.getInputs as jest.MockedFunction<typeof action.getInputs>;
  const fakeRestoreTool = dotnet.restoreTool as jest.MockedFunction<typeof dotnet.restoreTool>;

  beforeAll(() => {
    fakeGetInputs.mockReturnValue({
      scriptArguments: [],
      cakeVersion: true
    });
  });

  test('it should restore dotnet tools', async () => {
    await run();
    expect(fakeRestoreTool).toHaveBeenCalled();
  });
});
