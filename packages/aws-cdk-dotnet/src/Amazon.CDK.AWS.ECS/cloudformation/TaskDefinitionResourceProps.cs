using Amazon.CDK;
using Amazon.CDK.AWS.ECS.cloudformation.TaskDefinitionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html </remarks>
    public class TaskDefinitionResourceProps : DeputyBase, ITaskDefinitionResourceProps
    {
        /// <summary>``AWS::ECS::TaskDefinition.ContainerDefinitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-containerdefinitions </remarks>
        [JsiiProperty("containerDefinitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.ContainerDefinitionProperty\"}]}}}}]},\"optional\":true}", true)]
        public object ContainerDefinitions
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.Cpu``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-cpu </remarks>
        [JsiiProperty("cpu", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Cpu
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.ExecutionRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-executionrolearn </remarks>
        [JsiiProperty("executionRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ExecutionRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.Family``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-family </remarks>
        [JsiiProperty("family", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Family
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.Memory``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-memory </remarks>
        [JsiiProperty("memory", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Memory
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.NetworkMode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-networkmode </remarks>
        [JsiiProperty("networkMode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NetworkMode
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.PlacementConstraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-placementconstraints </remarks>
        [JsiiProperty("placementConstraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty\"}]}}}}]},\"optional\":true}", true)]
        public object PlacementConstraints
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.RequiresCompatibilities``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-requirescompatibilities </remarks>
        [JsiiProperty("requiresCompatibilities", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object RequiresCompatibilities
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.TaskRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-taskrolearn </remarks>
        [JsiiProperty("taskRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object TaskRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::ECS::TaskDefinition.Volumes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-taskdefinition.html#cfn-ecs-taskdefinition-volumes </remarks>
        [JsiiProperty("volumes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.TaskDefinitionResource.VolumeProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Volumes
        {
            get;
            set;
        }
    }
}