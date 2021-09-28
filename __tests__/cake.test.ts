import * as path from 'path';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import * as cake from '../src/cake';
import { ToolsDirectory } from '../src/toolsDirectory';
import { CakeToolSettings } from '../src/cakeToolSettings';
import { CakeArgument, CakeSwitch } from '../src/cakeParameter';

const pathToLocalToolsDirectory = path.join('path', 'to', 'tool');
const pathToLocalTool = path.join(pathToLocalToolsDirectory, 'dotnet-cake');
const dotnetManifestCake = 'dotnet tool run dotnet-cake';

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
    await cake.runScript();
    expect(fakeExec).toHaveBeenCalledWith('/usr/bin/dotnet-cake', ['build.cake']);
  });

  test('it should run the global dotnet-cake tool on the specified script', async () => {
    await cake.runScript('script.cake');
    expect(fakeExec).toHaveBeenCalledWith('/usr/bin/dotnet-cake', ['script.cake']);
  });

  test('it should run the global dotnet-cake tool with the specified parameters', async () => {
    await cake.runScript(
      'script.cake',
      undefined,
      new CakeArgument('param', 'arg'),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
      '/usr/bin/dotnet-cake',
      ['script.cake', '--param=arg', '--switch']);
  });

  test('it should run the global dotnet-cake tool without any invalid parameters', async () => {
    await cake.runScript(
      'script.cake',
      undefined,
      new CakeArgument('', ''),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
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
    await cake.runScript(undefined, new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)));
    expect(fakeExec).toHaveBeenCalledWith(pathToLocalTool, ['build.cake']);
  });

  test('it should run the local dotnet-cake tool on the specified script', async () => {
    await cake.runScript('script.cake', new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)));
    expect(fakeExec).toHaveBeenCalledWith(pathToLocalTool, ['script.cake']);
  });

  test('it should run the local dotnet-cake tool with the specified parameters', async () => {
    await cake.runScript(
      'script.cake',
      new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)),
      new CakeArgument('param', 'arg'),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
      pathToLocalTool,
      ['script.cake', '--param=arg', '--switch']);
  });

  test('it should run the local dotnet-cake tool without any invalid parameters', async () => {
    await cake.runScript(
      'script.cake',
      new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)),
      new CakeArgument('', ''),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
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
    await expect(cake.runScript('script.cake')).rejects.toThrow('-21');
  });
});

describe('When failing to run a script using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-21));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(cake.runScript('script.cake', new CakeToolSettings(new ToolsDirectory()))).rejects.toThrow('-21');
  });
});

describe('When bootstrapping a script successfully using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the local dotnet-cake tool on the default script', async () => {
    await cake.bootstrapScript(undefined, new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)));
    expect(fakeExec).toHaveBeenCalledWith(pathToLocalTool, ['build.cake', '--bootstrap']);
  });

  test('it should run the local dotnet-cake tool on the specified script', async () => {
    await cake.bootstrapScript('script.cake', new CakeToolSettings(new ToolsDirectory(pathToLocalToolsDirectory)));
    expect(fakeExec).toHaveBeenCalledWith(pathToLocalTool, ['script.cake', '--bootstrap']);
  });
});

describe('When failing to bootstrap a script using the local Cake tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-21));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(cake.bootstrapScript('script.cake', new CakeToolSettings(new ToolsDirectory()))).rejects.toThrow('-21');
  });
});

describe('When running a script successfully using the tool manifest', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(async () => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should run the local dotnet-cake tool on the default script', async () => {
    await cake.runScript(undefined, new CakeToolSettings(undefined, true));
    expect(fakeExec).toHaveBeenCalledWith(dotnetManifestCake, ['build.cake']);
  });

  test('it should run the local dotnet-cake tool on the specified script', async () => {
    await cake.runScript('script.cake', new CakeToolSettings(undefined, true));
    expect(fakeExec).toHaveBeenCalledWith(dotnetManifestCake, ['script.cake']);
  });

  test('it should run the local dotnet-cake tool with the specified parameters', async () => {
    await cake.runScript(
      'script.cake',
      new CakeToolSettings(undefined, true),
      new CakeArgument('param', 'arg'),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
      dotnetManifestCake,
      ['script.cake', '--param=arg', '--switch']);
  });

  test('it should run the local dotnet-cake tool without any invalid parameters', async () => {
    await cake.runScript(
      'script.cake',
      new CakeToolSettings(undefined, true),
      new CakeArgument('', ''),
      new CakeSwitch('switch'));
    expect(fakeExec).toHaveBeenCalledWith(
      dotnetManifestCake,
      ['script.cake', '--switch']);
  });
});
