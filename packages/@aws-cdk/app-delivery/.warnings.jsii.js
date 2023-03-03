function _aws_cdk_app_delivery_PipelineDeployStackActionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("adminPermissions" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#adminPermissions", "");
        if ("input" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#input", "");
        if ("stack" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#stack", "");
        if ("capabilities" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#capabilities", "");
        if (p.capabilities != null)
            for (const o of p.capabilities)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-cloudformation/.warnings.jsii.js")._aws_cdk_aws_cloudformation_CloudFormationCapabilities(o);
        if ("changeSetName" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#changeSetName", "");
        if ("createChangeSetActionName" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#createChangeSetActionName", "");
        if ("createChangeSetRunOrder" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#createChangeSetRunOrder", "");
        if ("executeChangeSetActionName" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#executeChangeSetActionName", "");
        if ("executeChangeSetRunOrder" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#executeChangeSetRunOrder", "");
        if ("role" in p)
            print("@aws-cdk/app-delivery.PipelineDeployStackActionProps#role", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_delivery_PipelineDeployStackAction(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_app_delivery_PipelineDeployStackActionProps, _aws_cdk_app_delivery_PipelineDeployStackAction };
