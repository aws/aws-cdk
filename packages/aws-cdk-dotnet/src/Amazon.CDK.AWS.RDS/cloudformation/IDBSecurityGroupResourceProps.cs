using Amazon.CDK;
using Amazon.CDK.AWS.RDS.cloudformation.DBSecurityGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-security-group.html </remarks>
    [JsiiInterface(typeof(IDBSecurityGroupResourceProps), "@aws-cdk/aws-rds.cloudformation.DBSecurityGroupResourceProps")]
    public interface IDBSecurityGroupResourceProps
    {
        /// <summary>``AWS::RDS::DBSecurityGroup.DBSecurityGroupIngress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-security-group.html#cfn-rds-dbsecuritygroup-dbsecuritygroupingress </remarks>
        [JsiiProperty("dbSecurityGroupIngress", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.DBSecurityGroupResource.IngressProperty\"}]}}}}]}}")]
        object DbSecurityGroupIngress
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroup.GroupDescription``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-security-group.html#cfn-rds-dbsecuritygroup-groupdescription </remarks>
        [JsiiProperty("groupDescription", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object GroupDescription
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroup.EC2VpcId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-security-group.html#cfn-rds-dbsecuritygroup-ec2vpcid </remarks>
        [JsiiProperty("ec2VpcId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Ec2VpcId
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroup.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-security-group.html#cfn-rds-dbsecuritygroup-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}")]
        object Tags
        {
            get;
            set;
        }
    }
}