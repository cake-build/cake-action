import * as core from '@actions/core';
import * as script from './cakeParameter';
import * as input from './input';

interface CakeInputs {
  readonly scriptPath?: string,
  readonly cakeVersion?: CakeVersion,
  readonly cakeBootstrap?: CakeBootstrap;
}

interface ScriptInputs {
  readonly scriptArguments: script.CakeParameter[];
}

export type CakeVersion =
  | ToolManifest
  | Latest
  | Specific;
type ToolManifest = {
  version: 'tool-manifest';
};
type Latest = {
  version: 'latest';
};
type Specific = {
  version: 'specific',
  number: string;
};

export type CakeBootstrap =
  | 'auto'
  | 'explicit'
  | 'skip'

export function getInputs(): CakeInputs & ScriptInputs {
  return {
    scriptPath: core.getInput('script-path'),
    cakeVersion: getCakeVersionInput(),
    cakeBootstrap: getCakeBootstrapInput(),
    scriptArguments: getScriptInputs()
  };
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

function getScriptInputs(): script.CakeParameter[] {
  return [
    new script.CakeArgument('target', core.getInput('target')),
    new script.CakeArgument('verbosity', core.getInput('verbosity')),
    ...parseSkipBootstrapSwitch(),
    ...parseDryRunSwitch(),
    ...parseCustomArguments()
  ];
}

function parseSkipBootstrapSwitch() : script.CakeParameter[] {
  return getCakeBootstrapInput() === 'skip'
    ? [new script.CakeSwitch('skip-bootstrap')]
    : [];
}

function parseDryRunSwitch(): script.CakeParameter[] {
  return input.getBooleanInput('dry-run')
    ? [new script.CakeSwitch('dryrun')]
    : [];
}

function parseCustomArguments(): script.CakeParameter[] {
  return input.getMultilineInput('arguments')
    .filter(line => containsArgumentDefinition(line))
    .map(line => parseNameAndValue(line))
    .map(([name, value]) => new script.CakeArgument(name, value));
}

function containsArgumentDefinition(line: string): boolean {
  return /.+:.+/.test(line);
}

function parseNameAndValue(line: string): [string, string] {
  // Splits the line into two groups on the first occurrence of ':'
  const nameValue = line.match(/([^:]+):(.+)/);
  return [nameValue![1].trim(), nameValue![2].trim()];
}
