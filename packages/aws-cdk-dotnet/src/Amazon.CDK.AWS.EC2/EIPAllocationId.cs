using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    [JsiiClass(typeof(EIPAllocationId), "@aws-cdk/aws-ec2.EIPAllocationId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class EIPAllocationId : Token
    {
        public EIPAllocationId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected EIPAllocationId(ByRefValue reference): base(reference)
        {
        }

        protected EIPAllocationId(DeputyProps props): base(props)
        {
        }
    }
}