using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html </remarks>
    public class DBSecurityGroupIngressResourceProps : DeputyBase, IDBSecurityGroupIngressResourceProps
    {
        /// <summary>``AWS::RDS::DBSecurityGroupIngress.DBSecurityGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html#cfn-rds-securitygroup-ingress-dbsecuritygroupname </remarks>
        [JsiiProperty("dbSecurityGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DbSecurityGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroupIngress.CIDRIP``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html#cfn-rds-securitygroup-ingress-cidrip </remarks>
        [JsiiProperty("cidrip", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Cidrip
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroupIngress.EC2SecurityGroupId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html#cfn-rds-securitygroup-ingress-ec2securitygroupid </remarks>
        [JsiiProperty("ec2SecurityGroupId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SecurityGroupId
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroupIngress.EC2SecurityGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html#cfn-rds-securitygroup-ingress-ec2securitygroupname </remarks>
        [JsiiProperty("ec2SecurityGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SecurityGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::RDS::DBSecurityGroupIngress.EC2SecurityGroupOwnerId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-security-group-ingress.html#cfn-rds-securitygroup-ingress-ec2securitygroupownerid </remarks>
        [JsiiProperty("ec2SecurityGroupOwnerId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ec2SecurityGroupOwnerId
        {
            get;
            set;
        }
    }
}