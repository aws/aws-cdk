using Amazon.CDK;
using Amazon.CDK.AWS.EC2.cloudformation.NetworkAclEntryResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html </remarks>
    public class NetworkAclEntryResourceProps : DeputyBase, INetworkAclEntryResourceProps
    {
        /// <summary>``AWS::EC2::NetworkAclEntry.CidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-cidrblock </remarks>
        [JsiiProperty("cidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object CidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.NetworkAclId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-networkaclid </remarks>
        [JsiiProperty("networkAclId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object NetworkAclId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.Protocol``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-protocol </remarks>
        [JsiiProperty("protocol", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Protocol
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.RuleAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-ruleaction </remarks>
        [JsiiProperty("ruleAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RuleAction
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.RuleNumber``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-rulenumber </remarks>
        [JsiiProperty("ruleNumber", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object RuleNumber
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.Egress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-egress </remarks>
        [JsiiProperty("egress", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Egress
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.Icmp``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-icmp </remarks>
        [JsiiProperty("icmp", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.NetworkAclEntryResource.IcmpProperty\"}]},\"optional\":true}", true)]
        public object Icmp
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.Ipv6CidrBlock``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-ipv6cidrblock </remarks>
        [JsiiProperty("ipv6CidrBlock", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ipv6CidrBlock
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::NetworkAclEntry.PortRange``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-network-acl-entry.html#cfn-ec2-networkaclentry-portrange </remarks>
        [JsiiProperty("portRange", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.NetworkAclEntryResource.PortRangeProperty\"}]},\"optional\":true}", true)]
        public object PortRange
        {
            get;
            set;
        }
    }
}