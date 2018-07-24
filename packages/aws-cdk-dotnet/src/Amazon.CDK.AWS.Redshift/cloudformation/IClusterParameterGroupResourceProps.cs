using Amazon.CDK;
using Amazon.CDK.AWS.Redshift.cloudformation.ClusterParameterGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html </remarks>
    [JsiiInterface(typeof(IClusterParameterGroupResourceProps), "@aws-cdk/aws-redshift.cloudformation.ClusterParameterGroupResourceProps")]
    public interface IClusterParameterGroupResourceProps
    {
        /// <summary>``AWS::Redshift::ClusterParameterGroup.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterParameterGroup.ParameterGroupFamily``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-parametergroupfamily </remarks>
        [JsiiProperty("parameterGroupFamily", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ParameterGroupFamily
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterParameterGroup.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-redshift.cloudformation.ClusterParameterGroupResource.ParameterProperty\"}]}}}}]},\"optional\":true}")]
        object Parameters
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterParameterGroup.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clusterparametergroup.html#cfn-redshift-clusterparametergroup-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }
    }
}