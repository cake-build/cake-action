import * as fs from 'fs';
import { ToolsDirectory } from '../src/toolsDirectory';

const isRunningOnWindows = (require('os').platform() === 'win32');

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
    expect(sut.path).toBe(isRunningOnWindows ? '..\\theName' : '../theName');
  });

  test('it should remove double slashes from the specified path', () => {
    const sut = new ToolsDirectory('the//name');
    expect(sut.path).toBe(isRunningOnWindows ? 'the\\name' : 'the/name');
  });
});

describe('When creating the directory on the file system', () => {
  const sut = new ToolsDirectory('theName');

  afterEach(() => {
    fs.rmdirSync(sut.path);
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

describe('When appending a file name', () => {
  test('it should join the directory path with the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.appendFileName('theFileName')).toBe(`${sut.path}${isRunningOnWindows ? '\\' : '/'}theFileName`);
  });

  test('it should remove any extra slashes in front of the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.appendFileName('/theFileName')).toBe(`${sut.path}${isRunningOnWindows ? '\\' : '/'}theFileName`);
  });
});

describe('When converting the tools directory into a string', () => {
  test('it should return the path of the directory', () => {
    const sut = new ToolsDirectory();
    expect(sut.toString()).toBe(sut.path);
  });
});
