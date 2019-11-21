using Amazon.CDK;

namespace %name.PascalCased%
{
    class Program
    {
        static void Main(string[] args)
        {
            var app = new App();
            new %name.PascalCased%Stack(app, "%name.PascalCased%Stack");

            app.Synth();
        }
    }
}
