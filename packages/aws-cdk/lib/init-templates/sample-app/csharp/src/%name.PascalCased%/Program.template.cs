using Amazon.CDK;
using System;
using System.Collections.Generic;
using System.Linq;

namespace %name.PascalCased%
{
    class Program
    {
        static void Main(string[] args)
        {
            var app = new App(null);

            // A CDK app can contain multiple stacks. You can view a list of all the stacks in your
            // app by typing `cdk list`.

            new %name.PascalCased%Stack(app, "%name.PascalCased%Stack-1", new StackProps());
            new %name.PascalCased%Stack(app, "%name.PascalCased%Stack-2", new StackProps());

            app.Synth();
        }
    }
}
