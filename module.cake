// Install modules
#module nuget:?package=Cake.DotNetTool.Module&version=0.3.1

// Install .NET Core Global tools
#tool "dotnet:https://api.nuget.org/v3/index.json?package=GitVersion.Tool&version=5.10.1"

Task("Test-Module-Bootstrapping")
    .Does(() =>
{
    GitVersion();

    Information("✓ Passed");
});

RunTarget("Test-Module-Bootstrapping");
