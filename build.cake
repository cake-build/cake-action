var target = Argument("Target", "Successful-Task");
var stringArgument = Argument("String-Parameter", string.Empty);
var numericArgument = Argument("Numeric-Parameter", 0);
var booleanArgument = Argument("Boolean-Parameter", false);

Task("Successful-Task")
    .Does(() =>
{
    Information("✓ Passed");
});

Task("Failing-Task")
    .Does(() =>
{
    throw new Exception("✕ Failed");
});

Task("Test-Cake-Version")
    .Does(() =>
{
    var hasExpectedVersion = Version.TryParse(
        EnvironmentVariable("EXPECTED_CAKE_VERSION"),
        out Version expectedVersion);

    if (!hasExpectedVersion)
    {
        throw new Exception(
            "✕ The EXPECTED_CAKE_VERSION environment variable is not set or it doesn't contain a version number");
    }

    var actualVersion = Context.Environment.Runtime.CakeVersion;

    if (( expectedVersion.Major, expectedVersion.Minor, expectedVersion.Build ) !=
        ( actualVersion.Major, actualVersion.Minor, actualVersion.Build ))
    {
        throw new Exception(
            $"✕ Expected Cake version {expectedVersion.ToString(fieldCount: 3)} but got {actualVersion.ToString(fieldCount: 3)}");
    }

    Information("✓ Passed");
});

Task("Test-Verbosity")
    .Does(() =>
{
    var hasExpectedVerbosity = Enum.TryParse(
        EnvironmentVariable("EXPECTED_VERBOSITY"),
        ignoreCase: true,
        out Verbosity expectedVerbosity);

    if (!hasExpectedVerbosity)
    {
        throw new Exception(
            "✕ The EXPECTED_VERBOSITY environment variable is not set or it doesn't contain a verbosity level");
    }

    var actualVerbosity = Context.Log.Verbosity;

    if (expectedVerbosity != actualVerbosity)
    {
        throw new Exception($"✕ Expected verbosity {expectedVerbosity} but got {actualVerbosity}");
    }

    Information("✓ Passed");
});

Task("Test-Dry-Run")
    .Does(() =>
{
    if (!IsDryRun())
    {
        throw new Exception("✕ Expected this to be a dry run, but it isn't");
    }

    Information("✓ Passed");
});

Task("Test-Script-Parameters")
    .Does(() =>
{
    var expectedStringArgument = EnvironmentVariable("EXPECTED_STRING_ARGUMENT");

    var hasExpectedNumericArgument = int.TryParse(
        EnvironmentVariable("EXPECTED_NUMERIC_ARGUMENT"),
        out int expectedNumericArgument);

    var hasExpectedBooleanArgument = bool.TryParse(
        EnvironmentVariable("EXPECTED_BOOLEAN_ARGUMENT"),
        out bool expectedBooleanArgument);

    if (string.IsNullOrEmpty(expectedStringArgument))
    {
        throw new Exception(
            "✕ The EXPECTED_STRING_ARGUMENT environment variable is not set");
    }

    if (!hasExpectedNumericArgument)
    {
        throw new Exception(
            "✕ The EXPECTED_NUMERIC_ARGUMENT environment variable is not set");
    }

    if (!hasExpectedBooleanArgument)
    {
        throw new Exception(
            "✕ The EXPECTED_BOOLEAN_ARGUMENT environment variable is not set");
    }

    if (expectedStringArgument != stringArgument)
    {
        throw new Exception($"✕ Expected string argument {expectedStringArgument} but got {stringArgument}");
    }

    if (expectedNumericArgument != numericArgument)
    {
        throw new Exception($"✕ Expected numeric argument {expectedNumericArgument} but got {numericArgument}");
    }

    if (expectedBooleanArgument != booleanArgument)
    {
        throw new Exception($"✕ Expected boolean argument {expectedBooleanArgument} but got {booleanArgument}");
    }

    Information("✓ Passed");
});

RunTarget(target);
