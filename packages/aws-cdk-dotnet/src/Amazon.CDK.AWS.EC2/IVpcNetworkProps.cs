using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>VpcNetworkProps allows you to specify configuration options for a VPC</summary>
    [JsiiInterface(typeof(IVpcNetworkProps), "@aws-cdk/aws-ec2.VpcNetworkProps")]
    public interface IVpcNetworkProps
    {
        /// <summary>
        /// The CIDR range to use for the VPC (e.g. '10.0.0.0/16'). Should be a minimum of /28 and maximum size of /16.
        /// The range will be split evenly into two subnets per Availability Zone (one public, one private).
        /// </summary>
        [JsiiProperty("cidr", "{\"primitive\":\"string\",\"optional\":true}")]
        string Cidr
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates whether the instances launched in the VPC get public DNS hostnames.
        /// If this attribute is true, instances in the VPC get public DNS hostnames,
        /// but only if the enableDnsSupport attribute is also set to true.
        /// </summary>
        [JsiiProperty("enableDnsHostnames", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? EnableDnsHostnames
        {
            get;
            set;
        }

        /// <summary>
        /// Indicates whether the DNS resolution is supported for the VPC. If this attribute
        /// is false, the Amazon-provided DNS server in the VPC that resolves public DNS hostnames
        /// to IP addresses is not enabled. If this attribute is true, queries to the Amazon
        /// provided DNS server at the 169.254.169.253 IP address, or the reserved IP address
        /// at the base of the VPC IPv4 network range plus two will succeed.
        /// </summary>
        [JsiiProperty("enableDnsSupport", "{\"primitive\":\"boolean\",\"optional\":true}")]
        bool? EnableDnsSupport
        {
            get;
            set;
        }

        /// <summary>
        /// The default tenancy of instances launched into the VPC.
        /// By default, instances will be launched with default (shared) tenancy.
        /// By setting this to dedicated tenancy, instances will be launched on hardware dedicated
        /// to a single AWS customer, unless specifically specified at instance launch time.
        /// Please note, not all instance types are usable with Dedicated tenancy.
        /// </summary>
        [JsiiProperty("defaultInstanceTenancy", "{\"fqn\":\"@aws-cdk/aws-ec2.DefaultInstanceTenancy\",\"optional\":true}")]
        DefaultInstanceTenancy DefaultInstanceTenancy
        {
            get;
            set;
        }

        /// <summary>The AWS resource tags to associate with the VPC.</summary>
        [JsiiProperty("tags", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/cdk.Tag\"}},\"optional\":true}")]
        ITag[] Tags
        {
            get;
            set;
        }

        /// <summary>
        /// Define the maximum number of AZs to use in this region
        /// 
        /// If the region has more AZs than you want to use (for example, because of EIP limits),
        /// pick a lower number here. The AZs will be sorted and picked from the start of the list.
        /// </summary>
        /// <remarks>default: All AZs in the region</remarks>
        [JsiiProperty("maxAZs", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MaxAZs
        {
            get;
            set;
        }

        /// <summary>
        /// Define the maximum number of NAT Gateways for this VPC
        /// 
        /// Setting this number enables a VPC to trade availability for the cost of
        /// running a NAT Gateway. For example, if set this to 1 and your subnet
        /// configuration is for 3 Public subnets with natGateway = `true` then only
        /// one of the Public subnets will have a gateway and all Private subnets
        /// will route to this NAT Gateway.
        /// </summary>
        /// <remarks>default: maxAZs</remarks>
        [JsiiProperty("natGateways", "{\"primitive\":\"number\",\"optional\":true}")]
        double? NatGateways
        {
            get;
            set;
        }

        /// <summary>
        /// Configure the subnets to build for each AZ
        /// 
        /// The subnets are constructed in the context of the VPC so you only need
        /// specify the configuration. The VPC details (VPC ID, specific CIDR,
        /// specific AZ will be calculated during creation)
        /// 
        /// For example if you want 1 public subnet, 1 private subnet, and 1 isolated
        /// subnet in each AZ provide the following:
        /// subnetConfiguration: [
        ///       {
        ///           cidrMask: 24,
        ///           name: 'ingress',
        ///           subnetType: SubnetType.Public,
        ///       },
        ///       {
        ///           cidrMask: 24,
        ///           name: 'application',
        ///           subnetType: SubnetType.Private,
        ///       },
        ///       {
        ///           cidrMask: 28,
        ///           name: 'rds',
        ///           subnetType: SubnetType.Isolated,
        ///       }
        /// ]
        /// 
        /// `cidrMask` is optional and if not provided the IP space in the VPC will be
        /// evenly divided between the requested subnets.
        /// </summary>
        /// <remarks>
        /// default: the VPC CIDR will be evenly divided between 1 public and 1
        /// private subnet per AZ
        /// </remarks>
        [JsiiProperty("subnetConfiguration", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-ec2.SubnetConfiguration\"}},\"optional\":true}")]
        ISubnetConfiguration[] SubnetConfiguration
        {
            get;
            set;
        }
    }
}