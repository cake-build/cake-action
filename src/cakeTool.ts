import * as dotnet from './dotnet';
import { ToolsDirectory } from './toolsDirectory';
import { CakeVersion } from './action';
import { getLatestVersion } from './cakeRelease';

export async function install(toolsDir?: ToolsDirectory, version?: CakeVersion) {
  switch (version?.version) {
    case 'tool-manifest':
      await dotnet.restoreLocalTools();
      break;
    case 'latest':
    case undefined:
      await installCakeLocalTool(toolsDir, (await getLatestVersion()) ?? undefined);
      break;
    case 'specific':
      await installCakeLocalTool(toolsDir, version.number);
      break;
  }
}

async function installCakeLocalTool(
  targetDirectory: ToolsDirectory = new ToolsDirectory(),
  version?: string
) {
  return dotnet.installLocalTool('Cake.Tool', 'dotnet-cake', targetDirectory, version);
}
