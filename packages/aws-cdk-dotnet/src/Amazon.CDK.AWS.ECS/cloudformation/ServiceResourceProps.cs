using Amazon.CDK;
using Amazon.CDK.AWS.ECS.cloudformation.ServiceResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html </remarks>
    public class ServiceResourceProps : DeputyBase, IServiceResourceProps
    {
        /// <summary>``AWS::ECS::Service.TaskDefinition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-taskdefinition </remarks>
        [JsiiProperty("taskDefinition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TaskDefinition
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.Cluster``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-cluster </remarks>
        [JsiiProperty("cluster", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Cluster
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.DeploymentConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-deploymentconfiguration </remarks>
        [JsiiProperty("deploymentConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.DeploymentConfigurationProperty\"}]},\"optional\":true}", true)]
        public object DeploymentConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.DesiredCount``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-desiredcount </remarks>
        [JsiiProperty("desiredCount", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DesiredCount
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.HealthCheckGracePeriodSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-healthcheckgraceperiodseconds </remarks>
        [JsiiProperty("healthCheckGracePeriodSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object HealthCheckGracePeriodSeconds
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.LaunchType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-launchtype </remarks>
        [JsiiProperty("launchType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LaunchType
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.LoadBalancers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-loadbalancers </remarks>
        [JsiiProperty("loadBalancers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.LoadBalancerProperty\"}]}}}}]},\"optional\":true}", true)]
        public object LoadBalancers
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.NetworkConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-networkconfiguration </remarks>
        [JsiiProperty("networkConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.NetworkConfigurationProperty\"}]},\"optional\":true}", true)]
        public object NetworkConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.PlacementConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-placementconstraints </remarks>
        [JsiiProperty("placementConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.PlacementConstraintProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PlacementConstraints
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.PlacementStrategies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-placementstrategies </remarks>
        [JsiiProperty("placementStrategies", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.PlacementStrategyProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PlacementStrategies
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.PlatformVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-platformversion </remarks>
        [JsiiProperty("platformVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object PlatformVersion
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.Role``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-role </remarks>
        [JsiiProperty("role", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Role
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.ServiceName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-servicename </remarks>
        [JsiiProperty("serviceName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServiceName
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::Service.ServiceRegistries``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-serviceregistries </remarks>
        [JsiiProperty("serviceRegistries", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.ServiceRegistryProperty\"}]}}}}]},\"optional\":true}", true)]
        public object ServiceRegistries
        {
            get;
            set;
        }
    }
}