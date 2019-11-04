var target = Argument("Target", "Successful-Task");

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

RunTarget(target);
