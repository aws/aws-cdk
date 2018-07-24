using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK
{
    /// <summary>
    /// The intrinsic function Fn::Sub substitutes variables in an input string with values that
    /// you specify. In your templates, you can use this function to construct commands or outputs
    /// that include values that aren't available until you create or update a stack.
    /// </summary>
    [JsiiClass(typeof(FnSub), "@aws-cdk/cdk.FnSub", "[{\"name\":\"body\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"variables\",\"type\":{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}},\"optional\":true}}]")]
    public class FnSub : Fn
    {
        public FnSub(string body, IDictionary<string, object> variables): base(new DeputyProps(new object[]{body, variables}))
        {
        }

        protected FnSub(ByRefValue reference): base(reference)
        {
        }

        protected FnSub(DeputyProps props): base(props)
        {
        }
    }
}