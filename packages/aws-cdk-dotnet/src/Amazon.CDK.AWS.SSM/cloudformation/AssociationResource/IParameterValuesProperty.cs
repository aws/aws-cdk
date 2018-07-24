using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.AssociationResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-parametervalues.html </remarks>
    [JsiiInterface(typeof(IParameterValuesProperty), "@aws-cdk/aws-ssm.cloudformation.AssociationResource.ParameterValuesProperty")]
    public interface IParameterValuesProperty
    {
        /// <summary>``AssociationResource.ParameterValuesProperty.ParameterValues``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-association-parametervalues.html#cfn-ssm-association-parametervalues-parametervalues </remarks>
        [JsiiProperty("parameterValues", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        object ParameterValues
        {
            get;
            set;
        }
    }
}