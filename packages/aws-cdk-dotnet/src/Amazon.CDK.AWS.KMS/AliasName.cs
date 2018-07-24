using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.KMS
{
    [JsiiClass(typeof(AliasName), "@aws-cdk/aws-kms.AliasName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class AliasName : Token
    {
        public AliasName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected AliasName(ByRefValue reference): base(reference)
        {
        }

        protected AliasName(DeputyProps props): base(props)
        {
        }
    }
}