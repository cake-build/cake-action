# Cake for GitHub Actions

[![GitHub Marketplace](https://img.shields.io/github/v/release/ecampidoglio/cake-action?label=Marketplace&sort=semver)](https://github.com/marketplace/actions/cake-action) [![GitHub Actions Build](https://github.com/ecampidoglio/cake-action/workflows/Build/badge.svg)](https://github.com/ecampidoglio/cake-action/actions?workflow=Build) [![GitHub Actions Tests](https://github.com/ecampidoglio/cake-action/workflows/Tests/badge.svg)](https://github.com/ecampidoglio/cake-action/actions?workflow=Tests) [![Coveralls](https://coveralls.io/repos/github/ecampidoglio/cake-action/badge.svg?branch=master)](https://coveralls.io/github/ecampidoglio/cake-action?branch=master)

This action allows you to run a Cake script from your GitHub Actions workflow without having to use a [bootstrapper](https://github.com/cake-build/resources).

## Usage

Using the Cake action from a GitHub Actions workflow is as simple as referencing [this repository](https://github.com/ecampidoglio/cake-action) from a [build step](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idsteps):

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
```

The Cake action will look for a script named `build.cake` in your repository's root directory and run it for you using the [Cake Tool](https://www.nuget.org/packages/Cake.Tool/). All output from the Cake script will be automatically redirected to the build log for inspection.

## Inputs

### `script-path`

If your script is in another location, you can specify the path with the `script-path` [input parameter](https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith):

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
    with:
      script-path: path/to/script.cake
```

### `target`

You'll likely want to specify which task to run out of the ones defined in the Cake script. For that, you can use the `target` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
    with:
      target: Task-To-Run
```

### `verbosity`

You can adjust the amount of information Cake sends to the build log by changing the [verbosity level](https://cakebuild.net/api/Cake.Core.Diagnostics/Verbosity/) with the `verbosity` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
    with:
      verbosity: Diagnostic
```

The supported verbosity levels are `Quiet`, `Minimal`, `Normal`, `Verbose` and `Diagnostic`. The default level is set to `Normal`.

### `cake-version`

By default, the Cake action will run your script using the latest _stable_ version of the [Cake .NET Core Global tool](https://www.nuget.org/packages/Cake.Tool/). However, if for some reason you want to [use a specific version of Cake](https://cakebuild.net/docs/tutorials/pinning-cake-version) (for compatibility with older third-party addins, for example), you can do so by specifying the version number in the `cake-version` parameter:

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
    with:
      cake-version: 0.30.0
```

### `cake-bootstrap`

If you're referencing any [custom modules](https://cakebuild.net/docs/fundamentals/modules) from within your script, you'll have to [bootstrap](https://cakebuild.net/docs/fundamentals/preprocessor-directives#module-directive) them _before_ the script runs. The Cake action can do this extra step for you; all you have to do is set the `cake-bootstrap` parameter to `true`:

```yml
steps:
  - name: Run the Cake script
    uses: ecampidoglio/cake-action@master
    with:
      cake-bootstrap: true
```

## Cross-platform

Since the [Cake Tool](https://www.nuget.org/packages/Cake.Tool/) is built on .NET Core, this action will run on any of the [virtual environments](https://help.github.com/en/github/automating-your-workflow-with-github-actions/software-in-virtual-environments-for-github-actions) supported by GitHub Actions, namely Linux, Windows and macOS.
