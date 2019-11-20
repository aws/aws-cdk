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
            new %name.PascalCased%Stack(app, "%name.PascalCased%Stack", new StackProps());

            app.Synth();
        }
    }
}
