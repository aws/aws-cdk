using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Port part of an address</summary>
    [JsiiClass(typeof(Port), "@aws-cdk/aws-rds.Port", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Port : Token
    {
        public Port(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Port(ByRefValue reference): base(reference)
        {
        }

        protected Port(DeputyProps props): base(props)
        {
        }
    }
}