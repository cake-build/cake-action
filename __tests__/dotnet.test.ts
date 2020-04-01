import * as path from 'path';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as dotnet from '../src/dotnet';
import { ToolsDirectory } from '../src/toolsDirectory';

const targetDirectory = path.join('target', 'directory');

jest.mock('@actions/core');
jest.mock('@actions/exec');

describe('When disabling the .NET Core telemetry', () => {
  const fakeExportVariable = core.exportVariable as jest.MockedFunction<typeof core.exportVariable>;

  test('it should set the DOTNET_CLI_TELEMETRY_OPTOUT environment variable to 1', () => {
    dotnet.disableTelemetry();
    expect(fakeExportVariable).toHaveBeenCalledWith('DOTNET_CLI_TELEMETRY_OPTOUT', '1');
  });
});

describe('When successfully installing the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
    ToolsDirectory.prototype.containsTool = jest.fn().mockImplementation(() => false);
    ToolsDirectory.prototype.containsToolWithVersion = jest.fn().mockImplementation(() => false);
  });

  test('it should install the Cake.Tool in the tools directory', async () => {
    await dotnet.installLocalCakeTool();
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should install the Cake.Tool in the specified target directory', async () => {
    await dotnet.installLocalCakeTool(new ToolsDirectory(targetDirectory));
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--tool-path', targetDirectory, 'Cake.Tool']);
  });

  test('it should install a specific version of the Cake.Tool in the tools directory', async () => {
    await dotnet.installLocalCakeTool(undefined, 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--version', 'theVersion', '--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should install a specific version of the Cake.Tool in the specified target directory', async () => {
    await dotnet.installLocalCakeTool(new ToolsDirectory(targetDirectory), 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--version', 'theVersion', '--tool-path', targetDirectory, 'Cake.Tool']);
  });

  test('it should not attempt to uninstall the Cake.Tool', async () => {
    await dotnet.installLocalCakeTool(new ToolsDirectory(targetDirectory), 'theVersion');
    expect(fakeExec).not.toHaveBeenCalledWith('dotnet tool uninstall', expect.arrayContaining(['Cake.Tool']));
  });
});

describe('When failing to install the Cake Tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the Cake.Tool name', async () => {
    await expect(dotnet.installLocalCakeTool()).rejects.toThrow('Cake.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.installLocalCakeTool()).rejects.toThrow('-99');
  });

  test('it should throw an error containing the exit code regardless of the version', async () => {
    await expect(dotnet.installLocalCakeTool(new ToolsDirectory(), 'theVersion')).rejects.toThrow('-99');
  });
});

describe('When successfully installing a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should install the specified tool in the tools directory', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool');
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--tool-path', 'tools', 'The.Tool']);
  });

  test('it should install the specified tool in the specified target directory', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', new ToolsDirectory(targetDirectory));
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool install', ['--tool-path', targetDirectory, 'The.Tool']);
  });
});

describe('When failing to install a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the package id', async () => {
    await expect(dotnet.installLocalTool('The.Tool', 'dotnet-tool')).rejects.toThrow('The.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.installLocalTool('The.Tool', 'dotnet-tool')).rejects.toThrow('-99');
  });
});

describe('When installing the Cake Tool locally to a directory where it already exists', () => {
  const directoryWithCakeTool = new ToolsDirectory(targetDirectory);
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    directoryWithCakeTool.containsTool = jest.fn().mockImplementation(() => true);
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should not attempt to install the Cake.Tool in the same directory', () => {
    dotnet.installLocalCakeTool(directoryWithCakeTool);
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      ['--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
  });

  test('it should uninstall and install the specified version of the Cake.Tool in the specified target directory', async () => {
    directoryWithCakeTool.containsToolWithVersion = jest.fn().mockImplementation(() => false);
    await dotnet.installLocalCakeTool(directoryWithCakeTool, 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      ['--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      ['--version', 'theVersion', '--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
  });

  test('it should not uninstall and install the already installed specific version of the Cake.Tool', async () => {
    directoryWithCakeTool.containsToolWithVersion = jest.fn().mockImplementation(() => true);
    await dotnet.installLocalCakeTool(directoryWithCakeTool, 'theVersion');
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool uninstall',
      ['--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      ['--version', 'theVersion', '--tool-path', directoryWithCakeTool.path, 'Cake.Tool']);
  });
});

describe('When successfully uninstalling a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should uninstall the specified tool from the tools directory', async () => {
    await dotnet.uninstallLocalTool('The.Tool');
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool uninstall', ['--tool-path', 'tools', 'The.Tool']);
  });

  test('it should uninstall the specified tool from the specified target directory', async () => {
    await dotnet.uninstallLocalTool('The.Tool', new ToolsDirectory(targetDirectory));
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool uninstall', ['--tool-path', targetDirectory, 'The.Tool']);
  });
});

describe('When failing to uninstall a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the package id', async () => {
    await expect(dotnet.uninstallLocalTool('The.Tool')).rejects.toThrow('The.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.uninstallLocalTool('The.Tool', new ToolsDirectory(targetDirectory))).rejects.toThrow('-99');
  });
});
