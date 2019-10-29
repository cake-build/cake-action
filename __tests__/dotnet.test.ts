import * as path from 'path';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { DotNet } from '../src/dotnet';
import { Platform } from '../src/platform';
import { ToolsDirectory } from '../src/toolsDirectory';

const targetDirectory = path.join('target', 'directory');
const cakeVersion = '0.35.0';
const installedCakeVersion = '0.34.0';
const containsFileWithOldToolInstalled = (fileName: string) => {
  switch (fileName) {
    case 'dotnet-cake':
    case 'dotnet-cake.exe':
    case path.join('.store', 'cake.tool', installedCakeVersion, 'project.assets.json'):
      return true;
    default:
      return false;
  }
 };

jest.mock('@actions/core');
jest.mock('@actions/exec');

describe('When disabling the .NET Core telemetry', () => {
  const fakeExportVariable = core.exportVariable as jest.MockedFunction<typeof core.exportVariable>;

  test('it should set the DOTNET_CLI_TELEMETRY_OPTOUT environment variable to 1', () => {
    DotNet.disableTelemetry();
    expect(fakeExportVariable).toBeCalledWith('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
  });
});

describe('When successfully installing the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
    ToolsDirectory.prototype.containsFile = jest.fn().mockImplementation(() => {
      return false;
    });
  });

  test('it should install the Cake.Tool in the tools directory', async () => {
    await DotNet.installLocalCakeTool();
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should install the Cake.Tool in the specified target directory', async () => {
    await DotNet.installLocalCakeTool(new ToolsDirectory(targetDirectory));
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', targetDirectory, 'Cake.Tool']);
  });

  test('it should install specific version of the Cake.Tool in the tools directory', async () => {
    await DotNet.installLocalCakeTool(undefined, cakeVersion);
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--version', cakeVersion, '--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should install specific version of the Cake.Tool in the specified target directory', async () => {
    await DotNet.installLocalCakeTool(new ToolsDirectory(targetDirectory), cakeVersion);
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--version', cakeVersion, '--tool-path', targetDirectory, 'Cake.Tool']);
  });
});

describe('When failing to install the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the Cake.Tool name', async () => {
    await expect(DotNet.installLocalCakeTool()).rejects.toThrowError('Cake.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(DotNet.installLocalCakeTool()).rejects.toThrowError('-99');
  });

  test('it should throw an error containing the exit code', async () => {
    const directoryWithCakeTool = new ToolsDirectory(targetDirectory);
    directoryWithCakeTool.containsFile = jest.fn().mockImplementation(containsFileWithOldToolInstalled);
    await expect(DotNet.installLocalCakeTool(directoryWithCakeTool, cakeVersion)).rejects.toThrowError('-99');
  });
});

describe('When successfully installing a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should install the specified tool in the tools directory', async () => {
    await DotNet.installLocalTool('The.Tool', 'dotnet-tool');
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'tools', 'The.Tool']);
  });

  test('it should install the specified tool in the specified target directory', async () => {
    await DotNet.installLocalTool('The.Tool', 'dotnet-tool', new ToolsDirectory(targetDirectory));
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', targetDirectory, 'The.Tool']);
  });
});

describe('When failing to install the a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the package id', async () => {
    await expect(DotNet.installLocalTool('The.Tool', 'dotnet-tool')).rejects.toThrowError('The.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(DotNet.installLocalTool('The.Tool', 'dotnet-tool')).rejects.toThrowError('-99');
  });
});

describe('When installing the Cake Tool locally to a directory where it already exists', () => {
  const directoryWithCakeTool = new ToolsDirectory(targetDirectory);
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
     directoryWithCakeTool.containsFile = jest.fn().mockImplementation(containsFileWithOldToolInstalled);
     fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should not attempt to install the Cake.Tool in the same directory', () => {
    DotNet.installLocalCakeTool(directoryWithCakeTool);
    expect(fakeExec).not.toBeCalledWith(
      'dotnet tool install',
      ['--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
  });

  test('it should look for the Cake.Tool executable with extension on Windows', () => {
    Platform.isWindows = jest.fn().mockImplementation(() => true);
    DotNet.installLocalCakeTool(directoryWithCakeTool);
    expect(directoryWithCakeTool.containsFile).toBeCalledWith(expect.stringMatching('dotnet-cake.exe$'));
  });

  test('it should look for the Cake.Tool executable without extension on Posix', () => {
    Platform.isWindows = jest.fn().mockImplementation(() => false);
    DotNet.installLocalCakeTool(directoryWithCakeTool);
    expect(directoryWithCakeTool.containsFile).toBeCalledWith(expect.stringMatching('dotnet-cake$'));
  });

  test('it should uninstall and install specific version of the Cake.Tool in the specified target directory', async () => {
    await DotNet.installLocalCakeTool(directoryWithCakeTool, cakeVersion);
    expect(fakeExec).toBeCalledWith('dotnet tool uninstall', ['--tool-path', targetDirectory, 'Cake.Tool']);
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--version', cakeVersion, '--tool-path', targetDirectory, 'Cake.Tool']);
  });

  test('it should not uninstall and install already installed specific version of the Cake.Tool', async () => {
    await DotNet.installLocalCakeTool(directoryWithCakeTool, installedCakeVersion);
    expect(fakeExec).not.toBeCalledWith('dotnet tool uninstall', ['--tool-path', installedCakeVersion, 'Cake.Tool']);
    expect(fakeExec).not.toBeCalledWith('dotnet tool install', ['--version', installedCakeVersion, '--tool-path', targetDirectory, 'Cake.Tool']);
  });
});
