using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda
{
    [JsiiClass(typeof(Version), "@aws-cdk/aws-lambda.Version", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Version : Token
    {
        public Version(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Version(ByRefValue reference): base(reference)
        {
        }

        protected Version(DeputyProps props): base(props)
        {
        }
    }
}