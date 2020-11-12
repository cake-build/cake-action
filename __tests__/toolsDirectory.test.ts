import * as fs from 'fs';
import * as path from 'path';
import del from 'del';
import { Platform } from '../src/platform';
import { ToolsDirectory } from '../src/toolsDirectory';

describe('When constructing the tools directory', () => {
  test('it should set the default directory path to tools', () => {
    const sut = new ToolsDirectory();
    expect(sut.path).toBe('tools');
  });

  test('it should set the directory path to the specified value', () => {
    const sut = new ToolsDirectory('theName');
    expect(sut.path).toBe('theName');
  });

  test('it should remove ./ at the beginning of the specified path', () => {
    const sut = new ToolsDirectory('./theName');
    expect(sut.path).toBe('theName');
  });

  test('it should keep ../ at the beginning of the specified path', () => {
    const sut = new ToolsDirectory('../theName');
    expect(sut.path).toBe(Platform.isWindows() ? '..\\theName' : '../theName');
  });

  test('it should remove double slashes from the specified path', () => {
    const sut = new ToolsDirectory('the//name');
    expect(sut.path).toBe(Platform.isWindows() ? 'the\\name' : 'the/name');
  });
});

describe('When creating the directory on the file system', () => {
  const sut = new ToolsDirectory('theName');

  afterEach(() => {
    del.sync(sut.path);
  });

  test('it should create the directory at the specified path', () => {
    sut.create();
    expect(fs.existsSync(sut.path)).toBe(true);
  });

  test('it should not fail if the directory already exists', () => {
    sut.create();
    sut.create();
    expect(fs.existsSync(sut.path)).toBe(true);
  });
});

describe('When checking whether the directory contains a specific file', () => {
  const sut = new ToolsDirectory('theName');
  const fileName = 'theFile';

  beforeAll(() => {
    fs.mkdirSync(sut.path);
    fs.writeFileSync(path.join(sut.path, fileName), '');
  });

  afterAll(() => {
    del.sync(sut.path);
  });

  test('it should return true if the file exists', () => {
    expect(sut.containsFile(fileName)).toBe(true);
  });

  test('it should return false if the file does not exists', () => {
    expect(sut.containsFile('notExisting')).toBe(false);
  });
});

describe('When checking whether the directory contains a specific file in a subdirectory', () => {
  const sut = new ToolsDirectory('theNameWithSubdirectory');
  const subdirectoryPath = path.join(sut.path, 'theSubdirectory');
  const fileName = 'theFile';

  beforeAll(() => {
    fs.mkdirSync(subdirectoryPath, { recursive: true });
    fs.writeFileSync(path.join(subdirectoryPath, fileName), '');
  });

  afterAll(() => {
    del.sync(sut.path);
  });

  test('it should return true if the file exists', () => {
    expect(sut.containsFile(fileName, 'theSubdirectory')).toBe(true);
  });

  test('it should return false if the file does not exists', () => {
    expect(sut.containsFile(fileName, 'notExisting')).toBe(false);
  });
});

describe('When checking whether the directory contains a specific tool on Posix', () => {
  const sut = new ToolsDirectory('theToolsOnPosix');
  const toolName = 'theTool';

  beforeAll(() => {
    fs.mkdirSync(sut.path);
    fs.writeFileSync(path.join(sut.path, toolName), '');
    Platform.isWindows = jest.fn().mockImplementation(() => false);
  });

  afterAll(() => {
    del.sync(sut.path);
  });

  test('it should return true if the directory contains the tool', () => {
    expect(sut.containsTool(toolName)).toBe(true);
  });

  test('it should return false if the directory does not contain the tool', () => {
    expect(sut.containsTool('notExisting')).toBe(false);
  });
});

describe('When checking whether the directory contains a specific tool on Windows', () => {
  const sut = new ToolsDirectory('theToolsOnWindows');
  const toolName = 'theTool';

  beforeAll(() => {
    fs.mkdirSync(sut.path);
    fs.writeFileSync(path.join(sut.path, `${toolName}.exe`), '');
    Platform.isWindows = jest.fn().mockImplementation(() => true);
  });

  afterAll(() => {
    del.sync(sut.path);
  });

  test('it should return true if the directory contains the tool', () => {
    expect(sut.containsTool(toolName)).toBe(true);
  });

  test('it should return false if the directory does not contain the tool', () => {
    expect(sut.containsTool('notExisting')).toBe(false);
  });
});

describe('When checking whether the directory contains a specific version of a tool', () => {
  const sut = new ToolsDirectory('theToolsWithVersions');
  const packageId = 'thePackage';
  const version = 'theVersion';
  const packageMetadata = 'project.assets.json';
  const toolDirectoryPath = path.join(sut.path, '.store', packageId, version);

  beforeAll(() => {
    fs.mkdirSync(toolDirectoryPath, { recursive: true });
    fs.writeFileSync(path.join(toolDirectoryPath, packageMetadata), '');
  });

  afterAll(() => {
    del.sync(sut.path);
  });

  test('it should return true if the directory contains the version of the tool', () => {
    expect(sut.containsToolWithVersion(packageId, version)).toBe(true);
  });

  test('it should return false if the directory does not contain the tool', () => {
    expect(sut.containsToolWithVersion('notExisting', version)).toBe(false);
  });

  test('it should return false if the directory does not contain the version of the tool', () => {
    expect(sut.containsToolWithVersion(packageId, 'notExisting')).toBe(false);
  });
});

describe('When appending a file name', () => {
  test('it should join the directory path with the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.append('theFileName')).toBe(`${sut.path}${process.platform === 'win32' ? '\\' : '/'}theFileName`);
  });

  test('it should remove any extra slashes in front of the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.append('/theFileName')).toBe(`${sut.path}${process.platform === 'win32' ? '\\' : '/'}theFileName`);
  });
});

describe('When converting the tools directory into a string', () => {
  test('it should return the path of the directory', () => {
    const sut = new ToolsDirectory();
    expect(sut.toString()).toBe(sut.path);
  });
});
