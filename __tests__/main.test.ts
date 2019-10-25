import * as core from '@actions/core';
import { run } from '../src/main';
import { ToolsDirectory } from '../src/toolsDirectory';
import { DotNet } from '../src/dotnet';
import { CakeTool } from '../src/cake';
import { CakeArgument } from '../src/cakeParameter';

jest.mock('@actions/core');
jest.mock('../src/toolsDirectory');
jest.mock('../src/dotnet');
jest.mock('../src/cake');

describe('When running the action without any input arguments', () => {
  const fakeToolsDirectory = ToolsDirectory as jest.MockedClass<typeof ToolsDirectory>;
  const fakeDotNet = DotNet as jest.MockedClass<typeof DotNet>;
  const fakeCakeTool = CakeTool as jest.MockedClass<typeof CakeTool>;

  test('it should create the tools directory', async () => {
    await run();
    expect(fakeToolsDirectory.prototype.create).toBeCalled();
  });

  test('it should disable the .NET Core telemetry', async () => {
    await run();
    expect(fakeDotNet.disableTelemetry).toBeCalled();
  });

  test('it should install the Cake tool locally', async () => {
    await run();
    expect(fakeDotNet.installLocalCakeTool).toBeCalled();
  });

  test('it should run the default Cake script', async () => {
    await run();
    expect(fakeCakeTool.runScript).toBeCalled();
  });
});

describe('When running the action with the script path input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeCakeTool = CakeTool as jest.MockedClass<typeof CakeTool>;

  beforeAll(() => {
    fakeGetInput.mockReturnValue('path/to/script.cake');
  });

  test('it should run the specified Cake script', async () => {
    await run();
    expect(fakeGetInput).toBeCalledWith('script-path');
    expect(fakeCakeTool.runScript).toBeCalledWith(
      'path/to/script.cake',
      expect.anything(),
      expect.anything());
  });
});

describe('When running the action with the target input argument', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
  const fakeCakeTool = CakeTool as jest.MockedClass<typeof CakeTool>;

  beforeAll(() => {
    fakeGetInput.mockReturnValue('Task-To-Run');
  });

  test('it should run the specified Cake script', async () => {
    await run();
    expect(fakeGetInput).toBeCalledWith('target');
    expect(fakeCakeTool.runScript).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      new CakeArgument('target', 'Task-To-Run'));
  });
});

describe('When the script fails to run', () => {
  const fakeSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;

  beforeAll(() => {
    CakeTool.runScript = jest.fn(async () => {
      throw new Error('the error message');
    });
  });

  test('it should mark the action as failed with the specific error message', async () => {
    await run();
    expect(fakeSetFailed).toBeCalledWith('the error message');
  });
});
