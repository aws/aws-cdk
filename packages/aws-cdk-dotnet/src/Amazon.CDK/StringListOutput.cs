using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// An output for a list of strings.
    /// 
    /// Exports a list of Tokens via an Output variable, and return a list of Tokens
    /// that selects the imported values for them.
    /// </summary>
    [JsiiClass(typeof(StringListOutput), "@aws-cdk/cdk.StringListOutput", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/cdk.StringListOutputProps\"}}]")]
    public class StringListOutput : Construct
    {
        public StringListOutput(Construct parent, string name, IStringListOutputProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected StringListOutput(ByRefValue reference): base(reference)
        {
        }

        protected StringListOutput(DeputyProps props): base(props)
        {
        }

        /// <summary>Number of elements in the stringlist</summary>
        [JsiiProperty("length", "{\"primitive\":\"number\"}")]
        public virtual double Length
        {
            get => GetInstanceProperty<double>();
        }

        /// <summary>Return an array of imported values for this Output</summary>
        [JsiiMethod("makeImportValues", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.Token\"}}}", "[]")]
        public virtual Token[] MakeImportValues()
        {
            return InvokeInstanceMethod<Token[]>(new object[]{});
        }
    }
}