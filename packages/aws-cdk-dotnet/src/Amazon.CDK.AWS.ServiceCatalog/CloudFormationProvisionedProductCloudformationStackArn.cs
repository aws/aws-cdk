using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(CloudFormationProvisionedProductCloudformationStackArn), "@aws-cdk/aws-servicecatalog.CloudFormationProvisionedProductCloudformationStackArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFormationProvisionedProductCloudformationStackArn : Arn
    {
        public CloudFormationProvisionedProductCloudformationStackArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFormationProvisionedProductCloudformationStackArn(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProvisionedProductCloudformationStackArn(DeputyProps props): base(props)
        {
        }
    }
}