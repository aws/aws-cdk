using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html </remarks>
    [JsiiInterface(typeof(IMaintenanceWindowRunCommandParametersProperty), "@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty")]
    public interface IMaintenanceWindowRunCommandParametersProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Comment
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.DocumentHash``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthash </remarks>
        [JsiiProperty("documentHash", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DocumentHash
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.DocumentHashType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-documenthashtype </remarks>
        [JsiiProperty("documentHashType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DocumentHashType
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.NotificationConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-notificationconfig </remarks>
        [JsiiProperty("notificationConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.NotificationConfigProperty\"}]},\"optional\":true}")]
        object NotificationConfig
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.OutputS3BucketName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3bucketname </remarks>
        [JsiiProperty("outputS3BucketName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OutputS3BucketName
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.OutputS3KeyPrefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-outputs3keyprefix </remarks>
        [JsiiProperty("outputS3KeyPrefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object OutputS3KeyPrefix
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Parameters
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.ServiceRoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-servicerolearn </remarks>
        [JsiiProperty("serviceRoleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ServiceRoleArn
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty.TimeoutSeconds``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowruncommandparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowruncommandparameters-timeoutseconds </remarks>
        [JsiiProperty("timeoutSeconds", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TimeoutSeconds
        {
            get;
            set;
        }
    }
}