using Amazon.CDK;
using Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SSM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html </remarks>
    public class MaintenanceWindowTaskResourceProps : DeputyBase, IMaintenanceWindowTaskResourceProps
    {
        /// <summary>``AWS::SSM::MaintenanceWindowTask.MaxConcurrency``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxconcurrency </remarks>
        [JsiiProperty("maxConcurrency", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object MaxConcurrency
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.MaxErrors``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-maxerrors </remarks>
        [JsiiProperty("maxErrors", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object MaxErrors
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.Priority``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-priority </remarks>
        [JsiiProperty("priority", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Priority
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.ServiceRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-servicerolearn </remarks>
        [JsiiProperty("serviceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ServiceRoleArn
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.Targets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-targets </remarks>
        [JsiiProperty("targets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.TargetProperty\"}]}}}}]}}", true)]
        public object Targets
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.TaskArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskarn </remarks>
        [JsiiProperty("taskArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TaskArn
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.TaskType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-tasktype </remarks>
        [JsiiProperty("taskType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TaskType
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.LoggingInfo``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-logginginfo </remarks>
        [JsiiProperty("loggingInfo", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.LoggingInfoProperty\"}]},\"optional\":true}", true)]
        public object LoggingInfo
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-name </remarks>
        [JsiiProperty("maintenanceWindowTaskName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaintenanceWindowTaskName
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.TaskInvocationParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters </remarks>
        [JsiiProperty("taskInvocationParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.TaskInvocationParametersProperty\"}]},\"optional\":true}", true)]
        public object TaskInvocationParameters
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.TaskParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-taskparameters </remarks>
        [JsiiProperty("taskParameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object TaskParameters
        {
            get;
            set;
        }

        /// <summary>``AWS::SSM::MaintenanceWindowTask.WindowId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-maintenancewindowtask.html#cfn-ssm-maintenancewindowtask-windowid </remarks>
        [JsiiProperty("windowId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object WindowId
        {
            get;
            set;
        }
    }
}