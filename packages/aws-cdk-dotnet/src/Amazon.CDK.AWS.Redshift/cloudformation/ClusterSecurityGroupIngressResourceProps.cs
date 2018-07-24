using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Redshift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html </remarks>
    public class ClusterSecurityGroupIngressResourceProps : DeputyBase, IClusterSecurityGroupIngressResourceProps
    {
        /// <summary>``AWS::Redshift::ClusterSecurityGroupIngress.ClusterSecurityGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-clustersecuritygroupname </remarks>
        [JsiiProperty("clusterSecurityGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ClusterSecurityGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterSecurityGroupIngress.CIDRIP``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-cidrip </remarks>
        [JsiiProperty("cidrip", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Cidrip
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterSecurityGroupIngress.EC2SecurityGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-ec2securitygroupname </remarks>
        [JsiiProperty("ec2SecurityGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SecurityGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::Redshift::ClusterSecurityGroupIngress.EC2SecurityGroupOwnerId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroupingress.html#cfn-redshift-clustersecuritygroupingress-ec2securitygroupownerid </remarks>
        [JsiiProperty("ec2SecurityGroupOwnerId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SecurityGroupOwnerId
        {
            get;
            set;
        }
    }
}