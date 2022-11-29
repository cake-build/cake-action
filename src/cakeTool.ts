import * as dotnet from './dotnet';
import { ToolsDirectory } from './toolsDirectory';
import { CakeVersion } from './action';

export async function install(toolsDir?: ToolsDirectory, version?: CakeVersion) {
  if (version?.version === 'tool-manifest') {
    await dotnet.restoreLocalTools();
  } else {
    if (version?.version === 'latest') {
      await installCakeLocalTool(toolsDir);
    } else {
      await installCakeLocalTool(toolsDir, version?.version);
    }
  }
}

async function installCakeLocalTool(
  targetDirectory: ToolsDirectory = new ToolsDirectory(),
  version?: string
) {
  return dotnet.installLocalTool(
    'Cake.Tool',
    'dotnet-cake',
    targetDirectory,
    version);
}
