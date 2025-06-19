# Cake for GitHub Actions

[![GitHub Marketplace](https://img.shields.io/github/v/release/cake-build/cake-action?label=Marketplace&sort=semver)](https://github.com/marketplace/actions/cake-action) [![GitHub Actions Build](https://github.com/cake-build/cake-action/workflows/Build/badge.svg)](https://github.com/cake-build/cake-action/actions?workflow=Build) [![GitHub Actions Tests](https://github.com/cake-build/cake-action/workflows/Test/badge.svg)](https://github.com/cake-build/cake-action/actions?workflow=Test) [![Coveralls](https://coveralls.io/repos/github/cake-build/cake-action/badge.svg?branch=master)](https://coveralls.io/github/cake-build/cake-action?branch=master)

This action allows you to run a Cake script or Cake Frosting project from your GitHub Actions workflow without having to use a [bootstrapper](https://github.com/cake-build/resources).

## Usage

Using the Cake action from a GitHub Actions workflow is as simple as referencing [this repository](https://github.com/cake-build/cake-action) from a [build step](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps):

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
```

The Cake action will look for a script named `build.cake` in your repository's root directory and run it for you using the [Cake Tool](https://www.nuget.org/packages/Cake.Tool/).  You can also specify the path to your Cake script using the `script-path` option. If you are using a [Cake Frosting](https://cakebuild.net/docs/running-builds/runners/cake-frosting) project instead, you must specify the path to your `.csproj` file with the `project-path` parameter. You can also use `file-path` to specify a C# file (`.cs`) that contains a file-based Cake app (*requires .NET 10 or later*).

All output from the Cake script or Cake Frosting project is automatically redirected to the build log for inspection.

## Inputs

### `script-path`

If your Cake script is located somewhere other than the root directory of your project, you can specify its path using the `script-path` [input parameter](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith):

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      script-path: path/to/script.cake
```

### `project-path`

If you are using [Cake Frosting](https://cakebuild.net/docs/running-builds/runners/cake-frosting), you must specify the path to the project file with the `project-path` [input parameter](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith):

```yml
steps:
  - name: Run Cake Frosting
    uses: cake-build/cake-action@v3
    with:
      project-path: path/to/build.csproj
```

### `file-path`

If you want to run a C# file-based Cake app, specify the path to your `.cs` file using the `file-path` input parameter:

```yml
steps:
  - name: Run a Cake C# file
    uses: cake-build/cake-action@v3
    with:
      file-path: path/to/Build.cs
```

> **Note:** Running C# file-based Cake apps requires .NET 10 or higher to be available in your environment.

The action will automatically run the specified file as a file-based Cake app.

### `target`

You'll likely want to specify which task to run out of the ones defined in the Cake script or Cake Frosting project. For that, you can use the `target` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      target: Task-To-Run
```

### `verbosity`

You can adjust the amount of information Cake sends to the build log by changing the [verbosity level](https://cakebuild.net/api/Cake.Core.Diagnostics/Verbosity/) with the `verbosity` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      verbosity: Diagnostic
```

The supported verbosity levels are `Quiet`, `Minimal`, `Normal`, `Verbose` and `Diagnostic`. The default level is set to `Normal`.

### `dry-run`

While developing a script, you'll sometimes want to see which tasks would be triggered by a given target _without_ actually running them. That's exactly what the `dry-run` parameter is for:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      dry-run: true
```

When `dry-run` is set to `true`, Cake will print out the names of the tasks to run according to the dependency graph, but it won't perform any of the instructions defined in them.

### `arguments`

If your script defines any custom parameters, you can specify arguments for them by using the `arguments` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      arguments: |
        name: value
        configuration: Release
```

The arguments are defined in a [multi-line string literal](https://yaml.org/spec/1.2/spec.html#id2795688) where each argument is on a separate line in the format `name: value`. Keep in mind that the values you specify here are passed _as is_ to the Cake script; this means that characters like quotes are kept intact (for example, `name: 'value'` will result in `--name='value'` being passed to the script).

### `cake-version`

By default, the Cake action runs your script using the latest _stable_ version of the [Cake .NET Core Global tool](https://www.nuget.org/packages/Cake.Tool/).

If you need to [use a specific version of Cake](https://cakebuild.net/docs/tutorials/pinning-cake-version) (e.g. for compatibility with older addins), you can specify it with the `cake-version` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      cake-version: 0.30.0
```

If you're pinning your Cake version using a [tool manifest file](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools#install-a-local-tool), you can have the action restore any local tools, including Cake, by specifying `tool-manifest` as the argument for `cake-version`:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      cake-version: tool-manifest
```

> :information_source: This option is ignored when [using Cake Frosting projects](#project-path).

### `cake-bootstrap`

As of [Cake 1.0.0](https://github.com/cake-build/cake/releases/tag/v1.0.0), any [custom modules](https://cakebuild.net/docs/fundamentals/modules) that you reference in your script are [bootstrapped automatically](https://github.com/cake-build/cake/issues/2833) upon running it.

For older versions of Cake, you need to explicitly [bootstrap](https://cakebuild.net/docs/fundamentals/preprocessor-directives#module-directive) any referenced modules before running the script. The Cake action can handle this extra step for you by setting the `cake-bootstrap` parameter to `explicit`:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      cake-bootstrap: explicit
      cake-version: 0.38.5
```

If you're using Cake 1.0.0 or later and wish to opt out of the automatic bootstrapping of modules, you can set the `cake-bootstrap` parameter to `skip`:

```yml
steps:
  - name: Run the Cake script
    uses: cake-build/cake-action@v3
    with:
      cake-bootstrap: skip
```

The default value is `auto`, which means modules will be automatically bootstrapped on Cake 1.0.0 or later.

> :information_source: This option is ignored when [using Cake Frosting projects](#script-path).

## Cross-platform

Since the [Cake Tool](https://www.nuget.org/packages/Cake.Tool/) and [Cake Frosting](https://www.nuget.org/packages/Cake.Frosting) are built on .NET Core, the Cake action will run on any of the [virtual environments](https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions) supported by GitHub Actions, namely Linux, Windows and macOS.

This allows you to define your build step exactly _once_ and run it on multiple operating systems _in parallel_ by defining a [build matrix](https://help.github.com/en/github/automating-your-workflow-with-github-actions/configuring-a-workflow#configuring-a-build-matrix):

```yml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest, macOS-latest]
    steps:
      - name: Get the sources
        uses: actions/checkout@v1
      - name: Run the build script
        uses: cake-build/cake-action@v3
        with:
          target: Build
```

You can read more about how to define a build matrix in the [workflow syntax](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstrategy) for GitHub Actions.
