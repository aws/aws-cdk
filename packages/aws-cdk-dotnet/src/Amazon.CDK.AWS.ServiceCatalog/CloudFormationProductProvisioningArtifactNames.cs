using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ServiceCatalog
{
    [JsiiClass(typeof(CloudFormationProductProvisioningArtifactNames), "@aws-cdk/aws-servicecatalog.CloudFormationProductProvisioningArtifactNames", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class CloudFormationProductProvisioningArtifactNames : Token
    {
        public CloudFormationProductProvisioningArtifactNames(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected CloudFormationProductProvisioningArtifactNames(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProductProvisioningArtifactNames(DeputyProps props): base(props)
        {
        }
    }
}