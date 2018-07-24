using Amazon.CDK.CXAPI;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>Represents a CDK program.</summary>
    [JsiiClass(typeof(App), "@aws-cdk/cdk.App", "[{\"name\":\"argv\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}}]")]
    public class App : Root
    {
        public App(string[] argv): base(new DeputyProps(new object[]{argv}))
        {
        }

        protected App(ByRefValue reference): base(reference)
        {
        }

        protected App(DeputyProps props): base(props)
        {
        }

        /// <summary>Runs the program</summary>
        /// <returns>STDOUT</returns>
        [JsiiMethod("run", "{\"primitive\":\"string\"}", "[]")]
        public virtual string Run()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }

        /// <remarks>deprecated: Use app.run().</remarks>
        [JsiiMethod("exec", "{\"primitive\":\"string\",\"promise\":true}", "[]")]
        public virtual string Exec()
        {
            return InvokeInstanceMethod<string>(new object[]{});
        }

        /// <summary>Lists all stacks in this app.</summary>
        [JsiiMethod("listStacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.StackInfo\"}}}", "[]")]
        public virtual IStackInfo[] ListStacks()
        {
            return InvokeInstanceMethod<IStackInfo[]>(new object[]{});
        }

        /// <summary>Synthesize and validate a single stack</summary>
        /// <param name = "stackName">The name of the stack to synthesize</param>
        [JsiiMethod("synthesizeStack", "{\"fqn\":\"@aws-cdk/cx-api.SynthesizedStack\"}", "[{\"name\":\"stackName\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual ISynthesizedStack SynthesizeStack(string stackName)
        {
            return InvokeInstanceMethod<ISynthesizedStack>(new object[]{stackName});
        }

        /// <summary>Synthesizes multiple stacks</summary>
        [JsiiMethod("synthesizeStacks", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cx-api.SynthesizedStack\"}}}", "[{\"name\":\"stackNames\",\"type\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}}]")]
        public virtual ISynthesizedStack[] SynthesizeStacks(string[] stackNames)
        {
            return InvokeInstanceMethod<ISynthesizedStack[]>(new object[]{stackNames});
        }

        /// <summary>Returns metadata for all constructs in the stack.</summary>
        [JsiiMethod("collectMetadata", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.MetadataEntry\"}}}}}", "[{\"name\":\"stack\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Stack\"}}]")]
        public virtual IDictionary<string, IMetadataEntry[]> CollectMetadata(Stack stack)
        {
            return InvokeInstanceMethod<IDictionary<string, IMetadataEntry[]>>(new object[]{stack});
        }
    }
}