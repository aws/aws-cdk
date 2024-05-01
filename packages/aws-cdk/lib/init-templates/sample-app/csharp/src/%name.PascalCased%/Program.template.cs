using Amazon.CDK;

namespace %name.PascalCased%
{
    sealed class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();
            new %name.PascalCased%Stack(app, "%stackname%");

            app.Synth();
        }
    }
}
