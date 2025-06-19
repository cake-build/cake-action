import * as core from '@actions/core';
import { when } from 'jest-when';
import * as action from '../action';
import { CakeArgument, CakeSwitch } from '../cakeParameter';

jest.mock('@actions/core');

describe('When getting the script-path input argument from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('path/to/script.cake');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'script\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('script');
  });

  test('it should return the argument for the script-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/script.cake');
  });
});

describe('When getting the project-path input argument from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('path/to/build.csproj');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'project\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('project');
  });

  test('it should return the argument for the project-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.csproj');
  });
});

describe('When getting both the script-path and project-path input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('path/to/build.cake');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('path/to/build.csproj');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'project\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('project');
  });

  test('it should return the argument for the project-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.csproj');
  });
});

describe('When getting the script-path, project-path and file-path input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('path/to/build.cake');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('path/to/build.csproj');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('path/to/build.cs');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'project\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('project');
  });

  test('it should return the argument for the project-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.csproj');
  });
});

describe('When getting both the project-path and file-path input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('path/to/build.csproj');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('path/to/build.cs');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'project\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('project');
  });

  test('it should return the argument for the project-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.csproj');
  });
});

describe('When getting the file-path input argument from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('path/to/build.cs');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'file\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('file');
  });

  test('it should return the argument for the file-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.cs');
  });
});

describe('When getting both the script-path and file-path input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('path/to/build.cake');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('path/to/build.cs');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'file\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('file');
  });

  test('it should return the argument for the file-path parameter as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('path/to/build.cs');
  });
});

describe('When getting the Cake tool input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('the.version.number');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('auto');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return the argument for the cake-version parameter', () => {
    expect(action.getInputs().cakeVersion).toMatchObject({
      version: 'specific',
      number: 'the.version.number'
    });
  });

  test('it should return the argument for the cake-bootstrap parameter', () => {
    expect(action.getInputs().cakeBootstrap).toBe('auto');
  });
});

describe('When getting the Cake input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('target').mockReturnValue('Task-To-Run');
    when(fakeGetInput).calledWith('verbosity').mockReturnValue('Verbosity-Level');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('true');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return the argument for the target script parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('target', 'Task-To-Run'));
  });

  test('it should return the argument for the verbosity script parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('verbosity', 'Verbosity-Level'));
  });

  test('it should return the argument for the dry-run script parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeSwitch('dryrun'));
  });
});

describe('When getting the dry-run script input argument set to false from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('false');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should not pass the dry run switch to the script', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeSwitch('dryrun'));
  });
});

describe('When getting multiple custom script input arguments from the action', () => {
  const fakeGetMultilineInput = core.getMultilineInput as jest.MockedFunction<typeof core.getMultilineInput>;

  beforeAll(() => {
    when(fakeGetMultilineInput).calledWith('arguments').mockReturnValue([
      'string-parameter: \'value\'',
      'numeric-parameter: 3',
      'boolean-parameter: true'
    ]);
  });

  test('it should return the argument for a custom string parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('string-parameter', '\'value\''));
  });

  test('it should return the argument for a custom numeric parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('numeric-parameter', '3'));
  });

  test('it should return the argument for a custom boolean parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('boolean-parameter', 'true'));
  });
});

describe('When getting a single custom script input argument from the action', () => {
  const fakeGetInput = core.getMultilineInput as jest.MockedFunction<typeof core.getMultilineInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('arguments').mockReturnValue([
      'name: value'
    ]);
  });

  test('it should return the argument for the custom parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('name', 'value'));
  });
});

describe('When getting a single custom script input argument on one line from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('arguments').mockReturnValue('name: value');
  });

  test('it should return the argument for the custom parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('name', 'value'));
  });
});

describe('When getting a custom script input argument that contains colons (e.g. an URL)', () => {
  const fakeGetInput = core.getMultilineInput as jest.MockedFunction<typeof core.getMultilineInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('arguments').mockReturnValue([
      'url: https://example.com'
    ]);
  });

  test('it should return the argument for the custom parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('url', 'https://example.com'));
  });
});

describe('When getting improperly formatted custom script input arguments from the action', () => {
  const fakeGetMultilineInput = core.getMultilineInput as jest.MockedFunction<typeof core.getMultilineInput>;

  beforeAll(() => {
    when(fakeGetMultilineInput).calledWith('arguments').mockReturnValue([
      '--name=value',
      '-name=value',
      'name=value',
      '--name value',
      '-name value',
      'name value',
      '--nameOnly',
      '-nameOnly',
      'nameOnly'
    ]);
  });

  test('it should not parse the invalid parameter names and values', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeArgument('name', 'value'));
  });

  test('it should not parse the invalid parameter names', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeArgument('name', ''));
  });
});

describe('When getting no input arguments from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('script-path').mockReturnValue('');
    when(fakeGetInput).calledWith('project-path').mockReturnValue('');
    when(fakeGetInput).calledWith('file-path').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('');
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('');
    when(fakeGetInput).calledWith('target').mockReturnValue('');
    when(fakeGetInput).calledWith('verbosity').mockReturnValue('');
    when(fakeGetInput).calledWith('dry-run').mockReturnValue('');
    when(fakeGetInput).calledWith('arguments').mockReturnValue('');
  });

  test('it should return \'script\' as the build file type parameter', () => {
    expect(action.getInputs().buildFile.type).toBe('script');
  });

  test('it should return \'build.cake\' as the build file path parameter', () => {
    expect(action.getInputs().buildFile.path).toBe('build.cake');
  });

  test('it should return latest for the cake-version parameter', () => {
    expect(action.getInputs().cakeVersion).toMatchObject({ version: 'latest' });
  });

  test('it should return auto for the cake-bootstrap parameter', () => {
    expect(action.getInputs().cakeBootstrap).toBe('auto');
  });

  test('it should return an empty string for the target script parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('target', ''));
  });

  test('it should return an empty string for the verbosity script parameter', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeArgument('verbosity', ''));
  });

  test('it should not pass the dry run switch to the script', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeSwitch('dryrun'));
  });
});

describe('When getting the cake-version script input argument set to tool-manifest from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('tool-manifest');
  });

  test('it should return tool-manifest the for cake-version parameter', () => {
    expect(action.getInputs().cakeVersion).toMatchObject({ version: 'tool-manifest' });
  });
});

describe('When getting the cake-version script input argument set to latest from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-version').mockReturnValue('latest');
  });

  test('it should return latest for the cake-version parameter', () => {
    expect(action.getInputs().cakeVersion).toMatchObject({ version: 'latest' });
  });
});

describe('When getting the cake-bootstrap script input argument set to auto from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('auto');
  });

  test('it should return auto for the cake-bootstrap parameter', () => {
    expect(action.getInputs().cakeBootstrap).toBe('auto');
  });

  test('it should not pass the skip-bootstrap switch to the script', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeSwitch('skip-bootstrap'));
  });
});

describe('When getting the cake-bootstrap script input argument set to explicit from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('explicit');
  });

  test('it should return explicit for the cake-bootstrap parameter', () => {
    expect(action.getInputs().cakeBootstrap).toBe('explicit');
  });

  test('it should not pass the skip-bootstrap switch to the script', () => {
    expect(action.getInputs().buildArguments).not.toContainEqual(new CakeSwitch('skip-bootstrap'));
  });
});

describe('When getting the cake-bootstrap script input argument set to skip from the action', () => {
  const fakeGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;

  beforeAll(() => {
    when(fakeGetInput).calledWith('cake-bootstrap').mockReturnValue('skip');
  });

  test('it should return skip for the cake-bootstrap parameter', () => {
    expect(action.getInputs().cakeBootstrap).toBe('skip');
  });

  test('it should pass the skip-bootstrap switch to the script', () => {
    expect(action.getInputs().buildArguments).toContainEqual(new CakeSwitch('skip-bootstrap'));
  });
});
