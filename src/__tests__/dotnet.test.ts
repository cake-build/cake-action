import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as dotnet from '../dotnet';
import { ToolsDirectory } from '../toolsDirectory';

const toolsDirectory = new ToolsDirectory('path/to/tools');

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
    fakeExec.mockResolvedValue(0);
  });

  test('it should install the specified tool', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['The.Tool'])
    );
  });

  test('it should install the tool in the tools directory', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['--tool-path', 'tools'])
    );
  });

  test('it should install the tool in the specified target directory', async () => {
    toolsDirectory.containsTool = jest.fn().mockImplementation(() => false);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', toolsDirectory);
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['--tool-path', toolsDirectory.path])
    );
  });

  test('it should install the specified version of the tool', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', undefined, 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['--version', 'theVersion'])
    );
  });

  test('it should install the tool using minimal verbosity', async () => {
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['--verbosity', 'minimal'])
    );
  });
});

describe('When installing a local tool in a directory where it already exists', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockResolvedValue(0);
  });

  test('it should not attempt to install the specified tool in the same directory', async () => {
    toolsDirectory.containsTool = jest.fn().mockImplementation(() => true);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', toolsDirectory);
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining(['--tool-path', toolsDirectory.path, 'The.Tool'])
    );
  });

  test('it should uninstall and install the specified version of the tool in the specified target directory', async () => {
    toolsDirectory.containsToolWithVersion = jest.fn().mockImplementation(() => false);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', toolsDirectory, 'theVersion');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      expect.arrayContaining(['--tool-path', toolsDirectory.path, 'The.Tool'])
    );
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining([
        '--version',
        'theVersion',
        '--tool-path',
        toolsDirectory.path,
        'The.Tool',
      ])
    );
  });

  test('it should not uninstall and install the already installed specific version of the tool', async () => {
    toolsDirectory.containsToolWithVersion = jest.fn().mockImplementation(() => true);
    await dotnet.installLocalTool('The.Tool', 'dotnet-tool', toolsDirectory, 'theVersion');
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool uninstall',
      expect.arrayContaining(['--tool-path', toolsDirectory.path, 'The.Tool'])
    );
    expect(fakeExec).not.toHaveBeenCalledWith(
      'dotnet tool install',
      expect.arrayContaining([
        '--version',
        'theVersion',
        '--tool-path',
        toolsDirectory.path,
        'The.Tool',
      ])
    );
  });
});

describe('When failing to install a local tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockResolvedValue(-99);
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
    fakeExec.mockResolvedValue(0);
  });

  test('it should uninstall the specified tool', async () => {
    await dotnet.uninstallLocalTool('The.Tool');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      expect.arrayContaining(['The.Tool'])
    );
  });

  test('it should uninstall the tool from the tools directory', async () => {
    await dotnet.uninstallLocalTool('The.Tool');
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      expect.arrayContaining(['--tool-path', 'tools'])
    );
  });

  test('it should uninstall the tool from the specified target directory', async () => {
    await dotnet.uninstallLocalTool('The.Tool', toolsDirectory);
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool uninstall',
      expect.arrayContaining(['--tool-path', toolsDirectory.path])
    );
  });
});

describe('When failing to uninstall a local tool', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockResolvedValue(-99);
  });

  test('it should throw an error containing the package id', async () => {
    await expect(dotnet.uninstallLocalTool('The.Tool')).rejects.toThrow('The.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.uninstallLocalTool('The.Tool', toolsDirectory)).rejects.toThrow('-99');
  });
});

describe('When successfully restoring the local tools', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockResolvedValue(0);
  });

  test('it should restore all the local tools', async () => {
    await dotnet.restoreLocalTools();
    expect(fakeExec).toHaveBeenCalledWith('dotnet tool restore', expect.anything());
  });

  test('it should restore the local tools using minimal verbosity', async () => {
    await dotnet.restoreLocalTools();
    expect(fakeExec).toHaveBeenCalledWith(
      'dotnet tool restore',
      expect.arrayContaining(['--verbosity', 'minimal'])
    );
  });
});

describe('When failing to restore the local tools', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockResolvedValue(-99);
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(dotnet.restoreLocalTools()).rejects.toThrow('-99');
  });
});
