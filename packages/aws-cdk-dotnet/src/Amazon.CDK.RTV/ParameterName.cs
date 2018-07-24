using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.RTV
{
    /// <summary>The full name of the runtime value's SSM parameter.</summary>
    [JsiiClass(typeof(ParameterName), "@aws-cdk/rtv.ParameterName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ParameterName : Token
    {
        public ParameterName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ParameterName(ByRefValue reference): base(reference)
        {
        }

        protected ParameterName(DeputyProps props): base(props)
        {
        }
    }
}