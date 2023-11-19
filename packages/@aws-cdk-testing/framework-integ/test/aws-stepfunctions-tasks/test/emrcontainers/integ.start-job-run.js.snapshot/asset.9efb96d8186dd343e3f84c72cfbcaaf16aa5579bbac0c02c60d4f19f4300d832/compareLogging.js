"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareLoggingProps = void 0;
function compareLoggingProps(oldProps, newProps) {
    const result = { logging: {} };
    let enabledTypes = [];
    let disabledTypes = [];
    if (newProps.logging?.clusterLogging === undefined && oldProps.logging?.clusterLogging === undefined) {
        return newProps;
    }
    // if newProps containes LogSetup
    if (newProps.logging && newProps.logging.clusterLogging && newProps.logging.clusterLogging.length > 0) {
        enabledTypes = newProps.logging.clusterLogging[0].types;
        // if oldProps contains LogSetup with enabled:true
        if (oldProps.logging && oldProps.logging.clusterLogging && oldProps.logging.clusterLogging.length > 0) {
            // LogType in oldProp but not in newProp should be considered disabled(enabled:false)
            disabledTypes = oldProps.logging.clusterLogging[0].types.filter(t => !newProps.logging.clusterLogging[0].types.includes(t));
        }
    }
    else {
        // all enabled:true in oldProps will be enabled:false
        disabledTypes = oldProps.logging.clusterLogging[0].types;
    }
    if (enabledTypes.length > 0 || disabledTypes.length > 0) {
        result.logging = { clusterLogging: [] };
    }
    // append the enabled:false LogSetup to the result
    if (enabledTypes.length > 0) {
        result.logging.clusterLogging.push({ types: enabledTypes, enabled: true });
    }
    // append the enabled:false LogSetup to the result
    if (disabledTypes.length > 0) {
        result.logging.clusterLogging.push({ types: disabledTypes, enabled: false });
    }
    return result;
}
exports.compareLoggingProps = compareLoggingProps;
