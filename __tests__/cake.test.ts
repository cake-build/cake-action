import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { CakeTool } from '../src/cake';
import { ToolsDirectory } from '../src/toolsDirectory';
import { CakeArgument, CakeSwitch } from '../src/cakeParameter';

const isRunningOnWindows = (require('os').platform() === 'win32');
const pathToLocalToolsDirectory = isRunningOnWindows ? 'path\\to\\tool' : 'path/to/tool';
const pathToLocalTool = isRunningOnWindows ? 'path\\to\\tool\\dotnet-cake' : 'path/to/tool/dotnet-cake';

jest.mock('@actions/exec');
jest.mock('@actions/io');

describe('When running a script successfully using the global Cake tool', () => {
  const fakeWhich = which as jest.MockedFunction<typeof which>;
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeWhich.mockReturnValue(Promise.resolve('/usr/bin/dotnet-cake'));
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the global dotnet-cake tool on the default script', async () => {
    await CakeTool.runScript();
    expect(fakeExec).toBeCalledWith('/usr/bin/dotnet-cake', ['build.cake']);
  });

  test('it should run the global dotnet-cake tool on the specified script', async () => {
    await CakeTool.runScript('script.cake');
    expect(fakeExec).toBeCalledWith('/usr/bin/dotnet-cake', ['script.cake']);
  });

  test('it should run the global dotnet-cake tool with the specified parameters', async () => {
    await CakeTool.runScript(
      'script.cake',
      undefined,
      new CakeArgument('param', 'arg'),
      new CakeSwitch('switch'));
    expect(fakeExec).toBeCalledWith(
      '/usr/bin/dotnet-cake',
      ['script.cake', '--param=arg', '--switch']);
  });

  test('it should run the global dotnet-cake tool without any invalid parameters', async () => {
    await CakeTool.runScript(
      'script.cake',
      undefined,
      new CakeArgument('', ''),
      new CakeSwitch('switch'));
    expect(fakeExec).toBeCalledWith(
      '/usr/bin/dotnet-cake',
      ['script.cake', '--switch']);
  });
});

describe('When running a script successfully using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the local dotnet-cake tool on the default script', async () => {
    await CakeTool.runScript(undefined, new ToolsDirectory(pathToLocalToolsDirectory));
    expect(fakeExec).toBeCalledWith(pathToLocalTool, ['build.cake']);
  });

  test('it should run the local dotnet-cake tool on the specified script', async () => {
    await CakeTool.runScript('script.cake', new ToolsDirectory(pathToLocalToolsDirectory));
    expect(fakeExec).toBeCalledWith(pathToLocalTool, ['script.cake']);
  });

  test('it should run the local dotnet-cake tool with the specified parameters', async () => {
    await CakeTool.runScript(
      'script.cake',
      new ToolsDirectory(pathToLocalToolsDirectory),
      new CakeArgument('param', 'arg'),
      new CakeSwitch('switch'));
    expect(fakeExec).toBeCalledWith(
      pathToLocalTool,
      ['script.cake', '--param=arg', '--switch']);
  });

  test('it should run the local dotnet-cake tool without any invalid parameters', async () => {
    await CakeTool.runScript(
      'script.cake',
      new ToolsDirectory(pathToLocalToolsDirectory),
      new CakeArgument('', ''),
      new CakeSwitch('switch'));
    expect(fakeExec).toBeCalledWith(
      pathToLocalTool,
      ['script.cake', '--switch']);
  });
});

describe('When failing to run a script using the global Cake tool', () => {
  const fakeWhich = which as jest.MockedFunction<typeof which>;
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeWhich.mockReturnValue(Promise.resolve('/usr/bin/dotnet-cake'));
    fakeExec.mockReturnValue(Promise.resolve(-21));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(CakeTool.runScript('script.cake')).rejects.toThrowError('-21');
  });
});

describe('When failing to run a script using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-21));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(CakeTool.runScript('script.cake', new ToolsDirectory())).rejects.toThrowError('-21');
  });
});
