"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.external = void 0;
exports.handler = handler;
exports.withRetries = withRetries;
const https = __importStar(require("https"));
const url = __importStar(require("url"));
// for unit tests
exports.external = {
    sendHttpRequest: defaultSendHttpRequest,
    log: defaultLog,
    includeStackTraces: true,
    userHandlerIndex: './index',
};
const CREATE_FAILED_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED';
const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID';
async function handler(event, context) {
    const sanitizedEvent = { ...event, ResponseURL: '...' };
    // load the user module up front, because it declares which properties must not
    // be logged (`exports.redactProperties`). a load or validation error is reported
    // to cloudformation below; until then we cannot know which properties are
    // sensitive, so all property values are redacted from the log.
    let userModule;
    let loadError;
    try {
        userModule = loadUserModule();
    }
    catch (e) {
        loadError = e;
    }
    const loggableEvent = redactEventForLog(event, userModule?.redactProperties ?? REDACT_ALL);
    exports.external.log(JSON.stringify(loggableEvent, undefined, 2));
    // ignore DELETE event when the physical resource ID is the marker that
    // indicates that this DELETE is a subsequent DELETE to a failed CREATE
    // operation.
    if (event.RequestType === 'Delete' && event.PhysicalResourceId === CREATE_FAILED_PHYSICAL_ID_MARKER) {
        exports.external.log('ignoring DELETE event caused by a failed CREATE event');
        await submitResponse('SUCCESS', event);
        return;
    }
    try {
        // invoke the user handler. this is intentionally inside the try-catch to
        // ensure that if there is an error it's reported as a failure to
        // cloudformation (otherwise cfn waits).
        if (!userModule) {
            throw loadError;
        }
        const result = await userModule.handler(sanitizedEvent, context);
        // validate user response and create the combined event
        const responseEvent = renderResponse(event, result);
        // submit to cfn as success
        await submitResponse('SUCCESS', responseEvent);
    }
    catch (e) {
        const resp = {
            ...event,
            Reason: exports.external.includeStackTraces ? e.stack : e.message,
        };
        if (!resp.PhysicalResourceId) {
            // special case: if CREATE fails, which usually implies, we usually don't
            // have a physical resource id. in this case, the subsequent DELETE
            // operation does not have any meaning, and will likely fail as well. to
            // address this, we use a marker so the provider framework can simply
            // ignore the subsequent DELETE.
            if (event.RequestType === 'Create') {
                exports.external.log('CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored');
                resp.PhysicalResourceId = CREATE_FAILED_PHYSICAL_ID_MARKER;
            }
            else {
                // otherwise, if PhysicalResourceId is not specified, something is
                // terribly wrong because all other events should have an ID.
                exports.external.log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(loggableEvent)}`);
            }
        }
        // this is an actual error, fail the activity altogether and exist.
        await submitResponse('FAILED', resp);
    }
}
function renderResponse(cfnRequest, handlerResponse = {}) {
    // if physical ID is not returned, we have some defaults for you based
    // on the request type.
    const physicalResourceId = handlerResponse.PhysicalResourceId ?? cfnRequest.PhysicalResourceId ?? cfnRequest.RequestId;
    // if we are in DELETE and physical ID was changed, it's an error.
    if (cfnRequest.RequestType === 'Delete' && physicalResourceId !== cfnRequest.PhysicalResourceId) {
        throw new Error(`DELETE: cannot change the physical resource ID from "${cfnRequest.PhysicalResourceId}" to "${handlerResponse.PhysicalResourceId}" during deletion`);
    }
    // merge request event and result event (result prevails).
    return {
        ...cfnRequest,
        ...handlerResponse,
        PhysicalResourceId: physicalResourceId,
    };
}
async function submitResponse(status, event) {
    const json = {
        Status: status,
        Reason: event.Reason ?? status,
        StackId: event.StackId,
        RequestId: event.RequestId,
        PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: event.NoEcho,
        Data: event.Data,
    };
    const parsedUrl = url.parse(event.ResponseURL);
    const loggingSafeUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}/${parsedUrl.pathname}?***`;
    exports.external.log('submit response to cloudformation', loggingSafeUrl, json.NoEcho ? redactResponseData(json) : json);
    const responseBody = JSON.stringify(json);
    const req = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': Buffer.byteLength(responseBody, 'utf8'),
        },
    };
    const retryOptions = {
        attempts: 5,
        sleep: 1000,
    };
    await withRetries(retryOptions, exports.external.sendHttpRequest)(req, responseBody);
}
async function defaultSendHttpRequest(options, requestBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, (response) => {
                response.resume(); // Consume the response but don't care about it
                if (!response.statusCode || response.statusCode >= 400) {
                    reject(new Error(`Unsuccessful HTTP response: ${response.statusCode}`));
                }
                else {
                    resolve();
                }
            });
            request.on('error', reject);
            request.write(requestBody);
            request.end();
        }
        catch (e) {
            reject(e);
        }
    });
}
function loadUserModule() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(exports.external.userHandlerIndex);
    return {
        handler: mod.handler,
        redactProperties: validateRedactProperties(mod.redactProperties, '"exports.redactProperties"'),
    };
}
const REDACTED = '*****';
const REDACT_ALL = Symbol('redact-all');
/**
 * Validates a list of property names to redact from logs. Only top-level names are
 * supported; anything else fails with an explicit error instead of being ignored.
 *
 * NOTE: duplicated from `nodejs-entrypoint.ts`. This file is copied into assets
 * without bundling, so it cannot import shared code.
 */
function validateRedactProperties(names, source) {
    if (names === undefined) {
        return [];
    }
    if (!Array.isArray(names)) {
        throw new Error(`Invalid ${source}: expected an array of top-level property names, got ${typeof names}`);
    }
    for (const name of names) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error(`Invalid ${source}: entries must be non-empty strings, got ${JSON.stringify(name)}`);
        }
        if (name.includes('.')) {
            throw new Error(`Invalid ${source}: "${name}" contains '.'; only top-level property names are supported, nested paths are not supported yet`);
        }
    }
    return names;
}
/**
 * Returns a copy of the event that is safe to log: the presigned `ResponseURL`
 * is hidden and the listed top-level properties (or all of them) are replaced
 * with a placeholder in both `ResourceProperties` and `OldResourceProperties`.
 */
function redactEventForLog(event, redactProperties) {
    const loggable = { ...event, ResponseURL: '...' };
    for (const key of ['ResourceProperties', 'OldResourceProperties']) {
        if (key in loggable) {
            loggable[key] = redactPropertyValues(loggable[key], redactProperties);
        }
    }
    return loggable;
}
function redactPropertyValues(props, redactProperties) {
    if (!props || typeof props !== 'object') {
        return props;
    }
    const names = redactProperties === REDACT_ALL ? Object.keys(props) : redactProperties;
    const ret = { ...props };
    for (const name of names) {
        if (Object.prototype.hasOwnProperty.call(ret, name)) {
            ret[name] = REDACTED;
        }
    }
    return ret;
}
function redactResponseData(json) {
    if (!json.Data) {
        return json;
    }
    return { ...json, Data: Object.fromEntries(Object.keys(json.Data).map(k => [k, REDACTED])) };
}
function defaultLog(fmt, ...params) {
    console.log(fmt, ...params);
}
function withRetries(options, fn) {
    return async (...xs) => {
        let attempts = options.attempts;
        let ms = options.sleep;
        while (true) {
            try {
                return await fn(...xs);
            }
            catch (e) {
                if (attempts-- <= 0) {
                    throw e;
                }
                await sleep(Math.floor(Math.random() * ms));
                ms *= 2;
            }
        }
    };
}
async function sleep(ms) {
    return new Promise((ok) => setTimeout(ok, ms));
}
