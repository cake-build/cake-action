import { CakeBootstrap, CakeVersion } from './input';
import { CakeParameter } from './cakeParameter';
import { CakeToolSettings } from './cakeToolSettings';
import { ToolsDirectory } from './toolsDirectory';
import * as cake from './cake';
import * as cakeTool from './cakeTool';

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
  ...params: CakeParameter[]
) {
  const toolsDir = new ToolsDirectory();
  const cakeToolSettings = new CakeToolSettings(toolsDir, version?.version === 'tool-manifest');

  toolsDir.create();
  await cakeTool.install(toolsDir, version);

  if (bootstrap === 'explicit') {
    await cake.bootstrapScript(path, cakeToolSettings);
  }

  await cake.runScript(path, cakeToolSettings, ...params);
}
