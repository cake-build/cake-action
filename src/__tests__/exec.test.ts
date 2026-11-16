import * as cake from '../cake';
import { CakeArgument, CakeSwitch } from '../cakeParameter';
import * as cakeTool from '../cakeTool';
import * as exec from '../exec';
import { ToolsDirectory } from '../toolsDirectory';

jest.mock('../cake');
jest.mock('../cakeTool');

const fakeCreateToolsDirectory = jest.spyOn(ToolsDirectory.prototype, 'create').mockImplementation();

describe('When launching a Cake Frosting project', () => {
  const fakeRunProject = cake.runProject as jest.MockedFunction<typeof cake.runProject>;

  beforeEach(async () => {
    await exec.project('path/to/build.csproj');
  });

  test('it should create the tools directory', () => {
    expect(fakeCreateToolsDirectory).toHaveBeenCalled();
  });

  test('it should run the Cake Frosting project', () => {
    expect(fakeRunProject).toHaveBeenCalled();
  });

  test('it should run the Cake Frosting project at the specified path', () => {
    expect(fakeRunProject.mock.calls[0][0]).toBe('path/to/build.csproj');
  });
});

describe('When launching a Cake Frosting project with parameters', () => {
  const fakeRunProject = cake.runProject as jest.MockedFunction<typeof cake.runProject>;
  const parameters = [new CakeArgument('param', 'value'), new CakeSwitch('switch')];

  beforeEach(async () => {
    await exec.project('path/to/build.csproj', ...parameters);
  });

  test('it should pass the parameters to the Cake Frosting project', () => {
    expect(fakeRunProject).toHaveBeenCalledWith(expect.anything(), expect.anything(), ...parameters);
  });
});

describe('When launching a Cake C# file', () => {
  const fakeRunFile = cake.runFile as jest.MockedFunction<typeof cake.runFile>;

  beforeEach(async () => {
    await exec.file('path/to/build.cs');
  });

  test('it should create the tools directory', () => {
    expect(fakeCreateToolsDirectory).toHaveBeenCalled();
  });

  test('it should run the Cake C# file', () => {
    expect(fakeRunFile).toHaveBeenCalled();
  });

  test('it should run the Cake C# file at the specified path', () => {
    expect(fakeRunFile.mock.calls[0][0]).toBe('path/to/build.cs');
  });
});

describe('When launching a Cake C# file with parameters', () => {
  const fakeRunFile = cake.runFile as jest.MockedFunction<typeof cake.runFile>;
  const parameters = [new CakeArgument('param', 'value'), new CakeSwitch('switch')];

  beforeEach(async () => {
    await exec.file('path/to/build.cs', ...parameters);
  });

  test('it should pass the parameters to the Cake C# file', () => {
    expect(fakeRunFile).toHaveBeenCalledWith(expect.anything(), expect.anything(), ...parameters);
  });
});

describe('When launching a Cake script using the local Cake.Tool', () => {
  const fakeInstallTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeEach(async () => {
    await exec.script('path/to/build.cake');
  });

  test('it should create the tools directory', () => {
    expect(fakeCreateToolsDirectory).toHaveBeenCalled();
  });

  test('it should install the Cake.Tool in the tools directory', () => {
    expect(fakeInstallTool).toHaveBeenCalled();
    expect(fakeInstallTool.mock.calls[0][0]).toEqual(new ToolsDirectory());
  });

  test('it should install the Cake.Tool without a version number', () => {
    expect(fakeInstallTool).toHaveBeenCalledWith(expect.anything(), undefined);
  });

  test('it should run the Cake script', () => {
    expect(fakeRunScript).toHaveBeenCalled();
  });

  test('it should run the Cake script at the specified path', () => {
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/build.cake');
  });
});

describe('When launching a Cake script using the tool manifest', () => {
  const fakeInstallTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeEach(async () => {
    await exec.script('path/to/build.cake', { cakeVersion: { version: 'tool-manifest' } });
  });

  test('it should install the Cake.Tool in the tools directory', () => {
    expect(fakeInstallTool).toHaveBeenCalled();
    expect(fakeInstallTool.mock.calls[0][0]).toEqual(new ToolsDirectory());
  });

  test('it should install the Cake.Tool using the tool manifest', () => {
    expect(fakeInstallTool).toHaveBeenCalledWith(expect.anything(), {
      version: 'tool-manifest',
    });
  });

  test('it should run the Cake script', () => {
    expect(fakeRunScript).toHaveBeenCalled();
  });

  test('it should run the Cake script at the specified path', () => {
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/build.cake');
  });
});

describe('When launching a Cake script using the latest version of the local Cake.Tool', () => {
  const fakeInstallTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeEach(async () => {
    await exec.script('path/to/build.cake', { cakeVersion: { version: 'latest' } });
  });

  test('it should install the Cake.Tool in the tools directory', () => {
    expect(fakeInstallTool).toHaveBeenCalled();
    expect(fakeInstallTool.mock.calls[0][0]).toEqual(new ToolsDirectory());
  });

  test('it should install the latest version of the Cake.Tool', () => {
    expect(fakeInstallTool).toHaveBeenCalledWith(expect.anything(), {
      version: 'latest',
    });
  });

  test('it should run the Cake script', () => {
    expect(fakeRunScript).toHaveBeenCalled();
  });

  test('it should run the Cake script at the specified path', () => {
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/build.cake');
  });
});

describe('When launching a Cake script using a specific version of the local Cake.Tool', () => {
  const fakeInstallTool = cakeTool.install as jest.MockedFunction<typeof cakeTool.install>;
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;

  beforeEach(async () => {
    await exec.script('path/to/build.cake', { cakeVersion: { version: 'specific', number: 'the.version.number' } });
  });

  test('it should install the Cake.Tool in the tools directory', () => {
    expect(fakeInstallTool).toHaveBeenCalled();
    expect(fakeInstallTool.mock.calls[0][0]).toEqual(new ToolsDirectory());
  });

  test('it should install the specified version of the Cake.Tool', () => {
    expect(fakeInstallTool).toHaveBeenCalledWith(expect.anything(), {
      version: 'specific',
      number: 'the.version.number',
    });
  });

  test('it should run the Cake script', () => {
    expect(fakeRunScript).toHaveBeenCalled();
  });

  test('it should run the Cake script at the specified path', () => {
    expect(fakeRunScript.mock.calls[0][0]).toBe('path/to/build.cake');
  });
});

describe('When launching a Cake script with parameters', () => {
  const fakeRunScript = cake.runScript as jest.MockedFunction<typeof cake.runScript>;
  const parameters = [new CakeArgument('param', 'value'), new CakeSwitch('switch')];

  beforeEach(async () => {
    await exec.script('path/to/build.cake', undefined, ...parameters);
  });

  test('it should pass the parameters to the Cake script', () => {
    expect(fakeRunScript).toHaveBeenCalledWith(expect.anything(), expect.anything(), ...parameters);
  });
});

describe('When launching a Cake script with explicit bootstrapping', () => {
  const fakeBootstrapScript = cake.bootstrapScript as jest.MockedFunction<typeof cake.bootstrapScript>;

  beforeEach(async () => {
    await exec.script('path/to/build.cake', { bootstrap: 'explicit' });
  });

  test('it should bootstrap the script at the specified path', () => {
    expect(fakeBootstrapScript).toHaveBeenCalledWith('path/to/build.cake', expect.anything());
  });
});
