using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiClass(typeof(KeyArn), "@aws-cdk/aws-kms.KeyArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class KeyArn : Arn
    {
        public KeyArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected KeyArn(ByRefValue reference): base(reference)
        {
        }

        protected KeyArn(DeputyProps props): base(props)
        {
        }
    }
}