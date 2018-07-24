using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(CloudFormationProvisionedProductRecordId), "@aws-cdk/aws-servicecatalog.CloudFormationProvisionedProductRecordId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFormationProvisionedProductRecordId : Token
    {
        public CloudFormationProvisionedProductRecordId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFormationProvisionedProductRecordId(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProvisionedProductRecordId(DeputyProps props): base(props)
        {
        }
    }
}