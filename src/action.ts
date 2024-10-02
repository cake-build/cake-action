import * as core from '@actions/core';
import * as build from './cakeParameter';
import * as input from './input';

interface CakeInputs {
  readonly buildFile: BuildFile,
  readonly cakeVersion?: CakeVersion,
  readonly cakeBootstrap?: CakeBootstrap;
}

interface BuildInputs {
  readonly buildArguments: build.CakeParameter[];
}

export type BuildFile = Script | Project;
type Script = {
  readonly type: 'script',
  path: string;
};
type Project = {
  readonly type: 'project',
  path: string;
};

export type CakeVersion =
  | ToolManifest
  | Latest
  | Specific;
type ToolManifest = {
  readonly version: 'tool-manifest';
};
type Latest = {
  readonly version: 'latest';
};
type Specific = {
  readonly version: 'specific',
  number: string;
};

export type CakeBootstrap =
  | 'auto'
  | 'explicit'
  | 'skip';

export function getInputs(): CakeInputs & BuildInputs {
  return {
    buildFile: getFileInput(),
    cakeVersion: getCakeVersionInput(),
    cakeBootstrap: getCakeBootstrapInput(),
    buildArguments: getScriptInputs()
  };
}

function getFileInput(): BuildFile {
  const scriptPath = core.getInput('script-path');
  const projectPath = core.getInput('project-path');

  // When both script and project paths are specified,
  // the project path takes precedence.
  // If neither is provided, the default 'build.cake' script
  // is used, as per Cake's convention.
  if (projectPath) {
    return { type: 'project', path: projectPath };
  } else if (scriptPath) {
    return { type: 'script', path: scriptPath };
  } else {
    return { type: 'script', path: 'build.cake' };
  }
}

function getCakeVersionInput(): CakeVersion {
  const version = core.getInput('cake-version').toLowerCase();
  switch (version) {
    case 'tool-manifest':
      return { version: 'tool-manifest' };
    case 'latest':
    case '':
      return { version: 'latest' };
    default:
      return { version: 'specific', number: version };
  }
}

function getCakeBootstrapInput(): CakeBootstrap {
  const bootstrap = core.getInput('cake-bootstrap').toLowerCase();
  switch (bootstrap) {
    case 'auto': return 'auto';
    case 'explicit': return 'explicit';
    case 'skip': return 'skip';
    default: return 'auto';
  }
}

function getScriptInputs(): build.CakeParameter[] {
  return [
    new build.CakeArgument('target', core.getInput('target')),
    new build.CakeArgument('verbosity', core.getInput('verbosity')),
    ...parseSkipBootstrapSwitch(),
    ...parseDryRunSwitch(),
    ...parseCustomArguments()
  ];
}

function parseSkipBootstrapSwitch(): build.CakeParameter[] {
  return getCakeBootstrapInput() === 'skip'
    ? [new build.CakeSwitch('skip-bootstrap')]
    : [];
}

function parseDryRunSwitch(): build.CakeParameter[] {
  return input.getBooleanInput('dry-run')
    ? [new build.CakeSwitch('dryrun')]
    : [];
}

function parseCustomArguments(): build.CakeParameter[] {
  return input.getMultilineInput('arguments')
    .filter(line => containsArgumentDefinition(line))
    .map(line => parseNameAndValue(line))
    .map(([name, value]) => new build.CakeArgument(name, value));
}

function containsArgumentDefinition(line: string): boolean {
  return /.+:.+/.test(line);
}

function parseNameAndValue(line: string): [string, string] {
  // Splits the line into two groups on the first occurrence of ':'
  const nameValue = line.match(/([^:]+):(.+)/);
  return [nameValue![1].trim(), nameValue![2].trim()];
}
