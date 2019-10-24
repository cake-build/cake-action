import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { CakeTool } from "../src/cake";
import { ToolsDirectory } from '../src/toolsDirectory';
import { CakeArgument, CakeSwitch } from '../src/cakeParameter';

jest.mock('@actions/exec');
jest.mock('@actions/io');

describe('When successfully installing the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should invoke the dotnet tool install command with the tools directory', async () => {
    await CakeTool.installLocally();
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should invoke the dotnet tool install command with the specified target directory', async () => {
    await CakeTool.installLocally(new ToolsDirectory('target/directory'));
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'target/directory', 'Cake.Tool']);
  });
});

describe('When failing to install the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(CakeTool.installLocally()).rejects.toThrowError('-99');
  });
});

describe('When running a script successfully using the global Cake tool', () => {
  const fakeWhich = which as jest.MockedFunction<typeof which>;
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeWhich.mockReturnValue(Promise.resolve('/usr/bin/dotnet-cake'));
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the global dotnet-cake tool on the specified script', async () => {
    await CakeTool.runScript('build.cake');
    expect(fakeExec).toBeCalledWith('/usr/bin/dotnet-cake', ['build.cake']);
  });

  test('it should run the global dotnet-cake tool with the specified parameters', async () => {
    await CakeTool.runScript(
      'build.cake',
      undefined,
      new CakeArgument('param', 'arg'),
      new CakeSwitch("switch"));
    expect(fakeExec).toBeCalledWith(
      '/usr/bin/dotnet-cake',
      ['build.cake', '--param=arg', '--switch']);
  });

  test('it should run the global dotnet-cake tool without any invalid parameters', async () => {
    await CakeTool.runScript(
      'build.cake',
      undefined,
      new CakeArgument('', ''),
      new CakeSwitch("switch"));
    expect(fakeExec).toBeCalledWith(
      '/usr/bin/dotnet-cake',
      ['build.cake', '--switch']);
  });
});

describe('When running a script successfully using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the local dotnet-cake tool on the specified script', async () => {
    await CakeTool.runScript('build.cake', new ToolsDirectory('path/to/tool'));
    expect(fakeExec).toBeCalledWith('path/to/tool/dotnet-cake', ['build.cake']);
  });

  test('it should run the local dotnet-cake tool with the specified parameters', async () => {
    await CakeTool.runScript(
      'build.cake',
      new ToolsDirectory('path/to/tool'),
      new CakeArgument('param', 'arg'),
      new CakeSwitch("switch"));
    expect(fakeExec).toBeCalledWith(
      'path/to/tool/dotnet-cake',
      ['build.cake', '--param=arg', '--switch']);
  });

  test('it should run the local dotnet-cake tool without any invalid parameters', async () => {
    await CakeTool.runScript(
      'build.cake',
      new ToolsDirectory('path/to/tool'),
      new CakeArgument('', ''),
      new CakeSwitch("switch"));
    expect(fakeExec).toBeCalledWith(
      'path/to/tool/dotnet-cake',
      ['build.cake', '--switch']);
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
    await expect(CakeTool.runScript('build.cake')).rejects.toThrowError('-21');
  });
});

describe('When failing to run a script using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-21));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(CakeTool.runScript('build.cake', new ToolsDirectory())).rejects.toThrowError('-21');
  });
});
