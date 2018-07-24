using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(RoleArn), "@aws-cdk/aws-iam.RoleArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class RoleArn : Arn
    {
        public RoleArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected RoleArn(ByRefValue reference): base(reference)
        {
        }

        protected RoleArn(DeputyProps props): base(props)
        {
        }
    }
}