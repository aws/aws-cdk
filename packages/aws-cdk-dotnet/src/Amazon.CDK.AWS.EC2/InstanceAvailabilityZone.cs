using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(InstanceAvailabilityZone), "@aws-cdk/aws-ec2.InstanceAvailabilityZone", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstanceAvailabilityZone : Token
    {
        public InstanceAvailabilityZone(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstanceAvailabilityZone(ByRefValue reference): base(reference)
        {
        }

        protected InstanceAvailabilityZone(DeputyProps props): base(props)
        {
        }
    }
}