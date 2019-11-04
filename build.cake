var target = Argument("Target", "Successful-Task");

Task("Successful-Task")
    .Does(() =>
{
    Information("Successful");
});

Task("Failing-Task")
    .Does(() =>
{
    throw new Exception("Failed");
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
            "The EXPECTED_CAKE_VERSION environment variable is not set or it doesn't contain a version number");
    }

    var actualVersion = Context.Environment.Runtime.CakeVersion;

    if (( expectedVersion.Major, expectedVersion.Minor, expectedVersion.Build ) !=
        ( actualVersion.Major, actualVersion.Minor, actualVersion.Build ))
    {
        throw new Exception(
            $"Expected Cake version {expectedVersion.ToString(fieldCount: 3)} but got {actualVersion.ToString(fieldCount: 3)}");
    }

    Information("Successful");
});

RunTarget(target);
