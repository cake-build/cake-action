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

RunTarget(target);
