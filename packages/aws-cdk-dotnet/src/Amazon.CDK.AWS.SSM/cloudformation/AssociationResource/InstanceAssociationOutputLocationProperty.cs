using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.AssociationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html </remarks>
    public class InstanceAssociationOutputLocationProperty : DeputyBase, IInstanceAssociationOutputLocationProperty
    {
        /// <summary>``AssociationResource.InstanceAssociationOutputLocationProperty.S3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html#cfn-ssm-association-instanceassociationoutputlocation-s3location </remarks>
        [JsiiProperty("s3Location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.AssociationResource.S3OutputLocationProperty\"}]},\"optional\":true}", true)]
        public object S3Location
        {
            get;
            set;
        }
    }
}