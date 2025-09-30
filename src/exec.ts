import { CakeBootstrap, CakeVersion } from './action.js';
import { CakeParameter } from './cakeParameter.js';
import { CakeToolSettings } from './cakeToolSettings.js';
import { ToolsDirectory } from './toolsDirectory.js';
import * as cake from './cake.js';
import * as cakeTool from './cakeTool.js';

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
  version?: CakeVersion,
  bootstrap?: CakeBootstrap,
  ...params: CakeParameter[]) {
  const toolsDir = new ToolsDirectory();
  const cakeToolSettings = new CakeToolSettings(toolsDir, version?.version === 'tool-manifest');

  toolsDir.create();
  await cakeTool.install(toolsDir, version);

  if (bootstrap === 'explicit') {
    await cake.bootstrapScript(path, cakeToolSettings);
  }

  await cake.runScript(path, cakeToolSettings, ...params);
}
