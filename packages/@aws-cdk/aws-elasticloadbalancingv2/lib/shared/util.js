"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTargetGroupFullName = exports.parseLoadBalancerFullName = exports.mapTagMapToCxschema = exports.validateNetworkProtocol = exports.ifUndefined = exports.determineProtocolAndPort = exports.defaultProtocolForPort = exports.defaultPortForProtocol = exports.renderAttributes = void 0;
const core_1 = require("@aws-cdk/core");
const enums_1 = require("./enums");
/**
 * Render an attribute dict to a list of { key, value } pairs
 */
function renderAttributes(attributes) {
    const ret = [];
    for (const [key, value] of Object.entries(attributes)) {
        if (value !== undefined) {
            ret.push({ key, value });
        }
    }
    return ret;
}
exports.renderAttributes = renderAttributes;
/**
 * Return the appropriate default port for a given protocol
 */
function defaultPortForProtocol(proto) {
    switch (proto) {
        case enums_1.ApplicationProtocol.HTTP: return 80;
        case enums_1.ApplicationProtocol.HTTPS: return 443;
        default:
            throw new Error(`Unrecognized protocol: ${proto}`);
    }
}
exports.defaultPortForProtocol = defaultPortForProtocol;
/**
 * Return the appropriate default protocol for a given port
 */
function defaultProtocolForPort(port) {
    switch (port) {
        case 80:
        case 8000:
        case 8008:
        case 8080:
            return enums_1.ApplicationProtocol.HTTP;
        case 443:
        case 8443:
            return enums_1.ApplicationProtocol.HTTPS;
        default:
            throw new Error(`Don't know default protocol for port: ${port}; please supply a protocol`);
    }
}
exports.defaultProtocolForPort = defaultProtocolForPort;
/**
 * Given a protocol and a port, try to guess the other one if it's undefined
 */
// eslint-disable-next-line max-len
function determineProtocolAndPort(protocol, port) {
    if (protocol === undefined && port === undefined) {
        return [undefined, undefined];
    }
    if (protocol === undefined) {
        protocol = defaultProtocolForPort(port);
    }
    if (port === undefined) {
        port = defaultPortForProtocol(protocol);
    }
    return [protocol, port];
}
exports.determineProtocolAndPort = determineProtocolAndPort;
/**
 * Helper function to default undefined input props
 */
function ifUndefined(x, def) {
    return x ?? def;
}
exports.ifUndefined = ifUndefined;
/**
 * Helper function for ensuring network listeners and target groups only accept valid
 * protocols.
 */
function validateNetworkProtocol(protocol) {
    const NLB_PROTOCOLS = [enums_1.Protocol.TCP, enums_1.Protocol.TLS, enums_1.Protocol.UDP, enums_1.Protocol.TCP_UDP];
    if (NLB_PROTOCOLS.indexOf(protocol) === -1) {
        throw new Error(`The protocol must be one of ${NLB_PROTOCOLS.join(', ')}. Found ${protocol}`);
    }
}
exports.validateNetworkProtocol = validateNetworkProtocol;
/**
 * Helper to map a map of tags to cxschema tag format.
 * @internal
 */
function mapTagMapToCxschema(tagMap) {
    return Object.entries(tagMap)
        .map(([key, value]) => ({ key, value }));
}
exports.mapTagMapToCxschema = mapTagMapToCxschema;
function parseLoadBalancerFullName(arn) {
    if (core_1.Token.isUnresolved(arn)) {
        // Unfortunately it is not possible to use Arn.split() because the ARNs have this shape:
        //
        //   arn:...:loadbalancer/net/my-load-balancer/123456
        //
        // And the way that Arn.split() handles this situation is not enough to obtain the full name
        const arnParts = core_1.Fn.split('/', arn);
        return `${core_1.Fn.select(1, arnParts)}/${core_1.Fn.select(2, arnParts)}/${core_1.Fn.select(3, arnParts)}`;
    }
    else {
        const arnComponents = core_1.Arn.split(arn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        const resourceName = arnComponents.resourceName;
        if (!resourceName) {
            throw new Error(`Provided ARN does not belong to a load balancer: ${arn}`);
        }
        return resourceName;
    }
}
exports.parseLoadBalancerFullName = parseLoadBalancerFullName;
/**
 * Transforms:
 *
 *   arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/my-target-group/da693d633af407a0
 *
 * Into:
 *
 *   targetgroup/my-target-group/da693d633af407a0
 */
function parseTargetGroupFullName(arn) {
    const arnComponents = core_1.Arn.split(arn, core_1.ArnFormat.NO_RESOURCE_NAME);
    const resource = arnComponents.resource;
    if (!resource) {
        throw new Error(`Provided ARN does not belong to a target group: ${arn}`);
    }
    return resource;
}
exports.parseTargetGroupFullName = parseTargetGroupFullName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQTBEO0FBQzFELG1DQUF3RDtBQUl4RDs7R0FFRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLFVBQXNCO0lBQ3JELE1BQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztJQUN0QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNyRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFSRCw0Q0FRQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsS0FBMEI7SUFDL0QsUUFBUSxLQUFLLEVBQUU7UUFDYixLQUFLLDJCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pDLEtBQUssMkJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUM7UUFDM0M7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQVBELHdEQU9DO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixzQkFBc0IsQ0FBQyxJQUFZO0lBQ2pELFFBQVEsSUFBSSxFQUFFO1FBQ1osS0FBSyxFQUFFLENBQUM7UUFDUixLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssSUFBSSxDQUFDO1FBQ1YsS0FBSyxJQUFJO1lBQ1AsT0FBTywyQkFBbUIsQ0FBQyxJQUFJLENBQUM7UUFFbEMsS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLElBQUk7WUFDUCxPQUFPLDJCQUFtQixDQUFDLEtBQUssQ0FB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RyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDeEMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDM0U7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBUEQsNERBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQXJuLCBBcm5Gb3JtYXQsIEZuLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Qcm90b2NvbCwgUHJvdG9jb2wgfSBmcm9tICcuL2VudW1zJztcblxuZXhwb3J0IHR5cGUgQXR0cmlidXRlcyA9IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkIH07XG5cbi8qKlxuICogUmVuZGVyIGFuIGF0dHJpYnV0ZSBkaWN0IHRvIGEgbGlzdCBvZiB7IGtleSwgdmFsdWUgfSBwYWlyc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQXR0cmlidXRlcyhhdHRyaWJ1dGVzOiBBdHRyaWJ1dGVzKSB7XG4gIGNvbnN0IHJldDogYW55W10gPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0LnB1c2goeyBrZXksIHZhbHVlIH0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgYXBwcm9wcmlhdGUgZGVmYXVsdCBwb3J0IGZvciBhIGdpdmVuIHByb3RvY29sXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UG9ydEZvclByb3RvY29sKHByb3RvOiBBcHBsaWNhdGlvblByb3RvY29sKTogbnVtYmVyIHtcbiAgc3dpdGNoIChwcm90bykge1xuICAgIGNhc2UgQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQOiByZXR1cm4gODA7XG4gICAgY2FzZSBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTOiByZXR1cm4gNDQzO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBwcm90b2NvbDogJHtwcm90b31gKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgYXBwcm9wcmlhdGUgZGVmYXVsdCBwcm90b2NvbCBmb3IgYSBnaXZlbiBwb3J0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0UHJvdG9jb2xGb3JQb3J0KHBvcnQ6IG51bWJlcik6IEFwcGxpY2F0aW9uUHJvdG9jb2wge1xuICBzd2l0Y2ggKHBvcnQpIHtcbiAgICBjYXNlIDgwOlxuICAgIGNhc2UgODAwMDpcbiAgICBjYXNlIDgwMDg6XG4gICAgY2FzZSA4MDgwOlxuICAgICAgcmV0dXJuIEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUDtcblxuICAgIGNhc2UgNDQzOlxuICAgIGNhc2UgODQ0MzpcbiAgICAgIHJldHVybiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRG9uJ3Qga25vdyBkZWZhdWx0IHByb3RvY29sIGZvciBwb3J0OiAke3BvcnR9OyBwbGVhc2Ugc3VwcGx5IGEgcHJvdG9jb2xgKTtcbiAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgcHJvdG9jb2wgYW5kIGEgcG9ydCwgdHJ5IHRvIGd1ZXNzIHRoZSBvdGhlciBvbmUgaWYgaXQncyB1bmRlZmluZWRcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVQcm90b2NvbEFuZFBvcnQocHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wgfCB1bmRlZmluZWQsIHBvcnQ6IG51bWJlciB8IHVuZGVmaW5lZCk6IFtBcHBsaWNhdGlvblByb3RvY29sIHwgdW5kZWZpbmVkLCBudW1iZXIgfCB1bmRlZmluZWRdIHtcbiAgaWYgKHByb3RvY29sID09PSB1bmRlZmluZWQgJiYgcG9ydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIHVuZGVmaW5lZF07XG4gIH1cblxuICBpZiAocHJvdG9jb2wgPT09IHVuZGVmaW5lZCkgeyBwcm90b2NvbCA9IGRlZmF1bHRQcm90b2NvbEZvclBvcnQocG9ydCEpOyB9XG4gIGlmIChwb3J0ID09PSB1bmRlZmluZWQpIHsgcG9ydCA9IGRlZmF1bHRQb3J0Rm9yUHJvdG9jb2wocHJvdG9jb2whKTsgfVxuXG4gIHJldHVybiBbcHJvdG9jb2wsIHBvcnRdO1xufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBkZWZhdWx0IHVuZGVmaW5lZCBpbnB1dCBwcm9wc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaWZVbmRlZmluZWQ8VD4oeDogVCB8IHVuZGVmaW5lZCwgZGVmOiBUKSB7XG4gIHJldHVybiB4ID8/IGRlZjtcbn1cblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGVuc3VyaW5nIG5ldHdvcmsgbGlzdGVuZXJzIGFuZCB0YXJnZXQgZ3JvdXBzIG9ubHkgYWNjZXB0IHZhbGlkXG4gKiBwcm90b2NvbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU5ldHdvcmtQcm90b2NvbChwcm90b2NvbDogUHJvdG9jb2wpIHtcbiAgY29uc3QgTkxCX1BST1RPQ09MUyA9IFtQcm90b2NvbC5UQ1AsIFByb3RvY29sLlRMUywgUHJvdG9jb2wuVURQLCBQcm90b2NvbC5UQ1BfVURQXTtcblxuICBpZiAoTkxCX1BST1RPQ09MUy5pbmRleE9mKHByb3RvY29sKSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwcm90b2NvbCBtdXN0IGJlIG9uZSBvZiAke05MQl9QUk9UT0NPTFMuam9pbignLCAnKX0uIEZvdW5kICR7cHJvdG9jb2x9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFwIGEgbWFwIG9mIHRhZ3MgdG8gY3hzY2hlbWEgdGFnIGZvcm1hdC5cbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwVGFnTWFwVG9DeHNjaGVtYSh0YWdNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBjeHNjaGVtYS5UYWdbXSB7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyh0YWdNYXApXG4gICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiAoeyBrZXksIHZhbHVlIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTG9hZEJhbGFuY2VyRnVsbE5hbWUoYXJuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGFybikpIHtcbiAgICAvLyBVbmZvcnR1bmF0ZWx5IGl0IGlzIG5vdCBwb3NzaWJsZSB0byB1c2UgQXJuLnNwbGl0KCkgYmVjYXVzZSB0aGUgQVJOcyBoYXZlIHRoaXMgc2hhcGU6XG4gICAgLy9cbiAgICAvLyAgIGFybjouLi46bG9hZGJhbGFuY2VyL25ldC9teS1sb2FkLWJhbGFuY2VyLzEyMzQ1NlxuICAgIC8vXG4gICAgLy8gQW5kIHRoZSB3YXkgdGhhdCBBcm4uc3BsaXQoKSBoYW5kbGVzIHRoaXMgc2l0dWF0aW9uIGlzIG5vdCBlbm91Z2ggdG8gb2J0YWluIHRoZSBmdWxsIG5hbWVcbiAgICBjb25zdCBhcm5QYXJ0cyA9IEZuLnNwbGl0KCcvJywgYXJuKTtcbiAgICByZXR1cm4gYCR7Rm4uc2VsZWN0KDEsIGFyblBhcnRzKX0vJHtGbi5zZWxlY3QoMiwgYXJuUGFydHMpfS8ke0ZuLnNlbGVjdCgzLCBhcm5QYXJ0cyl9YDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhcm5Db21wb25lbnRzID0gQXJuLnNwbGl0KGFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IGFybkNvbXBvbmVudHMucmVzb3VyY2VOYW1lO1xuICAgIGlmICghcmVzb3VyY2VOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFByb3ZpZGVkIEFSTiBkb2VzIG5vdCBiZWxvbmcgdG8gYSBsb2FkIGJhbGFuY2VyOiAke2Fybn1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlTmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIFRyYW5zZm9ybXM6XG4gKlxuICogICBhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLWVhc3QtMToxMjM0NTY3ODk6dGFyZ2V0Z3JvdXAvbXktdGFyZ2V0LWdyb3VwL2RhNjkzZDYzM2FmNDA3YTBcbiAqXG4gKiBJbnRvOlxuICpcbiAqICAgdGFyZ2V0Z3JvdXAvbXktdGFyZ2V0LWdyb3VwL2RhNjkzZDYzM2FmNDA3YTBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGFyZ2V0R3JvdXBGdWxsTmFtZShhcm46IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGFybkNvbXBvbmVudHMgPSBBcm4uc3BsaXQoYXJuLCBBcm5Gb3JtYXQuTk9fUkVTT1VSQ0VfTkFNRSk7XG4gIGNvbnN0IHJlc291cmNlID0gYXJuQ29tcG9uZW50cy5yZXNvdXJjZTtcbiAgaWYgKCFyZXNvdXJjZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUHJvdmlkZWQgQVJOIGRvZXMgbm90IGJlbG9uZyB0byBhIHRhcmdldCBncm91cDogJHthcm59YCk7XG4gIH1cbiAgcmV0dXJuIHJlc291cmNlO1xufVxuIl19