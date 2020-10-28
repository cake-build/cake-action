import * as core from '@actions/core';
import { CakeArgument } from "./cakeParameter";

interface CakeInputs {
  readonly scriptPath?: string,
  readonly cakeVersion?: string,
  readonly cakeBootstrap?: boolean;
}

interface ScriptInputs {
  readonly scriptArguments: CakeArgument[];
}

export function getInputs(): CakeInputs & ScriptInputs {
  return {
    scriptPath: core.getInput('script-path'),
    cakeVersion: core.getInput('cake-version'),
    cakeBootstrap: (core.getInput('cake-bootstrap') || '').toLowerCase() === 'true',
    scriptArguments: getScriptInputs()
  };
}

function getScriptInputs(): CakeArgument[] {
  return [
    new CakeArgument('target', core.getInput('target')),
    new CakeArgument('verbosity', core.getInput('verbosity')),
    ...parseCustomArguments()
  ];
}

function parseCustomArguments(): CakeArgument[] {
  return core.getInput('arguments')
    .split(/\r?\n/)
    .filter(line => containsArgumentDefinition(line))
    .map(line => parseNameAndValue(line))
    .map(([name, value]) => new CakeArgument(name, value));
}

function containsArgumentDefinition(line: string): boolean {
  return /.+:.+/.test(line);
}

function parseNameAndValue(line: string): [string, string] {
  const nameValue = line.split(':');
  return [nameValue[0].trim(), nameValue[1].trim()];
}
