import * as io from '@actions/io';
import { ToolsDirectory } from '../src/toolsDirectory';

jest.mock('@actions/io');

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
    expect(sut.path).toBe('../theName');
  });

  test('it should remove double slashes from the specified path', () => {
    const sut = new ToolsDirectory('the//name');
    expect(sut.path).toBe('the/name');
  });
});

describe('When creating the directory on the file system', () => {
  const fakeMkdirP = io.mkdirP as jest.MockedFunction<typeof io.mkdirP>;

  test('it should create the directory at the specified path', () => {
    const sut = new ToolsDirectory('theName');
    sut.create();
    expect(fakeMkdirP).toBeCalledWith(sut.path);
  });
});

describe('When appending a file name', () => {
  test('it should join the directory path with the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.appendFileName('theFileName')).toBe(`${sut.path}/theFileName`);
  });

  test('it should remove any extra slashes in front of the specified file name', () => {
    const sut = new ToolsDirectory();
    expect(sut.appendFileName('/theFileName')).toBe(`${sut.path}/theFileName`);
  });
});

describe('When converting the tools directory into a string', () => {
  test('it should return the path of the directory', () => {
    const sut = new ToolsDirectory();
    expect(sut.toString()).toBe(sut.path);
  });
});
