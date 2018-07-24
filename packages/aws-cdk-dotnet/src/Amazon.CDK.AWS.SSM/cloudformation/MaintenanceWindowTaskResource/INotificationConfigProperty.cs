using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html </remarks>
    [JsiiInterface(typeof(INotificationConfigProperty), "@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.NotificationConfigProperty")]
    public interface INotificationConfigProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.NotificationConfigProperty.NotificationArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationarn </remarks>
        [JsiiProperty("notificationArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object NotificationArn
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.NotificationConfigProperty.NotificationEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationevents </remarks>
        [JsiiProperty("notificationEvents", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object NotificationEvents
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.NotificationConfigProperty.NotificationType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-notificationconfig.html#cfn-ssm-maintenancewindowtask-notificationconfig-notificationtype </remarks>
        [JsiiProperty("notificationType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object NotificationType
        {
            get;
            set;
        }
    }
}