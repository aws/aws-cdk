using Amazon.CDK;
using System;

namespace HelloCdk
{
    class Program
    {
        static void Main(string[] args)
        {
            App app = new App(args);

            new HelloStack(app, "hello-cdk-1", new StackProps());
            new HelloStack(app, "hello-cdk-2", new StackProps());

            Console.WriteLine(app.Run());
        }
    }
}
