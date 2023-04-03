function _aws_cdk_aws_apigateway_IRestApi(p) {
}
function _aws_cdk_aws_apigateway_RestApiBaseProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_RestApiOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_RestApiProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.apiKeySourceType))
            _aws_cdk_aws_apigateway_ApiKeySourceType(p.apiKeySourceType);
        if (!visitedObjects.has(p.cloneFrom))
            _aws_cdk_aws_apigateway_IRestApi(p.cloneFrom);
        if (!visitedObjects.has(p.endpointConfiguration))
            _aws_cdk_aws_apigateway_EndpointConfiguration(p.endpointConfiguration);
        if ("minimumCompressionSize" in p)
            print("@aws-cdk/aws-apigateway.RestApiProps#minimumCompressionSize", "- superseded by `minCompressionSize`");
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_SpecRestApiProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.apiDefinition))
            _aws_cdk_aws_apigateway_ApiDefinition(p.apiDefinition);
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_RestApiBase(p) {
}
function _aws_cdk_aws_apigateway_SpecRestApi(p) {
}
function _aws_cdk_aws_apigateway_RestApiAttributes(p) {
}
function _aws_cdk_aws_apigateway_RestApi(p) {
}
function _aws_cdk_aws_apigateway_EndpointConfiguration(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.types != null)
            for (const o of p.types)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
        if (p.vpcEndpoints != null)
            for (const o of p.vpcEndpoints)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_IVpcEndpoint(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ApiKeySourceType(p) {
}
function _aws_cdk_aws_apigateway_EndpointType(p) {
}
function _aws_cdk_aws_apigateway_IResource(p) {
}
function _aws_cdk_aws_apigateway_ResourceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.parent))
            _aws_cdk_aws_apigateway_IResource(p.parent);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ResourceBase(p) {
}
function _aws_cdk_aws_apigateway_ResourceAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_Resource(p) {
}
function _aws_cdk_aws_apigateway_ProxyResourceOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ProxyResourceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.parent))
            _aws_cdk_aws_apigateway_IResource(p.parent);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ProxyResource(p) {
}
function _aws_cdk_aws_apigateway_MethodOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.authorizationType))
            _aws_cdk_aws_apigateway_AuthorizationType(p.authorizationType);
        if (!visitedObjects.has(p.authorizer))
            _aws_cdk_aws_apigateway_IAuthorizer(p.authorizer);
        if (p.methodResponses != null)
            for (const o of p.methodResponses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_MethodResponse(o);
        if (p.requestModels != null)
            for (const o of Object.values(p.requestModels))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IModel(o);
        if (!visitedObjects.has(p.requestValidator))
            _aws_cdk_aws_apigateway_IRequestValidator(p.requestValidator);
        if (!visitedObjects.has(p.requestValidatorOptions))
            _aws_cdk_aws_apigateway_RequestValidatorOptions(p.requestValidatorOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_MethodProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resource))
            _aws_cdk_aws_apigateway_IResource(p.resource);
        if (!visitedObjects.has(p.integration))
            _aws_cdk_aws_apigateway_Integration(p.integration);
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_MethodOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_Method(p) {
}
function _aws_cdk_aws_apigateway_AuthorizationType(p) {
}
function _aws_cdk_aws_apigateway_IntegrationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.connectionType))
            _aws_cdk_aws_apigateway_ConnectionType(p.connectionType);
        if (!visitedObjects.has(p.contentHandling))
            _aws_cdk_aws_apigateway_ContentHandling(p.contentHandling);
        if (p.integrationResponses != null)
            for (const o of p.integrationResponses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IntegrationResponse(o);
        if (!visitedObjects.has(p.passthroughBehavior))
            _aws_cdk_aws_apigateway_PassthroughBehavior(p.passthroughBehavior);
        if (!visitedObjects.has(p.vpcLink))
            _aws_cdk_aws_apigateway_IVpcLink(p.vpcLink);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_IntegrationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_apigateway_IntegrationType(p.type);
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_IntegrationOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_IntegrationConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_apigateway_IntegrationType(p.type);
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_IntegrationOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_Integration(p) {
}
function _aws_cdk_aws_apigateway_ContentHandling(p) {
}
function _aws_cdk_aws_apigateway_IntegrationType(p) {
}
function _aws_cdk_aws_apigateway_PassthroughBehavior(p) {
}
function _aws_cdk_aws_apigateway_ConnectionType(p) {
}
function _aws_cdk_aws_apigateway_IntegrationResponse(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.contentHandling))
            _aws_cdk_aws_apigateway_ContentHandling(p.contentHandling);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_DeploymentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.api))
            _aws_cdk_aws_apigateway_IRestApi(p.api);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_Deployment(p) {
}
function _aws_cdk_aws_apigateway_IStage(p) {
}
function _aws_cdk_aws_apigateway_StageOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.accessLogDestination))
            _aws_cdk_aws_apigateway_IAccessLogDestination(p.accessLogDestination);
        if (!visitedObjects.has(p.accessLogFormat))
            _aws_cdk_aws_apigateway_AccessLogFormat(p.accessLogFormat);
        if (p.methodOptions != null)
            for (const o of Object.values(p.methodOptions))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_MethodDeploymentOptions(o);
        if (!visitedObjects.has(p.loggingLevel))
            _aws_cdk_aws_apigateway_MethodLoggingLevel(p.loggingLevel);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_StageProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deployment))
            _aws_cdk_aws_apigateway_Deployment(p.deployment);
        if (!visitedObjects.has(p.accessLogDestination))
            _aws_cdk_aws_apigateway_IAccessLogDestination(p.accessLogDestination);
        if (!visitedObjects.has(p.accessLogFormat))
            _aws_cdk_aws_apigateway_AccessLogFormat(p.accessLogFormat);
        if (p.methodOptions != null)
            for (const o of Object.values(p.methodOptions))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_MethodDeploymentOptions(o);
        if (!visitedObjects.has(p.loggingLevel))
            _aws_cdk_aws_apigateway_MethodLoggingLevel(p.loggingLevel);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_MethodLoggingLevel(p) {
}
function _aws_cdk_aws_apigateway_MethodDeploymentOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loggingLevel))
            _aws_cdk_aws_apigateway_MethodLoggingLevel(p.loggingLevel);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_StageAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_StageBase(p) {
}
function _aws_cdk_aws_apigateway_Stage(p) {
}
function _aws_cdk_aws_apigateway_AwsIntegrationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_IntegrationOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_AwsIntegration(p) {
}
function _aws_cdk_aws_apigateway_LambdaIntegrationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.connectionType))
            _aws_cdk_aws_apigateway_ConnectionType(p.connectionType);
        if (!visitedObjects.has(p.contentHandling))
            _aws_cdk_aws_apigateway_ContentHandling(p.contentHandling);
        if (p.integrationResponses != null)
            for (const o of p.integrationResponses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IntegrationResponse(o);
        if (!visitedObjects.has(p.passthroughBehavior))
            _aws_cdk_aws_apigateway_PassthroughBehavior(p.passthroughBehavior);
        if (!visitedObjects.has(p.vpcLink))
            _aws_cdk_aws_apigateway_IVpcLink(p.vpcLink);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_LambdaIntegration(p) {
}
function _aws_cdk_aws_apigateway_HttpIntegrationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_IntegrationOptions(p.options);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_HttpIntegration(p) {
}
function _aws_cdk_aws_apigateway_MockIntegration(p) {
}
function _aws_cdk_aws_apigateway_StepFunctionsExecutionIntegrationOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.requestContext))
            _aws_cdk_aws_apigateway_RequestContext(p.requestContext);
        if (!visitedObjects.has(p.connectionType))
            _aws_cdk_aws_apigateway_ConnectionType(p.connectionType);
        if (!visitedObjects.has(p.contentHandling))
            _aws_cdk_aws_apigateway_ContentHandling(p.contentHandling);
        if (p.integrationResponses != null)
            for (const o of p.integrationResponses)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IntegrationResponse(o);
        if (!visitedObjects.has(p.passthroughBehavior))
            _aws_cdk_aws_apigateway_PassthroughBehavior(p.passthroughBehavior);
        if (!visitedObjects.has(p.vpcLink))
            _aws_cdk_aws_apigateway_IVpcLink(p.vpcLink);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_StepFunctionsIntegration(p) {
}
function _aws_cdk_aws_apigateway_RequestContext(p) {
}
function _aws_cdk_aws_apigateway_LambdaRestApiProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.integrationOptions))
            _aws_cdk_aws_apigateway_LambdaIntegrationOptions(p.integrationOptions);
        if ("options" in p)
            print("@aws-cdk/aws-apigateway.LambdaRestApiProps#options", "the `LambdaRestApiProps` now extends `RestApiProps`, so all\noptions are just available here. Note that the options specified in\n`options` will be overridden by any props specified at the root level.");
        if (!visitedObjects.has(p.options))
            _aws_cdk_aws_apigateway_RestApiProps(p.options);
        if (!visitedObjects.has(p.apiKeySourceType))
            _aws_cdk_aws_apigateway_ApiKeySourceType(p.apiKeySourceType);
        if (!visitedObjects.has(p.cloneFrom))
            _aws_cdk_aws_apigateway_IRestApi(p.cloneFrom);
        if (!visitedObjects.has(p.endpointConfiguration))
            _aws_cdk_aws_apigateway_EndpointConfiguration(p.endpointConfiguration);
        if ("minimumCompressionSize" in p)
            print("@aws-cdk/aws-apigateway.RestApiProps#minimumCompressionSize", "- superseded by `minCompressionSize`");
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_LambdaRestApi(p) {
}
function _aws_cdk_aws_apigateway_IApiKey(p) {
}
function _aws_cdk_aws_apigateway_ApiKeyOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ApiKeyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("resources" in p)
            print("@aws-cdk/aws-apigateway.ApiKeyProps#resources", "- use `stages` instead");
        if (p.resources != null)
            for (const o of p.resources)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IRestApi(o);
        if (p.stages != null)
            for (const o of p.stages)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IStage(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ApiKey(p) {
}
function _aws_cdk_aws_apigateway_RateLimitedApiKeyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.apiStages != null)
            for (const o of p.apiStages)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_UsagePlanPerApiStage(o);
        if (!visitedObjects.has(p.quota))
            _aws_cdk_aws_apigateway_QuotaSettings(p.quota);
        if (!visitedObjects.has(p.throttle))
            _aws_cdk_aws_apigateway_ThrottleSettings(p.throttle);
        if ("resources" in p)
            print("@aws-cdk/aws-apigateway.ApiKeyProps#resources", "- use `stages` instead");
        if (p.resources != null)
            for (const o of p.resources)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IRestApi(o);
        if (p.stages != null)
            for (const o of p.stages)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IStage(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_RateLimitedApiKey(p) {
}
function _aws_cdk_aws_apigateway_ThrottleSettings(p) {
}
function _aws_cdk_aws_apigateway_Period(p) {
}
function _aws_cdk_aws_apigateway_QuotaSettings(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.period))
            _aws_cdk_aws_apigateway_Period(p.period);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ThrottlingPerMethod(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.method))
            _aws_cdk_aws_apigateway_Method(p.method);
        if (!visitedObjects.has(p.throttle))
            _aws_cdk_aws_apigateway_ThrottleSettings(p.throttle);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_UsagePlanPerApiStage(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.api))
            _aws_cdk_aws_apigateway_IRestApi(p.api);
        if (!visitedObjects.has(p.stage))
            _aws_cdk_aws_apigateway_Stage(p.stage);
        if (p.throttle != null)
            for (const o of p.throttle)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_ThrottlingPerMethod(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_UsagePlanProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiKey" in p)
            print("@aws-cdk/aws-apigateway.UsagePlanProps#apiKey", "use `addApiKey()`");
        if (!visitedObjects.has(p.apiKey))
            _aws_cdk_aws_apigateway_IApiKey(p.apiKey);
        if (p.apiStages != null)
            for (const o of p.apiStages)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_UsagePlanPerApiStage(o);
        if (!visitedObjects.has(p.quota))
            _aws_cdk_aws_apigateway_QuotaSettings(p.quota);
        if (!visitedObjects.has(p.throttle))
            _aws_cdk_aws_apigateway_ThrottleSettings(p.throttle);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_AddApiKeyOptions(p) {
}
function _aws_cdk_aws_apigateway_IUsagePlan(p) {
}
function _aws_cdk_aws_apigateway_UsagePlan(p) {
}
function _aws_cdk_aws_apigateway_IVpcLink(p) {
}
function _aws_cdk_aws_apigateway_VpcLinkProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.targets != null)
            for (const o of p.targets)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-elasticloadbalancingv2/.warnings.jsii.js")._aws_cdk_aws_elasticloadbalancingv2_INetworkLoadBalancer(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_VpcLink(p) {
}
function _aws_cdk_aws_apigateway_MethodResponse(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.responseModels != null)
            for (const o of Object.values(p.responseModels))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_IModel(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_IModel(p) {
}
function _aws_cdk_aws_apigateway_EmptyModel(p) {
}
function _aws_cdk_aws_apigateway_ErrorModel(p) {
}
function _aws_cdk_aws_apigateway_ModelOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.schema))
            _aws_cdk_aws_apigateway_JsonSchema(p.schema);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ModelProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
        if (!visitedObjects.has(p.schema))
            _aws_cdk_aws_apigateway_JsonSchema(p.schema);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_Model(p) {
}
function _aws_cdk_aws_apigateway_IRequestValidator(p) {
}
function _aws_cdk_aws_apigateway_RequestValidatorOptions(p) {
}
function _aws_cdk_aws_apigateway_RequestValidatorProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_RequestValidator(p) {
}
function _aws_cdk_aws_apigateway_Authorizer(p) {
}
function _aws_cdk_aws_apigateway_IAuthorizer(p) {
}
function _aws_cdk_aws_apigateway_JsonSchemaVersion(p) {
}
function _aws_cdk_aws_apigateway_JsonSchemaType(p) {
}
function _aws_cdk_aws_apigateway_JsonSchema(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.additionalItems != null)
            for (const o of p.additionalItems)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (p.allOf != null)
            for (const o of p.allOf)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (p.anyOf != null)
            for (const o of p.anyOf)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (!visitedObjects.has(p.contains))
            _aws_cdk_aws_apigateway_JsonSchema(p.contains);
        if (p.definitions != null)
            for (const o of Object.values(p.definitions))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (!visitedObjects.has(p.items))
            _aws_cdk_aws_apigateway_JsonSchema(p.items);
        if (!visitedObjects.has(p.not))
            _aws_cdk_aws_apigateway_JsonSchema(p.not);
        if (p.oneOf != null)
            for (const o of p.oneOf)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (p.patternProperties != null)
            for (const o of Object.values(p.patternProperties))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (p.properties != null)
            for (const o of Object.values(p.properties))
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_JsonSchema(o);
        if (!visitedObjects.has(p.propertyNames))
            _aws_cdk_aws_apigateway_JsonSchema(p.propertyNames);
        if (!visitedObjects.has(p.schema))
            _aws_cdk_aws_apigateway_JsonSchemaVersion(p.schema);
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_apigateway_JsonSchemaType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_ApiMappingOptions(p) {
}
function _aws_cdk_aws_apigateway_SecurityPolicy(p) {
}
function _aws_cdk_aws_apigateway_DomainNameOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.endpointType))
            _aws_cdk_aws_apigateway_EndpointType(p.endpointType);
        if (!visitedObjects.has(p.mtls))
            _aws_cdk_aws_apigateway_MTLSConfig(p.mtls);
        if (!visitedObjects.has(p.securityPolicy))
            _aws_cdk_aws_apigateway_SecurityPolicy(p.securityPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_DomainNameProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.mapping))
            _aws_cdk_aws_apigateway_IRestApi(p.mapping);
        if (!visitedObjects.has(p.endpointType))
            _aws_cdk_aws_apigateway_EndpointType(p.endpointType);
        if (!visitedObjects.has(p.mtls))
            _aws_cdk_aws_apigateway_MTLSConfig(p.mtls);
        if (!visitedObjects.has(p.securityPolicy))
            _aws_cdk_aws_apigateway_SecurityPolicy(p.securityPolicy);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_IDomainName(p) {
}
function _aws_cdk_aws_apigateway_DomainName(p) {
}
function _aws_cdk_aws_apigateway_DomainNameAttributes(p) {
}
function _aws_cdk_aws_apigateway_MTLSConfig(p) {
}
function _aws_cdk_aws_apigateway_BasePathMappingOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.stage))
            _aws_cdk_aws_apigateway_Stage(p.stage);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_BasePathMappingProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_IDomainName(p.domainName);
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
        if (!visitedObjects.has(p.stage))
            _aws_cdk_aws_apigateway_Stage(p.stage);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_BasePathMapping(p) {
}
function _aws_cdk_aws_apigateway_CorsOptions(p) {
}
function _aws_cdk_aws_apigateway_Cors(p) {
}
function _aws_cdk_aws_apigateway_LambdaAuthorizerProps(p) {
}
function _aws_cdk_aws_apigateway_TokenAuthorizerProps(p) {
}
function _aws_cdk_aws_apigateway_TokenAuthorizer(p) {
}
function _aws_cdk_aws_apigateway_RequestAuthorizerProps(p) {
}
function _aws_cdk_aws_apigateway_RequestAuthorizer(p) {
}
function _aws_cdk_aws_apigateway_IdentitySource(p) {
}
function _aws_cdk_aws_apigateway_CognitoUserPoolsAuthorizerProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cognitoUserPools != null)
            for (const o of p.cognitoUserPools)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cognito/.warnings.jsii.js")._aws_cdk_aws_cognito_IUserPool(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CognitoUserPoolsAuthorizer(p) {
}
function _aws_cdk_aws_apigateway_IAccessLogDestination(p) {
}
function _aws_cdk_aws_apigateway_AccessLogDestinationConfig(p) {
}
function _aws_cdk_aws_apigateway_LogGroupLogDestination(p) {
}
function _aws_cdk_aws_apigateway_AccessLogField(p) {
}
function _aws_cdk_aws_apigateway_JsonWithStandardFieldProps(p) {
}
function _aws_cdk_aws_apigateway_AccessLogFormat(p) {
}
function _aws_cdk_aws_apigateway_ApiDefinition(p) {
}
function _aws_cdk_aws_apigateway_ApiDefinitionS3Location(p) {
}
function _aws_cdk_aws_apigateway_ApiDefinitionConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.s3Location))
            _aws_cdk_aws_apigateway_ApiDefinitionS3Location(p.s3Location);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_S3ApiDefinition(p) {
}
function _aws_cdk_aws_apigateway_InlineApiDefinition(p) {
}
function _aws_cdk_aws_apigateway_AssetApiDefinition(p) {
}
function _aws_cdk_aws_apigateway_IGatewayResponse(p) {
}
function _aws_cdk_aws_apigateway_GatewayResponseProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.restApi))
            _aws_cdk_aws_apigateway_IRestApi(p.restApi);
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_apigateway_ResponseType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_GatewayResponseOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_aws_apigateway_ResponseType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_GatewayResponse(p) {
}
function _aws_cdk_aws_apigateway_ResponseType(p) {
}
function _aws_cdk_aws_apigateway_StepFunctionsRestApiProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.requestContext))
            _aws_cdk_aws_apigateway_RequestContext(p.requestContext);
        if (!visitedObjects.has(p.apiKeySourceType))
            _aws_cdk_aws_apigateway_ApiKeySourceType(p.apiKeySourceType);
        if (!visitedObjects.has(p.cloneFrom))
            _aws_cdk_aws_apigateway_IRestApi(p.cloneFrom);
        if (!visitedObjects.has(p.endpointConfiguration))
            _aws_cdk_aws_apigateway_EndpointConfiguration(p.endpointConfiguration);
        if ("minimumCompressionSize" in p)
            print("@aws-cdk/aws-apigateway.RestApiProps#minimumCompressionSize", "- superseded by `minCompressionSize`");
        if (!visitedObjects.has(p.deployOptions))
            _aws_cdk_aws_apigateway_StageOptions(p.deployOptions);
        if (!visitedObjects.has(p.domainName))
            _aws_cdk_aws_apigateway_DomainNameOptions(p.domainName);
        if (p.endpointTypes != null)
            for (const o of p.endpointTypes)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_apigateway_EndpointType(o);
        if (!visitedObjects.has(p.defaultCorsPreflightOptions))
            _aws_cdk_aws_apigateway_CorsOptions(p.defaultCorsPreflightOptions);
        if (!visitedObjects.has(p.defaultIntegration))
            _aws_cdk_aws_apigateway_Integration(p.defaultIntegration);
        if (!visitedObjects.has(p.defaultMethodOptions))
            _aws_cdk_aws_apigateway_MethodOptions(p.defaultMethodOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_StepFunctionsRestApi(p) {
}
function _aws_cdk_aws_apigateway_CfnAccountProps(p) {
}
function _aws_cdk_aws_apigateway_CfnAccount(p) {
}
function _aws_cdk_aws_apigateway_CfnApiKeyProps(p) {
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
function _aws_cdk_aws_apigateway_CfnApiKey(p) {
}
function _aws_cdk_aws_apigateway_CfnApiKey_StageKeyProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnAuthorizerProps(p) {
}
function _aws_cdk_aws_apigateway_CfnAuthorizer(p) {
}
function _aws_cdk_aws_apigateway_CfnBasePathMappingProps(p) {
}
function _aws_cdk_aws_apigateway_CfnBasePathMapping(p) {
}
function _aws_cdk_aws_apigateway_CfnClientCertificateProps(p) {
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
function _aws_cdk_aws_apigateway_CfnClientCertificate(p) {
}
function _aws_cdk_aws_apigateway_CfnDeploymentProps(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment_AccessLogSettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment_CanarySettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment_DeploymentCanarySettingsProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment_MethodSettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDeployment_StageDescriptionProperty(p) {
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
function _aws_cdk_aws_apigateway_CfnDocumentationPartProps(p) {
}
function _aws_cdk_aws_apigateway_CfnDocumentationPart(p) {
}
function _aws_cdk_aws_apigateway_CfnDocumentationPart_LocationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDocumentationVersionProps(p) {
}
function _aws_cdk_aws_apigateway_CfnDocumentationVersion(p) {
}
function _aws_cdk_aws_apigateway_CfnDomainNameProps(p) {
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
function _aws_cdk_aws_apigateway_CfnDomainName(p) {
}
function _aws_cdk_aws_apigateway_CfnDomainName_EndpointConfigurationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnDomainName_MutualTlsAuthenticationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnGatewayResponseProps(p) {
}
function _aws_cdk_aws_apigateway_CfnGatewayResponse(p) {
}
function _aws_cdk_aws_apigateway_CfnMethodProps(p) {
}
function _aws_cdk_aws_apigateway_CfnMethod(p) {
}
function _aws_cdk_aws_apigateway_CfnMethod_IntegrationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnMethod_IntegrationResponseProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnMethod_MethodResponseProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnModelProps(p) {
}
function _aws_cdk_aws_apigateway_CfnModel(p) {
}
function _aws_cdk_aws_apigateway_CfnRequestValidatorProps(p) {
}
function _aws_cdk_aws_apigateway_CfnRequestValidator(p) {
}
function _aws_cdk_aws_apigateway_CfnResourceProps(p) {
}
function _aws_cdk_aws_apigateway_CfnResource(p) {
}
function _aws_cdk_aws_apigateway_CfnRestApiProps(p) {
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
function _aws_cdk_aws_apigateway_CfnRestApi(p) {
}
function _aws_cdk_aws_apigateway_CfnRestApi_EndpointConfigurationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnRestApi_S3LocationProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnStageProps(p) {
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
function _aws_cdk_aws_apigateway_CfnStage(p) {
}
function _aws_cdk_aws_apigateway_CfnStage_AccessLogSettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnStage_CanarySettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnStage_MethodSettingProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlanProps(p) {
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
function _aws_cdk_aws_apigateway_CfnUsagePlan(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlan_ApiStageProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlan_QuotaSettingsProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlan_ThrottleSettingsProperty(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlanKeyProps(p) {
}
function _aws_cdk_aws_apigateway_CfnUsagePlanKey(p) {
}
function _aws_cdk_aws_apigateway_CfnVpcLinkProps(p) {
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
function _aws_cdk_aws_apigateway_CfnVpcLink(p) {
}
function _aws_cdk_aws_apigateway_CfnApiV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiKeySelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#apiKeySelectionExpression", "moved to package aws-apigatewayv2");
        if ("basePath" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#basePath", "moved to package aws-apigatewayv2");
        if ("body" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#body", "moved to package aws-apigatewayv2");
        if ("bodyS3Location" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#bodyS3Location", "moved to package aws-apigatewayv2");
        if ("corsConfiguration" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#corsConfiguration", "moved to package aws-apigatewayv2");
        if ("credentialsArn" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#credentialsArn", "moved to package aws-apigatewayv2");
        if ("description" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#description", "moved to package aws-apigatewayv2");
        if ("disableSchemaValidation" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#disableSchemaValidation", "moved to package aws-apigatewayv2");
        if ("failOnWarnings" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#failOnWarnings", "moved to package aws-apigatewayv2");
        if ("name" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#name", "moved to package aws-apigatewayv2");
        if ("protocolType" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#protocolType", "moved to package aws-apigatewayv2");
        if ("routeKey" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#routeKey", "moved to package aws-apigatewayv2");
        if ("routeSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#routeSelectionExpression", "moved to package aws-apigatewayv2");
        if ("tags" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#tags", "moved to package aws-apigatewayv2");
        if ("target" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#target", "moved to package aws-apigatewayv2");
        if ("version" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2Props#version", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnApiV2(p) {
}
function _aws_cdk_aws_apigateway_CfnApiV2_BodyS3LocationProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("bucket" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.BodyS3LocationProperty#bucket", "moved to package aws-apigatewayv2");
        if ("etag" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.BodyS3LocationProperty#etag", "moved to package aws-apigatewayv2");
        if ("key" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.BodyS3LocationProperty#key", "moved to package aws-apigatewayv2");
        if ("version" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.BodyS3LocationProperty#version", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnApiV2_CorsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("allowCredentials" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#allowCredentials", "moved to package aws-apigatewayv2");
        if ("allowHeaders" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#allowHeaders", "moved to package aws-apigatewayv2");
        if ("allowMethods" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#allowMethods", "moved to package aws-apigatewayv2");
        if ("allowOrigins" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#allowOrigins", "moved to package aws-apigatewayv2");
        if ("exposeHeaders" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#exposeHeaders", "moved to package aws-apigatewayv2");
        if ("maxAge" in p)
            print("@aws-cdk/aws-apigateway.CfnApiV2.CorsProperty#maxAge", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnApiMappingV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnApiMappingV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("domainName" in p)
            print("@aws-cdk/aws-apigateway.CfnApiMappingV2Props#domainName", "moved to package aws-apigatewayv2");
        if ("stage" in p)
            print("@aws-cdk/aws-apigateway.CfnApiMappingV2Props#stage", "moved to package aws-apigatewayv2");
        if ("apiMappingKey" in p)
            print("@aws-cdk/aws-apigateway.CfnApiMappingV2Props#apiMappingKey", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnApiMappingV2(p) {
}
function _aws_cdk_aws_apigateway_CfnAuthorizerV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("authorizerType" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#authorizerType", "moved to package aws-apigatewayv2");
        if ("identitySource" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#identitySource", "moved to package aws-apigatewayv2");
        if ("name" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#name", "moved to package aws-apigatewayv2");
        if ("authorizerCredentialsArn" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#authorizerCredentialsArn", "moved to package aws-apigatewayv2");
        if ("authorizerResultTtlInSeconds" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#authorizerResultTtlInSeconds", "moved to package aws-apigatewayv2");
        if ("authorizerUri" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#authorizerUri", "moved to package aws-apigatewayv2");
        if ("identityValidationExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#identityValidationExpression", "moved to package aws-apigatewayv2");
        if ("jwtConfiguration" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2Props#jwtConfiguration", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnAuthorizerV2(p) {
}
function _aws_cdk_aws_apigateway_CfnAuthorizerV2_JWTConfigurationProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("audience" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2.JWTConfigurationProperty#audience", "moved to package aws-apigatewayv2");
        if ("issuer" in p)
            print("@aws-cdk/aws-apigateway.CfnAuthorizerV2.JWTConfigurationProperty#issuer", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnDeploymentV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnDeploymentV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("description" in p)
            print("@aws-cdk/aws-apigateway.CfnDeploymentV2Props#description", "moved to package aws-apigatewayv2");
        if ("stageName" in p)
            print("@aws-cdk/aws-apigateway.CfnDeploymentV2Props#stageName", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnDeploymentV2(p) {
}
function _aws_cdk_aws_apigateway_CfnDomainNameV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("domainName" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2Props#domainName", "moved to package aws-apigatewayv2");
        if ("domainNameConfigurations" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2Props#domainNameConfigurations", "moved to package aws-apigatewayv2");
        if ("tags" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2Props#tags", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnDomainNameV2(p) {
}
function _aws_cdk_aws_apigateway_CfnDomainNameV2_DomainNameConfigurationProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("certificateArn" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2.DomainNameConfigurationProperty#certificateArn", "moved to package aws-apigatewayv2");
        if ("certificateName" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2.DomainNameConfigurationProperty#certificateName", "moved to package aws-apigatewayv2");
        if ("endpointType" in p)
            print("@aws-cdk/aws-apigateway.CfnDomainNameV2.DomainNameConfigurationProperty#endpointType", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnIntegrationV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("integrationType" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#integrationType", "moved to package aws-apigatewayv2");
        if ("connectionType" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#connectionType", "moved to package aws-apigatewayv2");
        if ("contentHandlingStrategy" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#contentHandlingStrategy", "moved to package aws-apigatewayv2");
        if ("credentialsArn" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#credentialsArn", "moved to package aws-apigatewayv2");
        if ("description" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#description", "moved to package aws-apigatewayv2");
        if ("integrationMethod" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#integrationMethod", "moved to package aws-apigatewayv2");
        if ("integrationUri" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#integrationUri", "moved to package aws-apigatewayv2");
        if ("passthroughBehavior" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#passthroughBehavior", "moved to package aws-apigatewayv2");
        if ("payloadFormatVersion" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#payloadFormatVersion", "moved to package aws-apigatewayv2");
        if ("requestParameters" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#requestParameters", "moved to package aws-apigatewayv2");
        if ("requestTemplates" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#requestTemplates", "moved to package aws-apigatewayv2");
        if ("templateSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#templateSelectionExpression", "moved to package aws-apigatewayv2");
        if ("timeoutInMillis" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationV2Props#timeoutInMillis", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnIntegrationV2(p) {
}
function _aws_cdk_aws_apigateway_CfnIntegrationResponseV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("integrationId" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#integrationId", "moved to package aws-apigatewayv2");
        if ("integrationResponseKey" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#integrationResponseKey", "moved to package aws-apigatewayv2");
        if ("contentHandlingStrategy" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#contentHandlingStrategy", "moved to package aws-apigatewayv2");
        if ("responseParameters" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#responseParameters", "moved to package aws-apigatewayv2");
        if ("responseTemplates" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#responseTemplates", "moved to package aws-apigatewayv2");
        if ("templateSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnIntegrationResponseV2Props#templateSelectionExpression", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnIntegrationResponseV2(p) {
}
function _aws_cdk_aws_apigateway_CfnModelV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnModelV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("name" in p)
            print("@aws-cdk/aws-apigateway.CfnModelV2Props#name", "moved to package aws-apigatewayv2");
        if ("schema" in p)
            print("@aws-cdk/aws-apigateway.CfnModelV2Props#schema", "moved to package aws-apigatewayv2");
        if ("contentType" in p)
            print("@aws-cdk/aws-apigateway.CfnModelV2Props#contentType", "moved to package aws-apigatewayv2");
        if ("description" in p)
            print("@aws-cdk/aws-apigateway.CfnModelV2Props#description", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnModelV2(p) {
}
function _aws_cdk_aws_apigateway_CfnRouteV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("routeKey" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#routeKey", "moved to package aws-apigatewayv2");
        if ("apiKeyRequired" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#apiKeyRequired", "moved to package aws-apigatewayv2");
        if ("authorizationScopes" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#authorizationScopes", "moved to package aws-apigatewayv2");
        if ("authorizationType" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#authorizationType", "moved to package aws-apigatewayv2");
        if ("authorizerId" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#authorizerId", "moved to package aws-apigatewayv2");
        if ("modelSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#modelSelectionExpression", "moved to package aws-apigatewayv2");
        if ("operationName" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#operationName", "moved to package aws-apigatewayv2");
        if ("requestModels" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#requestModels", "moved to package aws-apigatewayv2");
        if ("requestParameters" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#requestParameters", "moved to package aws-apigatewayv2");
        if ("routeResponseSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#routeResponseSelectionExpression", "moved to package aws-apigatewayv2");
        if ("target" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2Props#target", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnRouteV2(p) {
}
function _aws_cdk_aws_apigateway_CfnRouteV2_ParameterConstraintsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("required" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteV2.ParameterConstraintsProperty#required", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnRouteResponseV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("routeId" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#routeId", "moved to package aws-apigatewayv2");
        if ("routeResponseKey" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#routeResponseKey", "moved to package aws-apigatewayv2");
        if ("modelSelectionExpression" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#modelSelectionExpression", "moved to package aws-apigatewayv2");
        if ("responseModels" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#responseModels", "moved to package aws-apigatewayv2");
        if ("responseParameters" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2Props#responseParameters", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnRouteResponseV2(p) {
}
function _aws_cdk_aws_apigateway_CfnRouteResponseV2_ParameterConstraintsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("required" in p)
            print("@aws-cdk/aws-apigateway.CfnRouteResponseV2.ParameterConstraintsProperty#required", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnStageV2Props(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("apiId" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#apiId", "moved to package aws-apigatewayv2");
        if ("stageName" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#stageName", "moved to package aws-apigatewayv2");
        if ("accessLogSettings" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#accessLogSettings", "moved to package aws-apigatewayv2");
        if ("autoDeploy" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#autoDeploy", "moved to package aws-apigatewayv2");
        if ("clientCertificateId" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#clientCertificateId", "moved to package aws-apigatewayv2");
        if ("defaultRouteSettings" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#defaultRouteSettings", "moved to package aws-apigatewayv2");
        if ("deploymentId" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#deploymentId", "moved to package aws-apigatewayv2");
        if ("description" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#description", "moved to package aws-apigatewayv2");
        if ("routeSettings" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#routeSettings", "moved to package aws-apigatewayv2");
        if ("stageVariables" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#stageVariables", "moved to package aws-apigatewayv2");
        if ("tags" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2Props#tags", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnStageV2(p) {
}
function _aws_cdk_aws_apigateway_CfnStageV2_AccessLogSettingsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("destinationArn" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.AccessLogSettingsProperty#destinationArn", "moved to package aws-apigatewayv2");
        if ("format" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.AccessLogSettingsProperty#format", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_apigateway_CfnStageV2_RouteSettingsProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("dataTraceEnabled" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.RouteSettingsProperty#dataTraceEnabled", "moved to package aws-apigatewayv2");
        if ("detailedMetricsEnabled" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.RouteSettingsProperty#detailedMetricsEnabled", "moved to package aws-apigatewayv2");
        if ("loggingLevel" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.RouteSettingsProperty#loggingLevel", "moved to package aws-apigatewayv2");
        if ("throttlingBurstLimit" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.RouteSettingsProperty#throttlingBurstLimit", "moved to package aws-apigatewayv2");
        if ("throttlingRateLimit" in p)
            print("@aws-cdk/aws-apigateway.CfnStageV2.RouteSettingsProperty#throttlingRateLimit", "moved to package aws-apigatewayv2");
    }
    finally {
        visitedObjects.delete(p);
    }
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_apigateway_IRestApi, _aws_cdk_aws_apigateway_RestApiBaseProps, _aws_cdk_aws_apigateway_RestApiOptions, _aws_cdk_aws_apigateway_RestApiProps, _aws_cdk_aws_apigateway_SpecRestApiProps, _aws_cdk_aws_apigateway_RestApiBase, _aws_cdk_aws_apigateway_SpecRestApi, _aws_cdk_aws_apigateway_RestApiAttributes, _aws_cdk_aws_apigateway_RestApi, _aws_cdk_aws_apigateway_EndpointConfiguration, _aws_cdk_aws_apigateway_ApiKeySourceType, _aws_cdk_aws_apigateway_EndpointType, _aws_cdk_aws_apigateway_IResource, _aws_cdk_aws_apigateway_ResourceOptions, _aws_cdk_aws_apigateway_ResourceProps, _aws_cdk_aws_apigateway_ResourceBase, _aws_cdk_aws_apigateway_ResourceAttributes, _aws_cdk_aws_apigateway_Resource, _aws_cdk_aws_apigateway_ProxyResourceOptions, _aws_cdk_aws_apigateway_ProxyResourceProps, _aws_cdk_aws_apigateway_ProxyResource, _aws_cdk_aws_apigateway_MethodOptions, _aws_cdk_aws_apigateway_MethodProps, _aws_cdk_aws_apigateway_Method, _aws_cdk_aws_apigateway_AuthorizationType, _aws_cdk_aws_apigateway_IntegrationOptions, _aws_cdk_aws_apigateway_IntegrationProps, _aws_cdk_aws_apigateway_IntegrationConfig, _aws_cdk_aws_apigateway_Integration, _aws_cdk_aws_apigateway_ContentHandling, _aws_cdk_aws_apigateway_IntegrationType, _aws_cdk_aws_apigateway_PassthroughBehavior, _aws_cdk_aws_apigateway_ConnectionType, _aws_cdk_aws_apigateway_IntegrationResponse, _aws_cdk_aws_apigateway_DeploymentProps, _aws_cdk_aws_apigateway_Deployment, _aws_cdk_aws_apigateway_IStage, _aws_cdk_aws_apigateway_StageOptions, _aws_cdk_aws_apigateway_StageProps, _aws_cdk_aws_apigateway_MethodLoggingLevel, _aws_cdk_aws_apigateway_MethodDeploymentOptions, _aws_cdk_aws_apigateway_StageAttributes, _aws_cdk_aws_apigateway_StageBase, _aws_cdk_aws_apigateway_Stage, _aws_cdk_aws_apigateway_AwsIntegrationProps, _aws_cdk_aws_apigateway_AwsIntegration, _aws_cdk_aws_apigateway_LambdaIntegrationOptions, _aws_cdk_aws_apigateway_LambdaIntegration, _aws_cdk_aws_apigateway_HttpIntegrationProps, _aws_cdk_aws_apigateway_HttpIntegration, _aws_cdk_aws_apigateway_MockIntegration, _aws_cdk_aws_apigateway_StepFunctionsExecutionIntegrationOptions, _aws_cdk_aws_apigateway_StepFunctionsIntegration, _aws_cdk_aws_apigateway_RequestContext, _aws_cdk_aws_apigateway_LambdaRestApiProps, _aws_cdk_aws_apigateway_LambdaRestApi, _aws_cdk_aws_apigateway_IApiKey, _aws_cdk_aws_apigateway_ApiKeyOptions, _aws_cdk_aws_apigateway_ApiKeyProps, _aws_cdk_aws_apigateway_ApiKey, _aws_cdk_aws_apigateway_RateLimitedApiKeyProps, _aws_cdk_aws_apigateway_RateLimitedApiKey, _aws_cdk_aws_apigateway_ThrottleSettings, _aws_cdk_aws_apigateway_Period, _aws_cdk_aws_apigateway_QuotaSettings, _aws_cdk_aws_apigateway_ThrottlingPerMethod, _aws_cdk_aws_apigateway_UsagePlanPerApiStage, _aws_cdk_aws_apigateway_UsagePlanProps, _aws_cdk_aws_apigateway_AddApiKeyOptions, _aws_cdk_aws_apigateway_IUsagePlan, _aws_cdk_aws_apigateway_UsagePlan, _aws_cdk_aws_apigateway_IVpcLink, _aws_cdk_aws_apigateway_VpcLinkProps, _aws_cdk_aws_apigateway_VpcLink, _aws_cdk_aws_apigateway_MethodResponse, _aws_cdk_aws_apigateway_IModel, _aws_cdk_aws_apigateway_EmptyModel, _aws_cdk_aws_apigateway_ErrorModel, _aws_cdk_aws_apigateway_ModelOptions, _aws_cdk_aws_apigateway_ModelProps, _aws_cdk_aws_apigateway_Model, _aws_cdk_aws_apigateway_IRequestValidator, _aws_cdk_aws_apigateway_RequestValidatorOptions, _aws_cdk_aws_apigateway_RequestValidatorProps, _aws_cdk_aws_apigateway_RequestValidator, _aws_cdk_aws_apigateway_Authorizer, _aws_cdk_aws_apigateway_IAuthorizer, _aws_cdk_aws_apigateway_JsonSchemaVersion, _aws_cdk_aws_apigateway_JsonSchemaType, _aws_cdk_aws_apigateway_JsonSchema, _aws_cdk_aws_apigateway_ApiMappingOptions, _aws_cdk_aws_apigateway_SecurityPolicy, _aws_cdk_aws_apigateway_DomainNameOptions, _aws_cdk_aws_apigateway_DomainNameProps, _aws_cdk_aws_apigateway_IDomainName, _aws_cdk_aws_apigateway_DomainName, _aws_cdk_aws_apigateway_DomainNameAttributes, _aws_cdk_aws_apigateway_MTLSConfig, _aws_cdk_aws_apigateway_BasePathMappingOptions, _aws_cdk_aws_apigateway_BasePathMappingProps, _aws_cdk_aws_apigateway_BasePathMapping, _aws_cdk_aws_apigateway_CorsOptions, _aws_cdk_aws_apigateway_Cors, _aws_cdk_aws_apigateway_LambdaAuthorizerProps, _aws_cdk_aws_apigateway_TokenAuthorizerProps, _aws_cdk_aws_apigateway_TokenAuthorizer, _aws_cdk_aws_apigateway_RequestAuthorizerProps, _aws_cdk_aws_apigateway_RequestAuthorizer, _aws_cdk_aws_apigateway_IdentitySource, _aws_cdk_aws_apigateway_CognitoUserPoolsAuthorizerProps, _aws_cdk_aws_apigateway_CognitoUserPoolsAuthorizer, _aws_cdk_aws_apigateway_IAccessLogDestination, _aws_cdk_aws_apigateway_AccessLogDestinationConfig, _aws_cdk_aws_apigateway_LogGroupLogDestination, _aws_cdk_aws_apigateway_AccessLogField, _aws_cdk_aws_apigateway_JsonWithStandardFieldProps, _aws_cdk_aws_apigateway_AccessLogFormat, _aws_cdk_aws_apigateway_ApiDefinition, _aws_cdk_aws_apigateway_ApiDefinitionS3Location, _aws_cdk_aws_apigateway_ApiDefinitionConfig, _aws_cdk_aws_apigateway_S3ApiDefinition, _aws_cdk_aws_apigateway_InlineApiDefinition, _aws_cdk_aws_apigateway_AssetApiDefinition, _aws_cdk_aws_apigateway_IGatewayResponse, _aws_cdk_aws_apigateway_GatewayResponseProps, _aws_cdk_aws_apigateway_GatewayResponseOptions, _aws_cdk_aws_apigateway_GatewayResponse, _aws_cdk_aws_apigateway_ResponseType, _aws_cdk_aws_apigateway_StepFunctionsRestApiProps, _aws_cdk_aws_apigateway_StepFunctionsRestApi, _aws_cdk_aws_apigateway_CfnAccountProps, _aws_cdk_aws_apigateway_CfnAccount, _aws_cdk_aws_apigateway_CfnApiKeyProps, _aws_cdk_aws_apigateway_CfnApiKey, _aws_cdk_aws_apigateway_CfnApiKey_StageKeyProperty, _aws_cdk_aws_apigateway_CfnAuthorizerProps, _aws_cdk_aws_apigateway_CfnAuthorizer, _aws_cdk_aws_apigateway_CfnBasePathMappingProps, _aws_cdk_aws_apigateway_CfnBasePathMapping, _aws_cdk_aws_apigateway_CfnClientCertificateProps, _aws_cdk_aws_apigateway_CfnClientCertificate, _aws_cdk_aws_apigateway_CfnDeploymentProps, _aws_cdk_aws_apigateway_CfnDeployment, _aws_cdk_aws_apigateway_CfnDeployment_AccessLogSettingProperty, _aws_cdk_aws_apigateway_CfnDeployment_CanarySettingProperty, _aws_cdk_aws_apigateway_CfnDeployment_DeploymentCanarySettingsProperty, _aws_cdk_aws_apigateway_CfnDeployment_MethodSettingProperty, _aws_cdk_aws_apigateway_CfnDeployment_StageDescriptionProperty, _aws_cdk_aws_apigateway_CfnDocumentationPartProps, _aws_cdk_aws_apigateway_CfnDocumentationPart, _aws_cdk_aws_apigateway_CfnDocumentationPart_LocationProperty, _aws_cdk_aws_apigateway_CfnDocumentationVersionProps, _aws_cdk_aws_apigateway_CfnDocumentationVersion, _aws_cdk_aws_apigateway_CfnDomainNameProps, _aws_cdk_aws_apigateway_CfnDomainName, _aws_cdk_aws_apigateway_CfnDomainName_EndpointConfigurationProperty, _aws_cdk_aws_apigateway_CfnDomainName_MutualTlsAuthenticationProperty, _aws_cdk_aws_apigateway_CfnGatewayResponseProps, _aws_cdk_aws_apigateway_CfnGatewayResponse, _aws_cdk_aws_apigateway_CfnMethodProps, _aws_cdk_aws_apigateway_CfnMethod, _aws_cdk_aws_apigateway_CfnMethod_IntegrationProperty, _aws_cdk_aws_apigateway_CfnMethod_IntegrationResponseProperty, _aws_cdk_aws_apigateway_CfnMethod_MethodResponseProperty, _aws_cdk_aws_apigateway_CfnModelProps, _aws_cdk_aws_apigateway_CfnModel, _aws_cdk_aws_apigateway_CfnRequestValidatorProps, _aws_cdk_aws_apigateway_CfnRequestValidator, _aws_cdk_aws_apigateway_CfnResourceProps, _aws_cdk_aws_apigateway_CfnResource, _aws_cdk_aws_apigateway_CfnRestApiProps, _aws_cdk_aws_apigateway_CfnRestApi, _aws_cdk_aws_apigateway_CfnRestApi_EndpointConfigurationProperty, _aws_cdk_aws_apigateway_CfnRestApi_S3LocationProperty, _aws_cdk_aws_apigateway_CfnStageProps, _aws_cdk_aws_apigateway_CfnStage, _aws_cdk_aws_apigateway_CfnStage_AccessLogSettingProperty, _aws_cdk_aws_apigateway_CfnStage_CanarySettingProperty, _aws_cdk_aws_apigateway_CfnStage_MethodSettingProperty, _aws_cdk_aws_apigateway_CfnUsagePlanProps, _aws_cdk_aws_apigateway_CfnUsagePlan, _aws_cdk_aws_apigateway_CfnUsagePlan_ApiStageProperty, _aws_cdk_aws_apigateway_CfnUsagePlan_QuotaSettingsProperty, _aws_cdk_aws_apigateway_CfnUsagePlan_ThrottleSettingsProperty, _aws_cdk_aws_apigateway_CfnUsagePlanKeyProps, _aws_cdk_aws_apigateway_CfnUsagePlanKey, _aws_cdk_aws_apigateway_CfnVpcLinkProps, _aws_cdk_aws_apigateway_CfnVpcLink, _aws_cdk_aws_apigateway_CfnApiV2Props, _aws_cdk_aws_apigateway_CfnApiV2, _aws_cdk_aws_apigateway_CfnApiV2_BodyS3LocationProperty, _aws_cdk_aws_apigateway_CfnApiV2_CorsProperty, _aws_cdk_aws_apigateway_CfnApiMappingV2Props, _aws_cdk_aws_apigateway_CfnApiMappingV2, _aws_cdk_aws_apigateway_CfnAuthorizerV2Props, _aws_cdk_aws_apigateway_CfnAuthorizerV2, _aws_cdk_aws_apigateway_CfnAuthorizerV2_JWTConfigurationProperty, _aws_cdk_aws_apigateway_CfnDeploymentV2Props, _aws_cdk_aws_apigateway_CfnDeploymentV2, _aws_cdk_aws_apigateway_CfnDomainNameV2Props, _aws_cdk_aws_apigateway_CfnDomainNameV2, _aws_cdk_aws_apigateway_CfnDomainNameV2_DomainNameConfigurationProperty, _aws_cdk_aws_apigateway_CfnIntegrationV2Props, _aws_cdk_aws_apigateway_CfnIntegrationV2, _aws_cdk_aws_apigateway_CfnIntegrationResponseV2Props, _aws_cdk_aws_apigateway_CfnIntegrationResponseV2, _aws_cdk_aws_apigateway_CfnModelV2Props, _aws_cdk_aws_apigateway_CfnModelV2, _aws_cdk_aws_apigateway_CfnRouteV2Props, _aws_cdk_aws_apigateway_CfnRouteV2, _aws_cdk_aws_apigateway_CfnRouteV2_ParameterConstraintsProperty, _aws_cdk_aws_apigateway_CfnRouteResponseV2Props, _aws_cdk_aws_apigateway_CfnRouteResponseV2, _aws_cdk_aws_apigateway_CfnRouteResponseV2_ParameterConstraintsProperty, _aws_cdk_aws_apigateway_CfnStageV2Props, _aws_cdk_aws_apigateway_CfnStageV2, _aws_cdk_aws_apigateway_CfnStageV2_AccessLogSettingsProperty, _aws_cdk_aws_apigateway_CfnStageV2_RouteSettingsProperty };
