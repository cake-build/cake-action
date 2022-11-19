import * as core from '@actions/core';
import * as script from './cakeParameter';
import * as input from './input';

interface CakeInputs {
  readonly scriptPath?: string,
  readonly cakeVersion?: CakeVersion,
  readonly cakeBootstrap?: boolean;
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
  version: string;
};

export function getInputs(): CakeInputs & ScriptInputs {
  return {
    scriptPath: core.getInput('script-path'),
    cakeVersion: getCakeVersionInput(),
    cakeBootstrap: input.getBooleanInput('cake-bootstrap'),
    scriptArguments: getScriptInputs()
  };
}

function getCakeVersionInput(): CakeVersion {
  const version = core.getInput('cake-version').toLowerCase();
  return version === '' ? { version: 'latest' } : { version: version };
}

function getScriptInputs(): script.CakeParameter[] {
  return [
    new script.CakeArgument('target', core.getInput('target')),
    new script.CakeArgument('verbosity', core.getInput('verbosity')),
    ...parseDryRunSwitch(),
    ...parseCustomArguments()
  ];
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
