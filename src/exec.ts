import * as cake from './cake';
import { CakeParameter } from './cakeParameter';
import * as cakeTool from './cakeTool';
import { CakeToolSettings } from './cakeToolSettings';
import { CakeBootstrap, CakeVersion } from './input';
import { ToolsDirectory } from './toolsDirectory';

export interface ScriptOptions {
  cakeVersion?: CakeVersion;
  bootstrap?: CakeBootstrap;
}

export async function project(path: string, ...params: CakeParameter[]) {
  const toolsDir = new ToolsDirectory();
  toolsDir.create();
  await cake.runProject(path, toolsDir, ...params);
}

export async function file(path: string, ...params: CakeParameter[]) {
  const toolsDir = new ToolsDirectory();
  toolsDir.create();
  await cake.runFile(path, toolsDir, ...params);
}

export async function script(
  path: string,
  options: ScriptOptions = {},
  ...params: CakeParameter[]
) {
  const { cakeVersion, bootstrap } = options;
  const toolsDir = new ToolsDirectory();
  const cakeToolSettings = new CakeToolSettings(toolsDir, cakeVersion?.version === 'tool-manifest');

  toolsDir.create();
  await cakeTool.install(toolsDir, cakeVersion);

  if (bootstrap === 'explicit') {
    await cake.bootstrapScript(path, cakeToolSettings);
  }

  await cake.runScript(path, cakeToolSettings, ...params);
}
