using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(SubnetAvailabilityZone), "@aws-cdk/aws-ec2.SubnetAvailabilityZone", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class SubnetAvailabilityZone : Token
    {
        public SubnetAvailabilityZone(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected SubnetAvailabilityZone(ByRefValue reference): base(reference)
        {
        }

        protected SubnetAvailabilityZone(DeputyProps props): base(props)
        {
        }
    }
}