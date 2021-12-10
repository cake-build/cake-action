import * as core from '@actions/core';
import * as script from "./cakeParameter";
import * as input from "./input";

interface CakeInputs {
  readonly scriptPath?: string,
  readonly cakeVersion?: string | boolean,
  readonly cakeBootstrap?: boolean;
}

interface ScriptInputs {
  readonly scriptArguments: script.CakeParameter[];
}

export function getInputs(): CakeInputs & ScriptInputs {
  return {
    scriptPath: core.getInput('script-path'),
    cakeVersion: parseCakeVersion(),
    cakeBootstrap: input.getBooleanInput('cake-bootstrap'),
    scriptArguments: getScriptInputs()
  };
}

function parseCakeVersion(): string | boolean {
  const version = core.getInput('cake-version');
  switch (version.toLowerCase()) {
    case 'tool-manifest':
      return true;
    case 'latest':
      return false;
    default:
      return version || false;
  }
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
  return core.getInput('arguments')
    .split(/\r?\n/)
    .filter(line => containsArgumentDefinition(line))
    .map(line => parseNameAndValue(line))
    .map(([name, value]) => new script.CakeArgument(name, value));
}

function containsArgumentDefinition(line: string): boolean {
  return /.+:.+/.test(line);
}

function parseNameAndValue(line: string): [string, string] {
  const nameValue = line.split(':');
  return [nameValue[0].trim(), nameValue[1].trim()];
}
