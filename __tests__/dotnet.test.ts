import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { DotNet } from '../src/dotnet';
import { ToolsDirectory } from '../src/toolsDirectory';

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
  });

  test('it should install the Cake.Tool in the tools directory', async () => {
    await DotNet.installLocalCakeTool();
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'tools', 'Cake.Tool']);
  });

  test('it should install the Cake.Tool in the specified target directory', async () => {
    await DotNet.installLocalCakeTool(new ToolsDirectory('target/directory'));
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'target/directory', 'Cake.Tool']);
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
});

describe('When successfully installing a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(0));
  });

  test('it should install the specified tool in the tools directory', async () => {
    await DotNet.installLocalTool('The.Tool');
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'tools', 'The.Tool']);
  });

  test('it should install the specified tool in the specified target directory', async () => {
    await DotNet.installLocalTool('The.Tool', new ToolsDirectory('target/directory'));
    expect(fakeExec).toBeCalledWith('dotnet tool install', ['--tool-path', 'target/directory', 'The.Tool']);
  });
});

describe('When failing to install the a tool locally', () => {
  const fakeExec = exec as jest.MockedFunction<typeof exec>;

  beforeAll(() => {
    fakeExec.mockReturnValue(Promise.resolve(-99));
  });

  test('it should throw an error containing the tool name', async () => {
    await expect(DotNet.installLocalTool('The.Tool')).rejects.toThrowError('The.Tool');
  });

  test('it should throw an error containing the exit code', async () => {
    await expect(DotNet.installLocalTool('The.Tool')).rejects.toThrowError('-99');
  });
});
