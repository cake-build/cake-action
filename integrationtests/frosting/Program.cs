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
        StringParameter = context.Argument<string>("String-Parameter", null);
        NumericParameter = context.Argument<int?>("Numeric-Parameter", null);
        BooleanParameter = context.Argument<bool?>("Boolean-Parameter", null);
    }

    public string StringParameter { get; }

    public int? NumericParameter { get; }

    public bool? BooleanParameter { get; }

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

[TaskName("Test-Dry-Run")]
public sealed class TestDryRun : FrostingTask<BuildContext>
{
    public override void Run(BuildContext context)
    {
        if (!context.IsDryRun())
        {
            throw new Exception("✕ Expected this to be a dry run, but it isn't");
        }

        context.Log.Information("✓ Passed");
    }
}

[TaskName("Test-Script-Parameters")]
public sealed class TestScriptParameters : FrostingTask<BuildContext>
{
    public override void Run(BuildContext context)
    {
        var expectedStringArgument = context.EnvironmentVariable("EXPECTED_STRING_ARGUMENT");

        var hasExpectedNumericArgument = int.TryParse(
            context.EnvironmentVariable("EXPECTED_NUMERIC_ARGUMENT"),
            out int expectedNumericArgument);

        var hasExpectedBooleanArgument = bool.TryParse(
            context.EnvironmentVariable("EXPECTED_BOOLEAN_ARGUMENT"),
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

        if (expectedStringArgument != context.StringParameter)
        {
            throw new Exception($"✕ Expected string argument {expectedStringArgument} but got {context.StringParameter}");
        }

        if (expectedNumericArgument != context.NumericParameter)
        {
            throw new Exception($"✕ Expected numeric argument {expectedNumericArgument} but got {context.NumericParameter}");
        }

        if (expectedBooleanArgument != context.BooleanParameter)
        {
            throw new Exception($"✕ Expected boolean argument {expectedBooleanArgument} but got {context.BooleanParameter}");
        }

        context.Log.Information("✓ Passed");
    }
}

[TaskName("Default")]
[IsDependentOn(typeof(SuccessfulTask))]
public class DefaultTask : FrostingTask;
