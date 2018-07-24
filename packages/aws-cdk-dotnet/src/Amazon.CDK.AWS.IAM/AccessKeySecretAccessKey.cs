using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.IAM
{
    [JsiiClass(typeof(AccessKeySecretAccessKey), "@aws-cdk/aws-iam.AccessKeySecretAccessKey", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class AccessKeySecretAccessKey : Token
    {
        public AccessKeySecretAccessKey(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected AccessKeySecretAccessKey(ByRefValue reference): base(reference)
        {
        }

        protected AccessKeySecretAccessKey(DeputyProps props): base(props)
        {
        }
    }
}