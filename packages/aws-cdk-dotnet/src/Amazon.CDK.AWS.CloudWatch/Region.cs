using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudWatch
{
    /// <summary>An AWS region</summary>
    [JsiiClass(typeof(Region), "@aws-cdk/aws-cloudwatch.Region", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class Region : Token
    {
        public Region(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected Region(ByRefValue reference): base(reference)
        {
        }

        protected Region(DeputyProps props): base(props)
        {
        }
    }
}