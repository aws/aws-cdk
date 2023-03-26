function _aws_cdk_aws_kendra_CfnDataSourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.customDocumentEnrichmentConfiguration))
            _aws_cdk_aws_kendra_CfnDataSource_CustomDocumentEnrichmentConfigurationProperty(p.customDocumentEnrichmentConfiguration);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_kendra_CfnDataSource(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_AccessControlListConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_AclConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ColumnConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceAttachmentConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceAttachmentToIndexFieldMappingProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceBlogConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceBlogToIndexFieldMappingProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluencePageConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluencePageToIndexFieldMappingProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceSpaceConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConfluenceSpaceToIndexFieldMappingProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ConnectionConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_CustomDocumentEnrichmentConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DataSourceConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DataSourceToIndexFieldMappingProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DataSourceVpcConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DatabaseConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeConditionProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeTargetProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeValueProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_DocumentsMetadataConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_GoogleDriveConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_HookConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_InlineCustomDocumentEnrichmentConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_OneDriveConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_OneDriveUsersProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ProxyConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_S3DataSourceConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_S3PathProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceChatterFeedConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceCustomKnowledgeArticleTypeConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceKnowledgeArticleConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardKnowledgeArticleTypeConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardObjectAttachmentConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardObjectConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ServiceNowConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ServiceNowKnowledgeArticleConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_ServiceNowServiceCatalogConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SharePointConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_SqlConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerAuthenticationConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerBasicAuthenticationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerSeedUrlConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerSiteMapsConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerUrlsProperty(p) {
}
function _aws_cdk_aws_kendra_CfnDataSource_WorkDocsConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnFaqProps(p) {
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
function _aws_cdk_aws_kendra_CfnFaq(p) {
}
function _aws_cdk_aws_kendra_CfnFaq_S3PathProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndexProps(p) {
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
function _aws_cdk_aws_kendra_CfnIndex(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_CapacityUnitsConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_DocumentMetadataConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_JsonTokenTypeConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_JwtTokenTypeConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_RelevanceProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_SearchProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_ServerSideEncryptionConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_UserTokenConfigurationProperty(p) {
}
function _aws_cdk_aws_kendra_CfnIndex_ValueImportanceItemProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_kendra_CfnDataSourceProps, _aws_cdk_aws_kendra_CfnDataSource, _aws_cdk_aws_kendra_CfnDataSource_AccessControlListConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_AclConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ColumnConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceAttachmentConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceAttachmentToIndexFieldMappingProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceBlogConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceBlogToIndexFieldMappingProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluencePageConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluencePageToIndexFieldMappingProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceSpaceConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ConfluenceSpaceToIndexFieldMappingProperty, _aws_cdk_aws_kendra_CfnDataSource_ConnectionConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_CustomDocumentEnrichmentConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_DataSourceConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_DataSourceToIndexFieldMappingProperty, _aws_cdk_aws_kendra_CfnDataSource_DataSourceVpcConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_DatabaseConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeConditionProperty, _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeTargetProperty, _aws_cdk_aws_kendra_CfnDataSource_DocumentAttributeValueProperty, _aws_cdk_aws_kendra_CfnDataSource_DocumentsMetadataConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_GoogleDriveConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_HookConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_InlineCustomDocumentEnrichmentConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_OneDriveConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_OneDriveUsersProperty, _aws_cdk_aws_kendra_CfnDataSource_ProxyConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_S3DataSourceConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_S3PathProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceChatterFeedConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceCustomKnowledgeArticleTypeConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceKnowledgeArticleConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardKnowledgeArticleTypeConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardObjectAttachmentConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SalesforceStandardObjectConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ServiceNowConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ServiceNowKnowledgeArticleConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_ServiceNowServiceCatalogConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SharePointConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_SqlConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerAuthenticationConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerBasicAuthenticationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerSeedUrlConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerSiteMapsConfigurationProperty, _aws_cdk_aws_kendra_CfnDataSource_WebCrawlerUrlsProperty, _aws_cdk_aws_kendra_CfnDataSource_WorkDocsConfigurationProperty, _aws_cdk_aws_kendra_CfnFaqProps, _aws_cdk_aws_kendra_CfnFaq, _aws_cdk_aws_kendra_CfnFaq_S3PathProperty, _aws_cdk_aws_kendra_CfnIndexProps, _aws_cdk_aws_kendra_CfnIndex, _aws_cdk_aws_kendra_CfnIndex_CapacityUnitsConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_DocumentMetadataConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_JsonTokenTypeConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_JwtTokenTypeConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_RelevanceProperty, _aws_cdk_aws_kendra_CfnIndex_SearchProperty, _aws_cdk_aws_kendra_CfnIndex_ServerSideEncryptionConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_UserTokenConfigurationProperty, _aws_cdk_aws_kendra_CfnIndex_ValueImportanceItemProperty };
