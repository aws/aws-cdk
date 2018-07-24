using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail.cloudformation.TrailResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html </remarks>
    [JsiiInterface(typeof(IEventSelectorProperty), "@aws-cdk/aws-cloudtrail.cloudformation.TrailResource.EventSelectorProperty")]
    public interface IEventSelectorProperty
    {
        /// <summary>``TrailResource.EventSelectorProperty.DataResources``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-dataresources </remarks>
        [JsiiProperty("dataResources", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudtrail.cloudformation.TrailResource.DataResourceProperty\"}]}}}}]},\"optional\":true}")]
        object DataResources
        {
            get;
            set;
        }

        /// <summary>``TrailResource.EventSelectorProperty.IncludeManagementEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-includemanagementevents </remarks>
        [JsiiProperty("includeManagementEvents", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object IncludeManagementEvents
        {
            get;
            set;
        }

        /// <summary>``TrailResource.EventSelectorProperty.ReadWriteType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-readwritetype </remarks>
        [JsiiProperty("readWriteType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReadWriteType
        {
            get;
            set;
        }
    }
}