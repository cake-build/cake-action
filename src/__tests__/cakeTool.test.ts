import * as path from 'path';
import * as cakeTool from '../cakeTool';
import * as dotnet from '../dotnet';
import { ToolsDirectory } from '../toolsDirectory';

const targetDirectory = path.join('target', 'directory');

jest.mock('../dotnet');

describe('When installing the Cake.Tool based on the tool manifest', () => {
  const fakeRestoreTool = dotnet.restoreLocalTools as jest.MockedFunction<typeof dotnet.restoreLocalTools>;
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;

  beforeEach(async () => {
    await cakeTool.install(undefined, { version: 'tool-manifest' });
  });

  test('it should restore the local tools from the tool manifest', () => {
    expect(fakeRestoreTool).toHaveBeenCalled();
  });

  test('it should not explicitly install any local tools', () => {
    expect(fakeInstallLocalTool).not.toHaveBeenCalled();
  });
});

describe('When installing the Cake.Tool without a version number', () => {
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;

  test('it should install the Cake.Tool in the tools directory', async () => {
    await cakeTool.install();
    expect(fakeInstallLocalTool).toHaveBeenCalled();
    expect(fakeInstallLocalTool.mock.calls[0].slice(0, 3)).toEqual(['Cake.Tool', 'dotnet-cake', new ToolsDirectory()]);
  });

  test('it should install the Cake.Tool without a version number', async () => {
    const targetDir = new ToolsDirectory(targetDirectory);
    await cakeTool.install(targetDir);
    expect(fakeInstallLocalTool).toHaveBeenCalledWith('Cake.Tool', 'dotnet-cake', expect.anything(), undefined);
  });
});

describe('When installing the Cake.Tool with the latest version', () => {
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;

  test('it should install the Cake.Tool in the tools directory', async () => {
    await cakeTool.install(undefined, { version: 'latest' });
    expect(fakeInstallLocalTool).toHaveBeenCalled();
    expect(fakeInstallLocalTool.mock.calls[0].slice(0, 3)).toEqual(['Cake.Tool', 'dotnet-cake', new ToolsDirectory()]);
  });

  test('it should install the Cake.Tool without a version number', async () => {
    const targetDir = new ToolsDirectory(targetDirectory);
    await cakeTool.install(targetDir, { version: 'latest' });
    expect(fakeInstallLocalTool).toHaveBeenCalledWith('Cake.Tool', 'dotnet-cake', expect.anything(), undefined);
  });
});

describe('When installing a specific version of the Cake.Tool', () => {
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;

  test('it should install the Cake.Tool in the tools directory', async () => {
    await cakeTool.install(undefined, { version: 'specific', number: 'the.version.number' });
    expect(fakeInstallLocalTool).toHaveBeenCalled();
    expect(fakeInstallLocalTool.mock.calls[0].slice(0, 3)).toEqual(['Cake.Tool', 'dotnet-cake', new ToolsDirectory()]);
  });

  test('it should install the Cake.Tool in the specified target directory', async () => {
    const targetDir = new ToolsDirectory(targetDirectory);
    await cakeTool.install(targetDir, { version: 'specific', number: 'the.version.number' });
    expect(fakeInstallLocalTool.mock.calls[0].slice(0, 3)).toEqual(['Cake.Tool', 'dotnet-cake', targetDir]);
  });

  test('it should install the specified version of the Cake.Tool', async () => {
    await cakeTool.install(undefined, { version: 'specific', number: 'the.version.number' });
    expect(fakeInstallLocalTool).toHaveBeenCalledWith(
      'Cake.Tool',
      'dotnet-cake',
      expect.anything(),
      'the.version.number'
    );
  });
});

describe('When failing to install the Cake.Tool based on the tool manifest', () => {
  const fakeRestoreTool = dotnet.restoreLocalTools as jest.MockedFunction<typeof dotnet.restoreLocalTools>;
  const installError = new Error('Failed to install Cake.Tool');

  beforeAll(() => {
    fakeRestoreTool.mockRejectedValue(installError);
  });

  test('it should throw the error returned from the restore tool function', async () => {
    await expect(cakeTool.install(undefined, { version: 'tool-manifest' })).rejects.toThrow(installError);
  });
});

describe('When failing to install the Cake.Tool without a version number', () => {
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;
  const installError = new Error('Failed to install Cake.Tool');

  beforeAll(() => {
    fakeInstallLocalTool.mockRejectedValue(installError);
  });

  test('it should throw the error returned from the install local tool function', async () => {
    await expect(cakeTool.install()).rejects.toThrow(installError);
  });
});

describe('When failing to install a specific version of the Cake.Tool', () => {
  const fakeInstallLocalTool = dotnet.installLocalTool as jest.MockedFunction<typeof dotnet.installLocalTool>;
  const installError = new Error('Failed to install Cake.Tool');

  beforeAll(() => {
    fakeInstallLocalTool.mockRejectedValue(installError);
  });

  test('it should throw the error returned from the install local tool function', async () => {
    await expect(cakeTool.install(undefined, { version: 'specific', number: 'the.version.number' })).rejects.toThrow(
      installError
    );
  });
});
