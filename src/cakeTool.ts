import * as dotnet from './dotnet';
import { ToolsDirectory } from './toolsDirectory';
import { CakeVersion } from './action';

export async function install(toolsDir?: ToolsDirectory, version?: CakeVersion) {
  switch (version?.version) {
    case 'tool-manifest':
      await dotnet.restoreLocalTools();
      break;
    case 'latest':
      await installCakeLocalTool(toolsDir);
      break;
    default:
      await installCakeLocalTool(toolsDir, version?.version);
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
