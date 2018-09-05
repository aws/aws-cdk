using Amazon.CDK;
using System;
using System.Collections.Generic;
using System.Linq;

namespace HelloCdk
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create a new app. The first argument is used to display a usage message for this app.
            string[] appArgs = new [] { $"dotnet ${nameof(HelloCdk)}" }
                .Concat(args)
                .ToArray();
            var app = new App(appArgs);

            // A CDK app can contain multiple stacks. You can view a list of all the stacks in your
            // app by typing `cdk list`.
            new HelloStack(app, "hello-cdk-1", new StackProps());
            new HelloStack(app, "hello-cdk-2", new StackProps());

            // Your app must write the return value of app.Run() to standard output. The `cdk init`
            // and `cdk synth` commands require this output.
            Console.WriteLine(app.Run());
        }
    }
}
