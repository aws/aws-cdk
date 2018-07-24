using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudTrail.cloudformation.TrailResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html </remarks>
    public class EventSelectorProperty : DeputyBase, IEventSelectorProperty
    {
        /// <summary>``TrailResource.EventSelectorProperty.DataResources``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-dataresources </remarks>
        [JsiiProperty("dataResources", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cloudtrail.cloudformation.TrailResource.DataResourceProperty\"}]}}}}]},\"optional\":true}", true)]
        public object DataResources
        {
            get;
            set;
        }

        /// <summary>``TrailResource.EventSelectorProperty.IncludeManagementEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-includemanagementevents </remarks>
        [JsiiProperty("includeManagementEvents", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object IncludeManagementEvents
        {
            get;
            set;
        }

        /// <summary>``TrailResource.EventSelectorProperty.ReadWriteType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudtrail-trail-eventselector.html#cfn-cloudtrail-trail-eventselector-readwritetype </remarks>
        [JsiiProperty("readWriteType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ReadWriteType
        {
            get;
            set;
        }
    }
}