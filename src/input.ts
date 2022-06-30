import * as core from '@actions/core';

export function getBooleanInput(name: string): boolean {
  return core.getInput(name).toLowerCase() === 'true';
}

export function getMultilineInput(name: string): string[] {
  return core.getMultilineInput(name) ?? [];
}
