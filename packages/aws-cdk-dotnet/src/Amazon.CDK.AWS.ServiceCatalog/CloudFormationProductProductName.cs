using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(CloudFormationProductProductName), "@aws-cdk/aws-servicecatalog.CloudFormationProductProductName", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFormationProductProductName : Token
    {
        public CloudFormationProductProductName(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFormationProductProductName(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProductProductName(DeputyProps props): base(props)
        {
        }
    }
}