using System;
using Cake.Common;
using Cake.Core;
using Cake.Core.Diagnostics;
using Cake.Frosting;

public static class Program
{
    public static int Main(string[] args)
    {
        return new CakeHost()
            .UseContext<BuildContext>()
            .Run(args);
    }
}

public class BuildContext : FrostingContext
{
    public BuildContext(ICakeContext context)
        : base(context)
    {
    }
}

[TaskName("Successful-Task")]
public sealed class SuccessfulTask : FrostingTask<BuildContext>
{
    public override void Run(BuildContext context)
    {
        context.Log.Information("✓ Passed");
    }
}

[TaskName("Test-Verbosity")]
public sealed class TestVerbosity : FrostingTask<BuildContext>
{
    public override void Run(BuildContext context)
    {
        var hasExpectedVerbosity = Enum.TryParse(
            context.EnvironmentVariable("EXPECTED_VERBOSITY"),
            ignoreCase: true,
            out Verbosity expectedVerbosity);

        if (!hasExpectedVerbosity)
        {
            throw new Exception(
                "✕ The EXPECTED_VERBOSITY environment variable is not set or it doesn't contain a verbosity level");
        }

        var actualVerbosity = context.Log.Verbosity;

        if (expectedVerbosity != actualVerbosity)
        {
            throw new Exception($"✕ Expected verbosity {expectedVerbosity} but got {actualVerbosity}");
        }

        context.Log.Information("✓ Passed");
    }
}

[TaskName("Default")]
[IsDependentOn(typeof(SuccessfulTask))]
public class DefaultTask : FrostingTask;
