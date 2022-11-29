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

  test('it should set the DOTNET_CLI_TELEMETRY_OPTOUT environment variable to true', () => {
    dotnet.disableTelemetry();
    expect(fakeExportVariable).toHaveBeenCalledWith('DOTNET_CLI_TELEMETRY_OPTOUT', 'true');
  });
});

describe('When disabling the .NET Core CLI welcome message', () => {
  const fakeExportVariable = core.exportVariable as jest.MockedFunction<typeof core.exportVariable>;

  test('it should set the DOTNET_NOLOGO environment variable to true', () => {
    dotnet.disableWelcomeMessage();
    expect(fakeExportVariable).toHaveBeenCalledWith('DOTNET_NOLOGO', 'true');
  });
});

describe('When successfully installing a local tool', () => {
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

describe('When installing a local tool in a directory where it already exists', () => {
  const directoryWithTool = new ToolsDirectory(targetDirectory);
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    directoryWithTool.containsTool = jest.fn().mockImplementation(() => true);
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should not attempt to install the specified tool in the same directory', () => {
    dotnet.installLocalTool('The.Tool', 'dotnet-tool', directoryWithTool);
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      ['--tool-path', directoryWithTool.path, 'The.Tool']);
  });

  test('it should uninstall and install the specified version of the tool in the specified target directory', async () => {
    directoryWithTool.containsToolWithVersion = jest.fn().mockImplementation(() => false);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', directoryWithTool, 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      ['--tool-path', directoryWithTool.path, 'The.Tool']);
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      ['--version', 'theVersion', '--tool-path', directoryWithTool.path, 'The.Tool']);
  });

  test('it should not uninstall and install the already installed specific version of the tool', async () => {
    directoryWithTool.containsToolWithVersion = jest.fn().mockImplementation(() => true);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', directoryWithTool, 'theVersion');
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool uninstall',
      ['--tool-path', directoryWithTool.path, 'The.Tool']);
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      ['--version', 'theVersion', '--tool-path', directoryWithTool.path, 'The.Tool']);
  });
});

describe('When failing to install a local tool', () => {
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

describe('When successfully uninstalling a local tool', () => {
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

describe('When failing to uninstall a local tool', () => {
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

describe('When successfully restoring the local tools', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should restore all the local tools', async () => {
    await dotnet.restoreLocalTools();
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool restore');
  });
});

describe('When failing to restore the local tools', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.restoreLocalTools()).rejects.toThrow('-99');
  });
});
