using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Identifier of an instance</summary>
    [JsiiClass(typeof(InstanceIdentifier), "@aws-cdk/aws-rds.InstanceIdentifier", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstanceIdentifier : Token
    {
        public InstanceIdentifier(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstanceIdentifier(ByRefValue reference): base(reference)
        {
        }

        protected InstanceIdentifier(DeputyProps props): base(props)
        {
        }
    }
}