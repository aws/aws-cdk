using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(InstanceProfileArn), "@aws-cdk/aws-iam.InstanceProfileArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class InstanceProfileArn : Arn
    {
        public InstanceProfileArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected InstanceProfileArn(ByRefValue reference): base(reference)
        {
        }

        protected InstanceProfileArn(DeputyProps props): base(props)
        {
        }
    }
}