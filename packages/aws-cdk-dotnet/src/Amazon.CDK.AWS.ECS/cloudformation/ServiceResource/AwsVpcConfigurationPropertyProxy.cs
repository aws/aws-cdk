using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IAwsVpcConfigurationProperty), "@aws-cdk/aws-ecs.cloudformation.ServiceResource.AwsVpcConfigurationProperty")]
    internal class AwsVpcConfigurationPropertyProxy : DeputyBase, IAwsVpcConfigurationProperty
    {
        private AwsVpcConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ServiceResource.AwsVpcConfigurationProperty.AssignPublicIp``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-assignpublicip </remarks>
        [JsiiProperty("assignPublicIp", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AssignPublicIp
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ServiceResource.AwsVpcConfigurationProperty.SecurityGroups``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-securitygroups </remarks>
        [JsiiProperty("securityGroups", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object SecurityGroups
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ServiceResource.AwsVpcConfigurationProperty.Subnets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-awsvpcconfiguration.html#cfn-ecs-service-awsvpcconfiguration-subnets </remarks>
        [JsiiProperty("subnets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]}}")]
        public virtual object Subnets
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}