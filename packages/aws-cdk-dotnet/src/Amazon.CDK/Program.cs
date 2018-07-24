using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    [JsiiClass(typeof(Program), "@aws-cdk/cdk.Program", "[{\"name\":\"argv\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}}]")]
    public class Program : App
    {
        public Program(string[] argv): base(new DeputyProps(new object[]{argv}))
        {
        }

        protected Program(ByRefValue reference): base(reference)
        {
        }

        protected Program(DeputyProps props): base(props)
        {
        }
    }
}