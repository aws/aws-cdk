function _aws_cdk_aws_appflow_CfnConnectorProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.connectorProvisioningConfig))
            _aws_cdk_aws_appflow_CfnConnector_ConnectorProvisioningConfigProperty(p.connectorProvisioningConfig);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appflow_CfnConnector(p) {
}
function _aws_cdk_aws_appflow_CfnConnector_ConnectorProvisioningConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnector_LambdaConnectorProvisioningConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfileProps(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_AmplitudeConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ApiKeyCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_BasicAuthCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorOAuthRequestProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfileConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_CustomAuthCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_CustomConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_CustomConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_DatadogConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_DatadogConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_DynatraceConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_DynatraceConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_GoogleAnalyticsConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_InforNexusConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_InforNexusConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_MarketoConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_MarketoConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_OAuth2CredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_OAuth2PropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_OAuthCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_OAuthPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_RedshiftConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_RedshiftConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SAPODataConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SAPODataConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SalesforceConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SalesforceConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ServiceNowConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ServiceNowConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SingularConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SlackConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SlackConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SnowflakeConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_SnowflakeConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_TrendmicroConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_VeevaConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_VeevaConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ZendeskConnectorProfileCredentialsProperty(p) {
}
function _aws_cdk_aws_appflow_CfnConnectorProfile_ZendeskConnectorProfilePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlowProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_appflow_CfnFlow(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_AggregationConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_AmplitudeSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ConnectorOperatorProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_CustomConnectorDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_CustomConnectorSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_DatadogSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_DestinationConnectorPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_DestinationFlowConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_DynatraceSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ErrorHandlingConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_EventBridgeDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_GlueDataCatalogProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_GoogleAnalyticsSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_IncrementalPullConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_InforNexusSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_LookoutMetricsDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_MarketoDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_MarketoSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_MetadataCatalogConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_PrefixConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_RedshiftDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_S3DestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_S3InputFormatConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_S3OutputFormatConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_S3SourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SAPODataDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SAPODataSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SalesforceDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SalesforceSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ScheduledTriggerPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ServiceNowSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SingularSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SlackSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SnowflakeDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SourceConnectorPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SourceFlowConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_SuccessResponseHandlingConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_TaskProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_TaskPropertiesObjectProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_TrendmicroSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_TriggerConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_UpsolverDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_UpsolverS3OutputFormatConfigProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_VeevaSourcePropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ZendeskDestinationPropertiesProperty(p) {
}
function _aws_cdk_aws_appflow_CfnFlow_ZendeskSourcePropertiesProperty(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_appflow_CfnConnectorProps, _aws_cdk_aws_appflow_CfnConnector, _aws_cdk_aws_appflow_CfnConnector_ConnectorProvisioningConfigProperty, _aws_cdk_aws_appflow_CfnConnector_LambdaConnectorProvisioningConfigProperty, _aws_cdk_aws_appflow_CfnConnectorProfileProps, _aws_cdk_aws_appflow_CfnConnectorProfile, _aws_cdk_aws_appflow_CfnConnectorProfile_AmplitudeConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ApiKeyCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_BasicAuthCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorOAuthRequestProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfileConfigProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_CustomAuthCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_CustomConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_CustomConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_DatadogConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_DatadogConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_DynatraceConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_DynatraceConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_GoogleAnalyticsConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_InforNexusConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_InforNexusConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_MarketoConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_MarketoConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_OAuth2CredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_OAuth2PropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_OAuthCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_OAuthPropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_RedshiftConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_RedshiftConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SAPODataConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SAPODataConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SalesforceConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SalesforceConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ServiceNowConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ServiceNowConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SingularConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SlackConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SlackConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SnowflakeConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_SnowflakeConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_TrendmicroConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_VeevaConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_VeevaConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ZendeskConnectorProfileCredentialsProperty, _aws_cdk_aws_appflow_CfnConnectorProfile_ZendeskConnectorProfilePropertiesProperty, _aws_cdk_aws_appflow_CfnFlowProps, _aws_cdk_aws_appflow_CfnFlow, _aws_cdk_aws_appflow_CfnFlow_AggregationConfigProperty, _aws_cdk_aws_appflow_CfnFlow_AmplitudeSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ConnectorOperatorProperty, _aws_cdk_aws_appflow_CfnFlow_CustomConnectorDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_CustomConnectorSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_DatadogSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_DestinationConnectorPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_DestinationFlowConfigProperty, _aws_cdk_aws_appflow_CfnFlow_DynatraceSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ErrorHandlingConfigProperty, _aws_cdk_aws_appflow_CfnFlow_EventBridgeDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_GlueDataCatalogProperty, _aws_cdk_aws_appflow_CfnFlow_GoogleAnalyticsSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_IncrementalPullConfigProperty, _aws_cdk_aws_appflow_CfnFlow_InforNexusSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_LookoutMetricsDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_MarketoDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_MarketoSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_MetadataCatalogConfigProperty, _aws_cdk_aws_appflow_CfnFlow_PrefixConfigProperty, _aws_cdk_aws_appflow_CfnFlow_RedshiftDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_S3DestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_S3InputFormatConfigProperty, _aws_cdk_aws_appflow_CfnFlow_S3OutputFormatConfigProperty, _aws_cdk_aws_appflow_CfnFlow_S3SourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SAPODataDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SAPODataSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SalesforceDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SalesforceSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ScheduledTriggerPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ServiceNowSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SingularSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SlackSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SnowflakeDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SourceConnectorPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_SourceFlowConfigProperty, _aws_cdk_aws_appflow_CfnFlow_SuccessResponseHandlingConfigProperty, _aws_cdk_aws_appflow_CfnFlow_TaskProperty, _aws_cdk_aws_appflow_CfnFlow_TaskPropertiesObjectProperty, _aws_cdk_aws_appflow_CfnFlow_TrendmicroSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_TriggerConfigProperty, _aws_cdk_aws_appflow_CfnFlow_UpsolverDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_UpsolverS3OutputFormatConfigProperty, _aws_cdk_aws_appflow_CfnFlow_VeevaSourcePropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ZendeskDestinationPropertiesProperty, _aws_cdk_aws_appflow_CfnFlow_ZendeskSourcePropertiesProperty };
