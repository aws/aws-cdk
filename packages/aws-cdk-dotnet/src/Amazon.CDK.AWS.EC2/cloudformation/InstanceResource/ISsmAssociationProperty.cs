using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-ssmassociations.html </remarks>
    [JsiiInterface(typeof(ISsmAssociationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.SsmAssociationProperty")]
    public interface ISsmAssociationProperty
    {
        /// <summary>``InstanceResource.SsmAssociationProperty.AssociationParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-ssmassociations.html#cfn-ec2-instance-ssmassociations-associationparameters </remarks>
        [JsiiProperty("associationParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.AssociationParameterProperty\"}]}}}}]},\"optional\":true}")]
        object AssociationParameters
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.SsmAssociationProperty.DocumentName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-ssmassociations.html#cfn-ec2-instance-ssmassociations-documentname </remarks>
        [JsiiProperty("documentName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DocumentName
        {
            get;
            set;
        }
    }
}