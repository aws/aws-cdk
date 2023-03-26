function _aws_cdk_aws_robomaker_CfnFleetProps(p) {
}
function _aws_cdk_aws_robomaker_CfnFleet(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotProps(p) {
}
function _aws_cdk_aws_robomaker_CfnRobot(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotApplicationProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.robotSoftwareSuite))
            _aws_cdk_aws_robomaker_CfnRobotApplication_RobotSoftwareSuiteProperty(p.robotSoftwareSuite);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_robomaker_CfnRobotApplication(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotApplication_RobotSoftwareSuiteProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotApplication_SourceConfigProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotApplicationVersionProps(p) {
}
function _aws_cdk_aws_robomaker_CfnRobotApplicationVersion(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplicationProps(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplication(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplication_RenderingEngineProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplication_RobotSoftwareSuiteProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplication_SimulationSoftwareSuiteProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplication_SourceConfigProperty(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplicationVersionProps(p) {
}
function _aws_cdk_aws_robomaker_CfnSimulationApplicationVersion(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_robomaker_CfnFleetProps, _aws_cdk_aws_robomaker_CfnFleet, _aws_cdk_aws_robomaker_CfnRobotProps, _aws_cdk_aws_robomaker_CfnRobot, _aws_cdk_aws_robomaker_CfnRobotApplicationProps, _aws_cdk_aws_robomaker_CfnRobotApplication, _aws_cdk_aws_robomaker_CfnRobotApplication_RobotSoftwareSuiteProperty, _aws_cdk_aws_robomaker_CfnRobotApplication_SourceConfigProperty, _aws_cdk_aws_robomaker_CfnRobotApplicationVersionProps, _aws_cdk_aws_robomaker_CfnRobotApplicationVersion, _aws_cdk_aws_robomaker_CfnSimulationApplicationProps, _aws_cdk_aws_robomaker_CfnSimulationApplication, _aws_cdk_aws_robomaker_CfnSimulationApplication_RenderingEngineProperty, _aws_cdk_aws_robomaker_CfnSimulationApplication_RobotSoftwareSuiteProperty, _aws_cdk_aws_robomaker_CfnSimulationApplication_SimulationSoftwareSuiteProperty, _aws_cdk_aws_robomaker_CfnSimulationApplication_SourceConfigProperty, _aws_cdk_aws_robomaker_CfnSimulationApplicationVersionProps, _aws_cdk_aws_robomaker_CfnSimulationApplicationVersion };
