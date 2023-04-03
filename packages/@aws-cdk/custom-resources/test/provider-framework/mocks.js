"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExecutionMock = exports.prepareForExecution = exports.invokeFunctionMock = exports.httpRequestMock = exports.setup = exports.cfnResponse = exports.startStateMachineInput = exports.isCompleteImplMock = exports.onEventImplMock = exports.stringifyPayload = exports.MOCK_SFN_ARN = exports.MOCK_IS_COMPLETE_FUNCTION_ARN = exports.MOCK_ON_EVENT_FUNCTION_ARN = exports.MOCK_REQUEST = void 0;
const url_1 = require("url");
const consts = require("../../lib/provider-framework/runtime/consts");
exports.MOCK_REQUEST = {
    ResponseURL: 'http://pre-signed-S3-url-for-response/path/in/bucket',
    LogicalResourceId: 'MyTestResource',
    RequestId: 'uniqueid-for-this-create-request',
    StackId: 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
};
exports.MOCK_ON_EVENT_FUNCTION_ARN = 'arn:lambda:user:on:event';
exports.MOCK_IS_COMPLETE_FUNCTION_ARN = 'arn:lambda:user:is:complete';
exports.MOCK_SFN_ARN = 'arn:of:state:machine';
exports.stringifyPayload = true;
function setup() {
    process.env[consts.WAITER_STATE_MACHINE_ARN_ENV] = exports.MOCK_SFN_ARN;
    exports.stringifyPayload = true;
    exports.onEventImplMock = undefined;
    exports.isCompleteImplMock = undefined;
    exports.cfnResponse = {};
    exports.startStateMachineInput = undefined;
}
exports.setup = setup;
async function httpRequestMock(options, body) {
    const responseUrl = url_1.parse(exports.MOCK_REQUEST.ResponseURL);
    expect(options.method).toEqual('PUT');
    expect(options.path).toEqual(responseUrl.path);
    expect(options.hostname).toEqual(responseUrl.hostname);
    const headers = options.headers || {};
    expect(headers['content-length']).toEqual(body.length);
    expect(headers['content-type']).toStrictEqual('');
    exports.cfnResponse = JSON.parse(body);
    if (!exports.cfnResponse) {
        throw new Error('unexpected');
    }
    // we always expect a physical resource id
    expect(exports.cfnResponse.PhysicalResourceId).toBeTruthy();
    // we always expect a reason
    expect(exports.cfnResponse.Reason).toBeTruthy();
    expect(exports.cfnResponse.LogicalResourceId).toEqual(exports.MOCK_REQUEST.LogicalResourceId);
    expect(exports.cfnResponse.RequestId).toEqual(exports.MOCK_REQUEST.RequestId);
    expect(exports.cfnResponse.StackId).toEqual(exports.MOCK_REQUEST.StackId);
    expect(exports.cfnResponse.Status === 'FAILED' || exports.cfnResponse.Status === 'SUCCESS').toBeTruthy();
}
exports.httpRequestMock = httpRequestMock;
async function invokeFunctionMock(req) {
    if (!req.Payload || typeof (req.Payload) !== 'string') {
        throw new Error(`invalid payload of type ${typeof (req.Payload)}}`);
    }
    const input = JSON.parse(req.Payload);
    try {
        let ret;
        switch (req.FunctionName) {
            case exports.MOCK_ON_EVENT_FUNCTION_ARN:
                if (!exports.onEventImplMock) {
                    throw new Error('Trying to trigger "onEvent" but it is not implemented');
                }
                ret = await exports.onEventImplMock(input);
                break;
            case exports.MOCK_IS_COMPLETE_FUNCTION_ARN:
                if (!exports.isCompleteImplMock) {
                    throw new Error('Trying to trigger "isComplete" but it is not implemented');
                }
                ret = await exports.isCompleteImplMock(input);
                break;
            default:
                throw new Error('unknown mock function');
        }
        return {
            Payload: exports.stringifyPayload ? JSON.stringify(ret) : ret,
        };
    }
    catch (e) {
        return {
            FunctionError: 'Unhandled',
            Payload: JSON.stringify({
                errorType: e.name,
                errorMessage: e.message,
                trace: [
                    'AccessDenied: Access Denied',
                    '    at Request.extractError (/var/runtime/node_modules/aws-sdk/lib/services/s3.js:585:35)',
                    '    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)',
                    '    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)',
                    '    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:683:14)',
                    '    at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)',
                    '    at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)',
                    '    at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10',
                    '    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)',
                    '    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:685:12)',
                    '    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)',
                ],
            }),
        };
    }
}
exports.invokeFunctionMock = invokeFunctionMock;
function prepareForExecution() {
    exports.startStateMachineInput = undefined;
    if (exports.onEventImplMock) {
        process.env[consts.USER_ON_EVENT_FUNCTION_ARN_ENV] = exports.MOCK_ON_EVENT_FUNCTION_ARN;
    }
    else {
        delete process.env[consts.USER_ON_EVENT_FUNCTION_ARN_ENV];
    }
    if (exports.isCompleteImplMock) {
        process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV] = exports.MOCK_IS_COMPLETE_FUNCTION_ARN;
    }
    else {
        delete process.env[consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV];
    }
}
exports.prepareForExecution = prepareForExecution;
async function startExecutionMock(req) {
    exports.startStateMachineInput = req;
    expect(req.stateMachineArn).toEqual(exports.MOCK_SFN_ARN);
    return {
        executionArn: req.stateMachineArn + '/execution',
        startDate: new Date(),
    };
}
exports.startExecutionMock = startExecutionMock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ja3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBd0M7QUFDeEMsc0VBQXNFO0FBRXpELFFBQUEsWUFBWSxHQUFHO0lBQzFCLFdBQVcsRUFBRSxzREFBc0Q7SUFDbkUsaUJBQWlCLEVBQUUsZ0JBQWdCO0lBQ25DLFNBQVMsRUFBRSxrQ0FBa0M7SUFDN0MsT0FBTyxFQUFFLHFFQUFxRTtDQUMvRSxDQUFDO0FBRVcsUUFBQSwwQkFBMEIsR0FBRywwQkFBMEIsQ0FBQztBQUN4RCxRQUFBLDZCQUE2QixHQUFHLDZCQUE2QixDQUFDO0FBQzlELFFBQUEsWUFBWSxHQUFHLHNCQUFzQixDQUFDO0FBRXhDLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBTW5DLFNBQWdCLEtBQUs7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLENBQUMsR0FBRyxvQkFBWSxDQUFDO0lBRWhFLHdCQUFnQixHQUFHLElBQUksQ0FBQztJQUN4Qix1QkFBZSxHQUFHLFNBQVMsQ0FBQztJQUM1QiwwQkFBa0IsR0FBRyxTQUFTLENBQUM7SUFDL0IsbUJBQVcsR0FBRyxFQUFTLENBQUM7SUFDeEIsOEJBQXNCLEdBQUcsU0FBUyxDQUFDO0FBQ3JDLENBQUM7QUFSRCxzQkFRQztBQUVNLEtBQUssVUFBVSxlQUFlLENBQUMsT0FBNkIsRUFBRSxJQUFZO0lBQy9FLE1BQU0sV0FBVyxHQUFHLFdBQVEsQ0FBQyxvQkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXZELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxD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WyJpbXBvcnQgKiBhcyBodHRwcyBmcm9tICdodHRwcyc7XG5pbXBvcnQgeyBwYXJzZSBhcyB1cmxwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgKiBhcyBjb25zdHMgZnJvbSAnLi4vLi4vbGliL3Byb3ZpZGVyLWZyYW1ld29yay9ydW50aW1lL2NvbnN0cyc7XG5cbmV4cG9ydCBjb25zdCBNT0NLX1JFUVVFU1QgPSB7XG4gIFJlc3BvbnNlVVJMOiAnaHR0cDovL3ByZS1zaWduZWQtUzMtdXJsLWZvci1yZXNwb25zZS9wYXRoL2luL2J1Y2tldCcsXG4gIExvZ2ljYWxSZXNvdXJjZUlkOiAnTXlUZXN0UmVzb3VyY2UnLFxuICBSZXF1ZXN0SWQ6ICd1bmlxdWVpZC1mb3ItdGhpcy1jcmVhdGUtcmVxdWVzdCcsXG4gIFN0YWNrSWQ6ICdhcm46YXdzOmNsb3VkZm9ybWF0aW9uOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c3RhY2svc3RhY2stbmFtZS9ndWlkJyxcbn07XG5cbmV4cG9ydCBjb25zdCBNT0NLX09OX0VWRU5UX0ZVTkNUSU9OX0FSTiA9ICdhcm46bGFtYmRhOnVzZXI6b246ZXZlbnQnO1xuZXhwb3J0IGNvbnN0IE1PQ0tfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOID0gJ2FybjpsYW1iZGE6dXNlcjppczpjb21wbGV0ZSc7XG5leHBvcnQgY29uc3QgTU9DS19TRk5fQVJOID0gJ2FybjpvZjpzdGF0ZTptYWNoaW5lJztcblxuZXhwb3J0IGxldCBzdHJpbmdpZnlQYXlsb2FkID0gdHJ1ZTtcbmV4cG9ydCBsZXQgb25FdmVudEltcGxNb2NrOiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRIYW5kbGVyIHwgdW5kZWZpbmVkO1xuZXhwb3J0IGxldCBpc0NvbXBsZXRlSW1wbE1vY2s6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZUhhbmRsZXIgfCB1bmRlZmluZWQ7XG5leHBvcnQgbGV0IHN0YXJ0U3RhdGVNYWNoaW5lSW5wdXQ6IEFXUy5TdGVwRnVuY3Rpb25zLlN0YXJ0RXhlY3V0aW9uSW5wdXQgfCB1bmRlZmluZWQ7XG5leHBvcnQgbGV0IGNmblJlc3BvbnNlOiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZVJlc3BvbnNlO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XG4gIHByb2Nlc3MuZW52W2NvbnN0cy5XQUlURVJfU1RBVEVfTUFDSElORV9BUk5fRU5WXSA9IE1PQ0tfU0ZOX0FSTjtcblxuICBzdHJpbmdpZnlQYXlsb2FkID0gdHJ1ZTtcbiAgb25FdmVudEltcGxNb2NrID0gdW5kZWZpbmVkO1xuICBpc0NvbXBsZXRlSW1wbE1vY2sgPSB1bmRlZmluZWQ7XG4gIGNmblJlc3BvbnNlID0ge30gYXMgYW55O1xuICBzdGFydFN0YXRlTWFjaGluZUlucHV0ID0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaHR0cFJlcXVlc3RNb2NrKG9wdGlvbnM6IGh0dHBzLlJlcXVlc3RPcHRpb25zLCBib2R5OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzcG9uc2VVcmwgPSB1cmxwYXJzZShNT0NLX1JFUVVFU1QuUmVzcG9uc2VVUkwpO1xuXG4gIGV4cGVjdChvcHRpb25zLm1ldGhvZCkudG9FcXVhbCgnUFVUJyk7XG4gIGV4cGVjdChvcHRpb25zLnBhdGgpLnRvRXF1YWwocmVzcG9uc2VVcmwucGF0aCk7XG4gIGV4cGVjdChvcHRpb25zLmhvc3RuYW1lKS50b0VxdWFsKHJlc3BvbnNlVXJsLmhvc3RuYW1lKTtcbiAgY29uc3QgaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgZXhwZWN0KGhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pLnRvRXF1YWwoYm9keS5sZW5ndGgpO1xuICBleHBlY3QoaGVhZGVyc1snY29udGVudC10eXBlJ10pLnRvU3RyaWN0RXF1YWwoJycpO1xuICBjZm5SZXNwb25zZSA9IEpTT04ucGFyc2UoYm9keSk7XG5cbiAgaWYgKCFjZm5SZXNwb25zZSkgeyB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQnKTsgfVxuXG4gIC8vIHdlIGFsd2F5cyBleHBlY3QgYSBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICBleHBlY3QoY2ZuUmVzcG9uc2UuUGh5c2ljYWxSZXNvdXJjZUlkKS50b0JlVHJ1dGh5KCk7XG5cbiAgLy8gd2UgYWx3YXlzIGV4cGVjdCBhIHJlYXNvblxuICBleHBlY3QoY2ZuUmVzcG9uc2UuUmVhc29uKS50b0JlVHJ1dGh5KCk7XG5cbiAgZXhwZWN0KGNmblJlc3BvbnNlLkxvZ2ljYWxSZXNvdXJjZUlkKS50b0VxdWFsKE1PQ0tfUkVRVUVTVC5Mb2dpY2FsUmVzb3VyY2VJZCk7XG4gIGV4cGVjdChjZm5SZXNwb25zZS5SZXF1ZXN0SWQpLnRvRXF1YWwoTU9DS19SRVFVRVNULlJlcXVlc3RJZCk7XG4gIGV4cGVjdChjZm5SZXNwb25zZS5TdGFja0lkKS50b0VxdWFsKE1PQ0tfUkVRVUVTVC5TdGFja0lkKTtcbiAgZXhwZWN0KGNmblJlc3BvbnNlLlN0YXR1cyA9PT0gJ0ZBSUxFRCcgfHwgY2ZuUmVzcG9uc2UuU3RhdHVzID09PSAnU1VDQ0VTUycpLnRvQmVUcnV0aHkoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGludm9rZUZ1bmN0aW9uTW9jayhyZXE6IEFXUy5MYW1iZGEuSW52b2NhdGlvblJlcXVlc3QpOiBQcm9taXNlPEFXUy5MYW1iZGEuSW52b2NhdGlvblJlc3BvbnNlPiB7XG4gIGlmICghcmVxLlBheWxvYWQgfHwgdHlwZW9mIChyZXEuUGF5bG9hZCkgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHBheWxvYWQgb2YgdHlwZSAke3R5cGVvZiAocmVxLlBheWxvYWQpfX1gKTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0ID0gSlNPTi5wYXJzZShyZXEuUGF5bG9hZCk7XG5cbiAgdHJ5IHtcblxuICAgIGxldCByZXQ7XG4gICAgc3dpdGNoIChyZXEuRnVuY3Rpb25OYW1lKSB7XG4gICAgICBjYXNlIE1PQ0tfT05fRVZFTlRfRlVOQ1RJT05fQVJOOlxuICAgICAgICBpZiAoIW9uRXZlbnRJbXBsTW9jaykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJ5aW5nIHRvIHRyaWdnZXIgXCJvbkV2ZW50XCIgYnV0IGl0IGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldCA9IGF3YWl0IG9uRXZlbnRJbXBsTW9jayhpbnB1dCBhcyBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLk9uRXZlbnRSZXF1ZXN0KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTU9DS19JU19DT01QTEVURV9GVU5DVElPTl9BUk46XG4gICAgICAgIGlmICghaXNDb21wbGV0ZUltcGxNb2NrKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcnlpbmcgdG8gdHJpZ2dlciBcImlzQ29tcGxldGVcIiBidXQgaXQgaXMgbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0ID0gYXdhaXQgaXNDb21wbGV0ZUltcGxNb2NrKGlucHV0IGFzIEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3QpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIG1vY2sgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgUGF5bG9hZDogc3RyaW5naWZ5UGF5bG9hZCA/IEpTT04uc3RyaW5naWZ5KHJldCkgOiByZXQsXG4gICAgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7XG4gICAgICBGdW5jdGlvbkVycm9yOiAnVW5oYW5kbGVkJyxcbiAgICAgIFBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZXJyb3JUeXBlOiBlLm5hbWUsXG4gICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICB0cmFjZTogW1xuICAgICAgICAgICdBY2Nlc3NEZW5pZWQ6IEFjY2VzcyBEZW5pZWQnLFxuICAgICAgICAgICcgICAgYXQgUmVxdWVzdC5leHRyYWN0RXJyb3IgKC92YXIvcnVudGltZS9ub2RlX21vZHVsZXMvYXdzLXNkay9saWIvc2VydmljZXMvczMuanM6NTg1OjM1KScsXG4gICAgICAgICAgJyAgICBhdCBSZXF1ZXN0LmNhbGxMaXN0ZW5lcnMgKC92YXIvcnVudGltZS9ub2RlX21vZHVsZXMvYXdzLXNkay9saWIvc2VxdWVudGlhbF9leGVjdXRvci5qczoxMDY6MjApJyxcbiAgICAgICAgICAnICAgIGF0IFJlcXVlc3QuZW1pdCAoL3Zhci9ydW50aW1lL25vZGVfbW9kdWxlcy9hd3Mtc2RrL2xpYi9zZXF1ZW50aWFsX2V4ZWN1dG9yLmpzOjc4OjEwKScsXG4gICAgICAgICAgJyAgICBhdCBSZXF1ZXN0LmVtaXQgKC92YXIvcnVudGltZS9ub2RlX21vZHVsZXMvYXdzLXNkay9saWIvcmVxdWVzdC5qczo2ODM6MTQpJyxcbiAgICAgICAgICAnICAgIGF0IFJlcXVlc3QudHJhbnNpdGlvbiAoL3Zhci9ydW50aW1lL25vZGVfbW9kdWxlcy9hd3Mtc2RrL2xpYi9yZXF1ZXN0LmpzOjIyOjEwKScsXG4gICAgICAgICAgJyAgICBhdCBBY2NlcHRvclN0YXRlTWFjaGluZS5ydW5UbyAoL3Zhci9ydW50aW1lL25vZGVfbW9kdWxlcy9hd3Mtc2RrL2xpYi9zdGF0ZV9tYWNoaW5lLmpzOjE0OjEyKScsXG4gICAgICAgICAgJyAgICBhdCAvdmFyL3J1bnRpbWUvbm9kZV9tb2R1bGVzL2F3cy1zZGsvbGliL3N0YXRlX21hY2hpbmUuanM6MjY6MTAnLFxuICAgICAgICAgICcgICAgYXQgUmVxdWVzdC48YW5vbnltb3VzPiAoL3Zhci9ydW50aW1lL25vZGVfbW9kdWxlcy9hd3Mtc2RrL2xpYi9yZXF1ZXN0LmpzOjM4OjkpJyxcbiAgICAgICAgICAnICAgIGF0IFJlcXVlc3QuPGFub255bW91cz4gKC92YXIvcnVudGltZS9ub2RlX21vZHVsZXMvYXdzLXNkay9saWIvcmVxdWVzdC5qczo2ODU6MTIpJyxcbiAgICAgICAgICAnICAgIGF0IFJlcXVlc3QuY2FsbExpc3RlbmVycyAoL3Zhci9ydW50aW1lL25vZGVfbW9kdWxlcy9hd3Mtc2RrL2xpYi9zZXF1ZW50aWFsX2V4ZWN1dG9yLmpzOjExNjoxOCknLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUZvckV4ZWN1dGlvbigpIHtcbiAgc3RhcnRTdGF0ZU1hY2hpbmVJbnB1dCA9IHVuZGVmaW5lZDtcblxuICBpZiAob25FdmVudEltcGxNb2NrKSB7XG4gICAgcHJvY2Vzcy5lbnZbY29uc3RzLlVTRVJfT05fRVZFTlRfRlVOQ1RJT05fQVJOX0VOVl0gPSBNT0NLX09OX0VWRU5UX0ZVTkNUSU9OX0FSTjtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgcHJvY2Vzcy5lbnZbY29uc3RzLlVTRVJfT05fRVZFTlRfRlVOQ1RJT05fQVJOX0VOVl07XG4gIH1cblxuICBpZiAoaXNDb21wbGV0ZUltcGxNb2NrKSB7XG4gICAgcHJvY2Vzcy5lbnZbY29uc3RzLlVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOX0VOVl0gPSBNT0NLX0lTX0NPTVBMRVRFX0ZVTkNUSU9OX0FSTjtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgcHJvY2Vzcy5lbnZbY29uc3RzLlVTRVJfSVNfQ09NUExFVEVfRlVOQ1RJT05fQVJOX0VOVl07XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0RXhlY3V0aW9uTW9jayhyZXE6IEFXUy5TdGVwRnVuY3Rpb25zLlN0YXJ0RXhlY3V0aW9uSW5wdXQpIHtcbiAgc3RhcnRTdGF0ZU1hY2hpbmVJbnB1dCA9IHJlcTtcbiAgZXhwZWN0KHJlcS5zdGF0ZU1hY2hpbmVBcm4pLnRvRXF1YWwoTU9DS19TRk5fQVJOKTtcbiAgcmV0dXJuIHtcbiAgICBleGVjdXRpb25Bcm46IHJlcS5zdGF0ZU1hY2hpbmVBcm4gKyAnL2V4ZWN1dGlvbicsXG4gICAgc3RhcnREYXRlOiBuZXcgRGF0ZSgpLFxuICB9O1xufVxuIl19