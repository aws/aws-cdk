function _aws_cdk_aws_route53_targets_ApiGatewayDomain(p) {
}
function _aws_cdk_aws_route53_targets_ApiGateway(p) {
}
function _aws_cdk_aws_route53_targets_ApiGatewayv2DomainProperties(p) {
}
function _aws_cdk_aws_route53_targets_BucketWebsiteTarget(p) {
}
function _aws_cdk_aws_route53_targets_ElasticBeanstalkEnvironmentEndpointTarget(p) {
}
function _aws_cdk_aws_route53_targets_ClassicLoadBalancerTarget(p) {
}
function _aws_cdk_aws_route53_targets_CloudFrontTarget(p) {
}
function _aws_cdk_aws_route53_targets_LoadBalancerTarget(p) {
}
function _aws_cdk_aws_route53_targets_InterfaceVpcEndpointTarget(p) {
}
function _aws_cdk_aws_route53_targets_UserPoolDomainTarget(p) {
}
function _aws_cdk_aws_route53_targets_GlobalAcceleratorDomainTarget(p) {
}
function _aws_cdk_aws_route53_targets_GlobalAcceleratorTarget(p) {
}
function _aws_cdk_aws_route53_targets_Route53RecordTarget(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_route53_targets_ApiGatewayDomain, _aws_cdk_aws_route53_targets_ApiGateway, _aws_cdk_aws_route53_targets_ApiGatewayv2DomainProperties, _aws_cdk_aws_route53_targets_BucketWebsiteTarget, _aws_cdk_aws_route53_targets_ElasticBeanstalkEnvironmentEndpointTarget, _aws_cdk_aws_route53_targets_ClassicLoadBalancerTarget, _aws_cdk_aws_route53_targets_CloudFrontTarget, _aws_cdk_aws_route53_targets_LoadBalancerTarget, _aws_cdk_aws_route53_targets_InterfaceVpcEndpointTarget, _aws_cdk_aws_route53_targets_UserPoolDomainTarget, _aws_cdk_aws_route53_targets_GlobalAcceleratorDomainTarget, _aws_cdk_aws_route53_targets_GlobalAcceleratorTarget, _aws_cdk_aws_route53_targets_Route53RecordTarget };
