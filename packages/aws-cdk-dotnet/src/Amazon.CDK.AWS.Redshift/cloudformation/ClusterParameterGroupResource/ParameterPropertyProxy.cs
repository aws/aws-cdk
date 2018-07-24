using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift.cloudformation.ClusterParameterGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-property-redshift-clusterparametergroup-parameter.html </remarks>
    [JsiiInterfaceProxy(typeof(IParameterProperty), "@aws-cdk/aws-redshift.cloudformation.ClusterParameterGroupResource.ParameterProperty")]
    internal class ParameterPropertyProxy : DeputyBase, IParameterProperty
    {
        private ParameterPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterParameterGroupResource.ParameterProperty.ParameterName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-property-redshift-clusterparametergroup-parameter.html#cfn-redshift-clusterparametergroup-parameter-parametername </remarks>
        [JsiiProperty("parameterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ParameterName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterParameterGroupResource.ParameterProperty.ParameterValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-property-redshift-clusterparametergroup-parameter.html#cfn-redshift-clusterparametergroup-parameter-parametervalue </remarks>
        [JsiiProperty("parameterValue", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ParameterValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}