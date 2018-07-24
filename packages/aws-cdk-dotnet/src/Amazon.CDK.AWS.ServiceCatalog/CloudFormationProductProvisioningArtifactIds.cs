using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(CloudFormationProductProvisioningArtifactIds), "@aws-cdk/aws-servicecatalog.CloudFormationProductProvisioningArtifactIds", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFormationProductProvisioningArtifactIds : Token
    {
        public CloudFormationProductProvisioningArtifactIds(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFormationProductProvisioningArtifactIds(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProductProvisioningArtifactIds(DeputyProps props): base(props)
        {
        }
    }
}