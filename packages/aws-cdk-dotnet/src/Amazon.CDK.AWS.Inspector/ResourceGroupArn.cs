using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Inspector
{
    [JsiiClass(typeof(ResourceGroupArn), "@aws-cdk/aws-inspector.ResourceGroupArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ResourceGroupArn : Arn
    {
        public ResourceGroupArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ResourceGroupArn(ByRefValue reference): base(reference)
        {
        }

        protected ResourceGroupArn(DeputyProps props): base(props)
        {
        }
    }
}