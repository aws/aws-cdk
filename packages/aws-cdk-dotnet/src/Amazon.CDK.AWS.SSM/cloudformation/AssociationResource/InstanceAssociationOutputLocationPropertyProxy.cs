using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.AssociationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html </remarks>
    [JsiiInterfaceProxy(typeof(IInstanceAssociationOutputLocationProperty), "@aws-cdk/aws-ssm.cloudformation.AssociationResource.InstanceAssociationOutputLocationProperty")]
    internal class InstanceAssociationOutputLocationPropertyProxy : DeputyBase, IInstanceAssociationOutputLocationProperty
    {
        private InstanceAssociationOutputLocationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AssociationResource.InstanceAssociationOutputLocationProperty.S3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-instanceassociationoutputlocation.html#cfn-ssm-association-instanceassociationoutputlocation-s3location </remarks>
        [JsiiProperty("s3Location", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.AssociationResource.S3OutputLocationProperty\"}]},\"optional\":true}")]
        public virtual object S3Location
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}