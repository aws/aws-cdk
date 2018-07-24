using Amazon.CDK;
using Amazon.CDK.AWS.EC2.cloudformation.InstanceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html </remarks>
    public class InstanceResourceProps : DeputyBase, IInstanceResourceProps
    {
        /// <summary>``AWS::EC2::Instance.AdditionalInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-additionalinfo </remarks>
        [JsiiProperty("additionalInfo", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AdditionalInfo
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Affinity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-affinity </remarks>
        [JsiiProperty("affinity", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Affinity
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.AvailabilityZone``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-availabilityzone </remarks>
        [JsiiProperty("availabilityZone", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AvailabilityZone
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.BlockDeviceMappings``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-blockdevicemappings </remarks>
        [JsiiProperty("blockDeviceMappings", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.BlockDeviceMappingProperty\"}]}}}}]},\"optional\":true}", true)]
        public object BlockDeviceMappings
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.CreditSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-creditspecification </remarks>
        [JsiiProperty("creditSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.CreditSpecificationProperty\"}]},\"optional\":true}", true)]
        public object CreditSpecification
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.DisableApiTermination``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-disableapitermination </remarks>
        [JsiiProperty("disableApiTermination", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DisableApiTermination
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.EbsOptimized``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-ebsoptimized </remarks>
        [JsiiProperty("ebsOptimized", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EbsOptimized
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.ElasticGpuSpecifications``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-elasticgpuspecifications </remarks>
        [JsiiProperty("elasticGpuSpecifications", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.ElasticGpuSpecificationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object ElasticGpuSpecifications
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.HostId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-hostid </remarks>
        [JsiiProperty("hostId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object HostId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.IamInstanceProfile``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-iaminstanceprofile </remarks>
        [JsiiProperty("iamInstanceProfile", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object IamInstanceProfile
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.ImageId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-imageid </remarks>
        [JsiiProperty("imageId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ImageId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.InstanceInitiatedShutdownBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-instanceinitiatedshutdownbehavior </remarks>
        [JsiiProperty("instanceInitiatedShutdownBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InstanceInitiatedShutdownBehavior
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.InstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-instancetype </remarks>
        [JsiiProperty("instanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object InstanceType
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Ipv6AddressCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-ipv6addresscount </remarks>
        [JsiiProperty("ipv6AddressCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Ipv6AddressCount
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Ipv6Addresses``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-ipv6addresses </remarks>
        [JsiiProperty("ipv6Addresses", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.InstanceIpv6AddressProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Ipv6Addresses
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.KernelId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-kernelid </remarks>
        [JsiiProperty("kernelId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KernelId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.KeyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-keyname </remarks>
        [JsiiProperty("keyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KeyName
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.LaunchTemplate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-launchtemplate </remarks>
        [JsiiProperty("launchTemplate", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.LaunchTemplateSpecificationProperty\"}]},\"optional\":true}", true)]
        public object LaunchTemplate
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Monitoring``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-monitoring </remarks>
        [JsiiProperty("monitoring", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Monitoring
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.NetworkInterfaces``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-networkinterfaces </remarks>
        [JsiiProperty("networkInterfaces", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.NetworkInterfaceProperty\"}]}}}}]},\"optional\":true}", true)]
        public object NetworkInterfaces
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.PlacementGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-placementgroupname </remarks>
        [JsiiProperty("placementGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PlacementGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.PrivateIpAddress``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-privateipaddress </remarks>
        [JsiiProperty("privateIpAddress", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PrivateIpAddress
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.RamdiskId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-ramdiskid </remarks>
        [JsiiProperty("ramdiskId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object RamdiskId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.SecurityGroupIds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-securitygroupids </remarks>
        [JsiiProperty("securityGroupIds", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object SecurityGroupIds
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.SecurityGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-securitygroups </remarks>
        [JsiiProperty("securityGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object SecurityGroups
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.SourceDestCheck``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-sourcedestcheck </remarks>
        [JsiiProperty("sourceDestCheck", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SourceDestCheck
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.SsmAssociations``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-ssmassociations </remarks>
        [JsiiProperty("ssmAssociations", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.SsmAssociationProperty\"}]}}}}]},\"optional\":true}", true)]
        public object SsmAssociations
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.SubnetId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-subnetid </remarks>
        [JsiiProperty("subnetId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SubnetId
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Tenancy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-tenancy </remarks>
        [JsiiProperty("tenancy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Tenancy
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.UserData``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-userdata </remarks>
        [JsiiProperty("userData", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object UserData
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::Instance.Volumes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-volumes </remarks>
        [JsiiProperty("volumes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.InstanceResource.VolumeProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Volumes
        {
            get;
            set;
        }
    }
}