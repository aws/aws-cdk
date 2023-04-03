"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepFunctionsIntegration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const sfn = require("@aws-cdk/aws-stepfunctions");
const core_1 = require("@aws-cdk/core");
const aws_1 = require("./aws");
const integration_1 = require("../integration");
const model_1 = require("../model");
/**
 * Options to integrate with various StepFunction API
 */
class StepFunctionsIntegration {
    /**
     * Integrates a Synchronous Express State Machine from AWS Step Functions to an API Gateway method.
     *
     * @example
     *
     *    const stateMachine = new stepfunctions.StateMachine(this, 'MyStateMachine', {
     *       stateMachineType: stepfunctions.StateMachineType.EXPRESS,
     *       definition: stepfunctions.Chain.start(new stepfunctions.Pass(this, 'Pass')),
     *    });
     *
     *    const api = new apigateway.RestApi(this, 'Api', {
     *       restApiName: 'MyApi',
     *    });
     *    api.root.addMethod('GET', apigateway.StepFunctionsIntegration.startExecution(stateMachine));
     */
    static startExecution(stateMachine, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_StepFunctionsExecutionIntegrationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.startExecution);
            }
            throw error;
        }
        return new StepFunctionsExecutionIntegration(stateMachine, options);
    }
}
exports.StepFunctionsIntegration = StepFunctionsIntegration;
_a = JSII_RTTI_SYMBOL_1;
StepFunctionsIntegration[_a] = { fqn: "@aws-cdk/aws-apigateway.StepFunctionsIntegration", version: "0.0.0" };
class StepFunctionsExecutionIntegration extends aws_1.AwsIntegration {
    constructor(stateMachine, options = {}) {
        super({
            service: 'states',
            action: 'StartSyncExecution',
            options: {
                credentialsRole: options.credentialsRole,
                integrationResponses: integrationResponse(),
                passthroughBehavior: integration_1.PassthroughBehavior.NEVER,
                requestTemplates: requestTemplates(stateMachine, options),
                ...options,
            },
        });
        this.stateMachine = stateMachine;
    }
    bind(method) {
        const bindResult = super.bind(method);
        const credentialsRole = bindResult.options?.credentialsRole ?? new iam.Role(method, 'StartSyncExecutionRole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        });
        this.stateMachine.grantStartSyncExecution(credentialsRole);
        let stateMachineName;
        if (this.stateMachine instanceof sfn.StateMachine) {
            const stateMachineType = this.stateMachine.stateMachineType;
            if (stateMachineType !== sfn.StateMachineType.EXPRESS) {
                throw new Error('State Machine must be of type "EXPRESS". Please use StateMachineType.EXPRESS as the stateMachineType');
            }
            //if not imported, extract the name from the CFN layer to reach the
            //literal value if it is given (rather than a token)
            stateMachineName = this.stateMachine.node.defaultChild.stateMachineName;
        }
        else {
            //imported state machine
            stateMachineName = `StateMachine-${this.stateMachine.stack.node.addr}`;
        }
        let deploymentToken;
        if (stateMachineName !== undefined && !core_1.Token.isUnresolved(stateMachineName)) {
            deploymentToken = JSON.stringify({ stateMachineName });
        }
        for (const methodResponse of METHOD_RESPONSES) {
            method.addMethodResponse(methodResponse);
        }
        return {
            ...bindResult,
            options: {
                ...bindResult.options,
                credentialsRole,
            },
            deploymentToken,
        };
    }
}
/**
 * Defines the integration response that passes the result on success,
 * or the error on failure, from the synchronous execution to the caller.
 *
 * @returns integrationResponse mapping
 */
function integrationResponse() {
    const errorResponse = [
        {
            /**
             * Specifies the regular expression (regex) pattern used to choose
             * an integration response based on the response from the back end.
             * In this case it will match all '4XX' HTTP Errors
             */
            selectionPattern: '4\\d{2}',
            statusCode: '400',
            responseTemplates: {
                'application/json': `{
            "error": "Bad request!"
          }`,
            },
        },
        {
            /**
             * Match all '5XX' HTTP Errors
             */
            selectionPattern: '5\\d{2}',
            statusCode: '500',
            responseTemplates: {
                'application/json': '"error": $input.path(\'$.error\')',
            },
        },
    ];
    const integResponse = [
        {
            statusCode: '200',
            responseTemplates: {
                /* eslint-disable */
                'application/json': [
                    '#set($inputRoot = $input.path(\'$\'))',
                    '#if($input.path(\'$.status\').toString().equals("FAILED"))',
                    '#set($context.responseOverride.status = 500)',
                    '{',
                    '"error": "$input.path(\'$.error\')",',
                    '"cause": "$input.path(\'$.cause\')"',
                    '}',
                    '#else',
                    '$input.path(\'$.output\')',
                    '#end',
                ].join('\n'),
            },
        },
        ...errorResponse,
    ];
    return integResponse;
}
/**
 * Defines the request template that will be used for the integration
 * @param stateMachine
 * @param options
 * @returns requestTemplate
 */
function requestTemplates(stateMachine, options) {
    const templateStr = templateString(stateMachine, options);
    const requestTemplate = {
        'application/json': templateStr,
    };
    return requestTemplate;
}
/**
 * Reads the VTL template and returns the template string to be used
 * for the request template.
 *
 * @param stateMachine
 * @param includeRequestContext
 * @param options
 * @reutrns templateString
 */
function templateString(stateMachine, options) {
    let templateStr;
    let requestContextStr = '';
    const includeHeader = options.headers ?? false;
    const includeQueryString = options.querystring ?? true;
    const includePath = options.path ?? true;
    const includeAuthorizer = options.authorizer ?? false;
    if (options.requestContext && Object.keys(options.requestContext).length > 0) {
        requestContextStr = requestContext(options.requestContext);
    }
    templateStr = fs.readFileSync(path.join(__dirname, 'stepfunctions.vtl'), { encoding: 'utf-8' });
    templateStr = templateStr.replace('%STATEMACHINE%', stateMachine.stateMachineArn);
    templateStr = templateStr.replace('%INCLUDE_HEADERS%', String(includeHeader));
    templateStr = templateStr.replace('%INCLUDE_QUERYSTRING%', String(includeQueryString));
    templateStr = templateStr.replace('%INCLUDE_PATH%', String(includePath));
    templateStr = templateStr.replace('%INCLUDE_AUTHORIZER%', String(includeAuthorizer));
    templateStr = templateStr.replace('%REQUESTCONTEXT%', requestContextStr);
    return templateStr;
}
function requestContext(requestContextObj) {
    const context = {
        accountId: requestContextObj?.accountId ? '$context.identity.accountId' : undefined,
        apiId: requestContextObj?.apiId ? '$context.apiId' : undefined,
        apiKey: requestContextObj?.apiKey ? '$context.identity.apiKey' : undefined,
        authorizerPrincipalId: requestContextObj?.authorizerPrincipalId ? '$context.authorizer.principalId' : undefined,
        caller: requestContextObj?.caller ? '$context.identity.caller' : undefined,
        cognitoAuthenticationProvider: requestContextObj?.cognitoAuthenticationProvider ? '$context.identity.cognitoAuthenticationProvider' : undefined,
        cognitoAuthenticationType: requestContextObj?.cognitoAuthenticationType ? '$context.identity.cognitoAuthenticationType' : undefined,
        cognitoIdentityId: requestContextObj?.cognitoIdentityId ? '$context.identity.cognitoIdentityId' : undefined,
        cognitoIdentityPoolId: requestContextObj?.cognitoIdentityPoolId ? '$context.identity.cognitoIdentityPoolId' : undefined,
        httpMethod: requestContextObj?.httpMethod ? '$context.httpMethod' : undefined,
        stage: requestContextObj?.stage ? '$context.stage' : undefined,
        sourceIp: requestContextObj?.sourceIp ? '$context.identity.sourceIp' : undefined,
        user: requestContextObj?.user ? '$context.identity.user' : undefined,
        userAgent: requestContextObj?.userAgent ? '$context.identity.userAgent' : undefined,
        userArn: requestContextObj?.userArn ? '$context.identity.userArn' : undefined,
        requestId: requestContextObj?.requestId ? '$context.requestId' : undefined,
        resourceId: requestContextObj?.resourceId ? '$context.resourceId' : undefined,
        resourcePath: requestContextObj?.resourcePath ? '$context.resourcePath' : undefined,
    };
    const contextAsString = JSON.stringify(context);
    // The VTL Template conflicts with double-quotes (") for strings.
    // Before sending to the template, we replace double-quotes (") with @@ and replace it back inside the .vtl file
    const doublequotes = '"';
    const replaceWith = '@@';
    return contextAsString.split(doublequotes).join(replaceWith);
}
/**
 * Method response model for each HTTP code response
 */
const METHOD_RESPONSES = [
    {
        statusCode: '200',
        responseModels: {
            'application/json': model_1.Model.EMPTY_MODEL,
        },
    },
    {
        statusCode: '400',
        responseModels: {
            'application/json': model_1.Model.ERROR_MODEL,
        },
    },
    {
        statusCode: '500',
        responseModels: {
            'application/json': model_1.Model.ERROR_MODEL,
        },
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcGZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXBmdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMsa0RBQWtEO0FBQ2xELHdDQUFzQztBQUV0QywrQkFBdUM7QUFDdkMsZ0RBQTRGO0FBRTVGLG9DQUFpQztBQThFakM7O0dBRUc7QUFDSCxNQUFhLHdCQUF3QjtJQUNuQzs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBK0IsRUFBRSxPQUFrRDs7Ozs7Ozs7OztRQUM5RyxPQUFPLElBQUksaUNBQWlDLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3JFOztBQWxCSCw0REFtQkM7OztBQUVELE1BQU0saUNBQWtDLFNBQVEsb0JBQWM7SUFFNUQsWUFBWSxZQUErQixFQUFFLFVBQW9ELEVBQUU7UUFDakcsS0FBSyxDQUFDO1lBQ0osT0FBTyxFQUFFLFFBQVE7WUFDakIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLE9BQU8sQ0FBQyxlQUFlO2dCQUN4QyxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRTtnQkFDM0MsbUJBQW1CLEVBQUUsaUNBQW1CLENBQUMsS0FBSztnQkFDOUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztnQkFDekQsR0FBRyxPQUFPO2FBQ1g7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztLQUNsQztJQUVNLElBQUksQ0FBQyxNQUFjO1FBQ3hCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEMsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxlQUFlLElBQUksSUFBSSxHQUFHLENB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QUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCO1FBQ0UsVUFBVSxFQUFFLEtBQUs7UUFDakIsY0FBYyxFQUFFO1lBQ2Qsa0JBQWtCLEVBQUUsYUFBSyxDQUFDLFdBQVc7U0FDdEM7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLEtBQUs7UUFDakIsY0FBYyxFQUFFO1lBQ2Qsa0JBQWtCLEVBQUUsYUFBSyxDQUFDLFdBQVc7U0FDdEM7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLEtBQUs7UUFDakIsY0FBYyxFQUFFO1lBQ2Qsa0JBQWtCLEVBQUUsYUFBSyxDQUFDLFdBQVc7U0FDdEM7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJ0Bhd3MtY2RrL2F3cy1zdGVwZnVuY3Rpb25zJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBSZXF1ZXN0Q29udGV4dCB9IGZyb20gJy4nO1xuaW1wb3J0IHsgQXdzSW50ZWdyYXRpb24gfSBmcm9tICcuL2F3cyc7XG5pbXBvcnQgeyBJbnRlZ3JhdGlvbkNvbmZpZywgSW50ZWdyYXRpb25PcHRpb25zLCBQYXNzdGhyb3VnaEJlaGF2aW9yIH0gZnJvbSAnLi4vaW50ZWdyYXRpb24nO1xuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSAnLi4vbWV0aG9kJztcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vbW9kZWwnO1xuLyoqXG4gKiBPcHRpb25zIHdoZW4gY29uZmlndXJpbmcgU3RlcCBGdW5jdGlvbnMgc3luY2hyb25vdXMgaW50ZWdyYXRpb24gd2l0aCBSZXN0IEFQSVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0ZXBGdW5jdGlvbnNFeGVjdXRpb25JbnRlZ3JhdGlvbk9wdGlvbnMgZXh0ZW5kcyBJbnRlZ3JhdGlvbk9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBXaGljaCBkZXRhaWxzIG9mIHRoZSBpbmNvbWluZyByZXF1ZXN0IG11c3QgYmUgcGFzc2VkIG9udG8gdGhlIHVuZGVybHlpbmcgc3RhdGUgbWFjaGluZSxcbiAgICogc3VjaCBhcywgYWNjb3VudCBpZCwgdXNlciBpZGVudGl0eSwgcmVxdWVzdCBpZCwgZXRjLiBUaGUgZXhlY3V0aW9uIGlucHV0IHdpbGwgaW5jbHVkZSBhIG5ldyBrZXkgYHJlcXVlc3RDb250ZXh0YDpcbiAgICpcbiAgICoge1xuICAgKiAgIFwiYm9keVwiOiB7fSxcbiAgICogICBcInJlcXVlc3RDb250ZXh0XCI6IHtcbiAgICogICAgICAgXCJrZXlcIjogXCJ2YWx1ZVwiXG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYWxsIHBhcmFtZXRlcnMgd2l0aGluIHJlcXVlc3QgY29udGV4dCB3aWxsIGJlIHNldCBhcyBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdENvbnRleHQ/OiBSZXF1ZXN0Q29udGV4dDtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgcXVlcnlzdHJpbmcgaXMgdG8gYmUgaW5jbHVkZWQgaW5zaWRlIHRoZSBleGVjdXRpb24gaW5wdXQuIFRoZSBleGVjdXRpb24gaW5wdXQgd2lsbCBpbmNsdWRlIGEgbmV3IGtleSBgcXVlcnlTdHJpbmdgOlxuICAgKlxuICAgKiB7XG4gICAqICAgXCJib2R5XCI6IHt9LFxuICAgKiAgIFwicXVlcnlzdHJpbmdcIjoge1xuICAgKiAgICAgXCJrZXlcIjogXCJ2YWx1ZVwiXG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5c3RyaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgcGF0aCBpcyB0byBiZSBpbmNsdWRlZCBpbnNpZGUgdGhlIGV4ZWN1dGlvbiBpbnB1dC4gVGhlIGV4ZWN1dGlvbiBpbnB1dCB3aWxsIGluY2x1ZGUgYSBuZXcga2V5IGBwYXRoYDpcbiAgICpcbiAgICoge1xuICAgKiAgIFwiYm9keVwiOiB7fSxcbiAgICogICBcInBhdGhcIjoge1xuICAgKiAgICAgXCJyZXNvdXJjZU5hbWVcIjogXCJyZXNvdXJjZVZhbHVlXCJcbiAgICogICB9XG4gICAqIH1cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGhlYWRlciBpcyB0byBiZSBpbmNsdWRlZCBpbnNpZGUgdGhlIGV4ZWN1dGlvbiBpbnB1dC4gVGhlIGV4ZWN1dGlvbiBpbnB1dCB3aWxsIGluY2x1ZGUgYSBuZXcga2V5IGBoZWFkZXJzYDpcbiAgICpcbiAgICoge1xuICAgKiAgIFwiYm9keVwiOiB7fSxcbiAgICogICBcImhlYWRlcnNcIjoge1xuICAgKiAgICAgIFwiaGVhZGVyMVwiOiBcInZhbHVlXCIsXG4gICAqICAgICAgXCJoZWFkZXIyXCI6IFwidmFsdWVcIlxuICAgKiAgIH1cbiAgICogfVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVycz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHRoZSB3aG9sZSBhdXRob3JpemVyIG9iamVjdCwgaW5jbHVkaW5nIGN1c3RvbSBjb250ZXh0IHZhbHVlcyBzaG91bGQgYmUgaW4gdGhlIGV4ZWN1dGlvbiBpbnB1dC4gVGhlIGV4ZWN1dGlvbiBpbnB1dCB3aWxsIGluY2x1ZGUgYSBuZXcga2V5IGBhdXRob3JpemVyYDpcbiAgICpcbiAgICoge1xuICAgKiAgIFwiYm9keVwiOiB7fSxcbiAgICogICBcImF1dGhvcml6ZXJcIjoge1xuICAgKiAgICAgXCJrZXlcIjogXCJ2YWx1ZVwiXG4gICAqICAgfVxuICAgKiB9XG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVyPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGludGVncmF0ZSB3aXRoIHZhcmlvdXMgU3RlcEZ1bmN0aW9uIEFQSVxuICovXG5leHBvcnQgY2xhc3MgU3RlcEZ1bmN0aW9uc0ludGVncmF0aW9uIHtcbiAgLyoqXG4gICAqIEludGVncmF0ZXMgYSBTeW5jaHJvbm91cyBFeHByZXNzIFN0YXRlIE1hY2hpbmUgZnJvbSBBV1MgU3RlcCBGdW5jdGlvbnMgdG8gYW4gQVBJIEdhdGV3YXkgbWV0aG9kLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICBjb25zdCBzdGF0ZU1hY2hpbmUgPSBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUodGhpcywgJ015U3RhdGVNYWNoaW5lJywge1xuICAgKiAgICAgICBzdGF0ZU1hY2hpbmVUeXBlOiBzdGVwZnVuY3Rpb25zLlN0YXRlTWFjaGluZVR5cGUuRVhQUkVTUyxcbiAgICogICAgICAgZGVmaW5pdGlvbjogc3RlcGZ1bmN0aW9ucy5DaGFpbi5zdGFydChuZXcgc3RlcGZ1bmN0aW9ucy5QYXNzKHRoaXMsICdQYXNzJykpLFxuICAgKiAgICB9KTtcbiAgICpcbiAgICogICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnQXBpJywge1xuICAgKiAgICAgICByZXN0QXBpTmFtZTogJ015QXBpJyxcbiAgICogICAgfSk7XG4gICAqICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJywgYXBpZ2F0ZXdheS5TdGVwRnVuY3Rpb25zSW50ZWdyYXRpb24uc3RhcnRFeGVjdXRpb24oc3RhdGVNYWNoaW5lKSk7XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0YXJ0RXhlY3V0aW9uKHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUsIG9wdGlvbnM/OiBTdGVwRnVuY3Rpb25zRXhlY3V0aW9uSW50ZWdyYXRpb25PcHRpb25zKTogQXdzSW50ZWdyYXRpb24ge1xuICAgIHJldHVybiBuZXcgU3RlcEZ1bmN0aW9uc0V4ZWN1dGlvbkludGVncmF0aW9uKHN0YXRlTWFjaGluZSwgb3B0aW9ucyk7XG4gIH1cbn1cblxuY2xhc3MgU3RlcEZ1bmN0aW9uc0V4ZWN1dGlvbkludGVncmF0aW9uIGV4dGVuZHMgQXdzSW50ZWdyYXRpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmU7XG4gIGNvbnN0cnVjdG9yKHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUsIG9wdGlvbnM6IFN0ZXBGdW5jdGlvbnNFeGVjdXRpb25JbnRlZ3JhdGlvbk9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHNlcnZpY2U6ICdzdGF0ZXMnLFxuICAgICAgYWN0aW9uOiAnU3RhcnRTeW5jRXhlY3V0aW9uJyxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY3JlZGVudGlhbHNSb2xlOiBvcHRpb25zLmNyZWRlbnRpYWxzUm9sZSxcbiAgICAgICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IGludGVncmF0aW9uUmVzcG9uc2UoKSxcbiAgICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgICAgICAgcmVxdWVzdFRlbXBsYXRlczogcmVxdWVzdFRlbXBsYXRlcyhzdGF0ZU1hY2hpbmUsIG9wdGlvbnMpLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGVNYWNoaW5lID0gc3RhdGVNYWNoaW5lO1xuICB9XG5cbiAgcHVibGljIGJpbmQobWV0aG9kOiBNZXRob2QpOiBJbnRlZ3JhdGlvbkNvbmZpZyB7XG4gICAgY29uc3QgYmluZFJlc3VsdCA9IHN1cGVyLmJpbmQobWV0aG9kKTtcblxuICAgIGNvbnN0IGNyZWRlbnRpYWxzUm9sZSA9IGJpbmRSZXN1bHQub3B0aW9ucz8uY3JlZGVudGlhbHNSb2xlID8/IG5ldyBpYW0uUm9sZShtZXRob2QsICdTdGFydFN5bmNFeGVjdXRpb25Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2FwaWdhdGV3YXkuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIHRoaXMuc3RhdGVNYWNoaW5lLmdyYW50U3RhcnRTeW5jRXhlY3V0aW9uKGNyZWRlbnRpYWxzUm9sZSk7XG5cbiAgICBsZXQgc3RhdGVNYWNoaW5lTmFtZTtcblxuICAgIGlmICh0aGlzLnN0YXRlTWFjaGluZSBpbnN0YW5jZW9mIHNmbi5TdGF0ZU1hY2hpbmUpIHtcbiAgICAgIGNvbnN0IHN0YXRlTWFjaGluZVR5cGUgPSAodGhpcy5zdGF0ZU1hY2hpbmUgYXMgc2ZuLlN0YXRlTWFjaGluZSkuc3RhdGVNYWNoaW5lVHlwZTtcbiAgICAgIGlmIChzdGF0ZU1hY2hpbmVUeXBlICE9PSBzZm4uU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhdGUgTWFjaGluZSBtdXN0IGJlIG9mIHR5cGUgXCJFWFBSRVNTXCIuIFBsZWFzZSB1c2UgU3RhdGVNYWNoaW5lVHlwZS5FWFBSRVNTIGFzIHRoZSBzdGF0ZU1hY2hpbmVUeXBlJyk7XG4gICAgICB9XG5cbiAgICAgIC8vaWYgbm90IGltcG9ydGVkLCBleHRyYWN0IHRoZSBuYW1lIGZyb20gdGhlIENGTiBsYXllciB0byByZWFjaCB0aGVcbiAgICAgIC8vbGl0ZXJhbCB2YWx1ZSBpZiBpdCBpcyBnaXZlbiAocmF0aGVyIHRoYW4gYSB0b2tlbilcbiAgICAgIHN0YXRlTWFjaGluZU5hbWUgPSAodGhpcy5zdGF0ZU1hY2hpbmUubm9kZS5kZWZhdWx0Q2hpbGQgYXMgc2ZuLkNmblN0YXRlTWFjaGluZSkuc3RhdGVNYWNoaW5lTmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9pbXBvcnRlZCBzdGF0ZSBtYWNoaW5lXG4gICAgICBzdGF0ZU1hY2hpbmVOYW1lID0gYFN0YXRlTWFjaGluZS0ke3RoaXMuc3RhdGVNYWNoaW5lLnN0YWNrLm5vZGUuYWRkcn1gO1xuICAgIH1cblxuICAgIGxldCBkZXBsb3ltZW50VG9rZW47XG5cbiAgICBpZiAoc3RhdGVNYWNoaW5lTmFtZSAhPT0gdW5kZWZpbmVkICYmICFUb2tlbi5pc1VucmVzb2x2ZWQoc3RhdGVNYWNoaW5lTmFtZSkpIHtcbiAgICAgIGRlcGxveW1lbnRUb2tlbiA9IEpTT04uc3RyaW5naWZ5KHsgc3RhdGVNYWNoaW5lTmFtZSB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG1ldGhvZFJlc3BvbnNlIG9mIE1FVEhPRF9SRVNQT05TRVMpIHtcbiAgICAgIG1ldGhvZC5hZGRNZXRob2RSZXNwb25zZShtZXRob2RSZXNwb25zZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmJpbmRSZXN1bHQsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIC4uLmJpbmRSZXN1bHQub3B0aW9ucyxcbiAgICAgICAgY3JlZGVudGlhbHNSb2xlLFxuICAgICAgfSxcbiAgICAgIGRlcGxveW1lbnRUb2tlbixcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgaW50ZWdyYXRpb24gcmVzcG9uc2UgdGhhdCBwYXNzZXMgdGhlIHJlc3VsdCBvbiBzdWNjZXNzLFxuICogb3IgdGhlIGVycm9yIG9uIGZhaWx1cmUsIGZyb20gdGhlIHN5bmNocm9ub3VzIGV4ZWN1dGlvbiB0byB0aGUgY2FsbGVyLlxuICpcbiAqIEByZXR1cm5zIGludGVncmF0aW9uUmVzcG9uc2UgbWFwcGluZ1xuICovXG5mdW5jdGlvbiBpbnRlZ3JhdGlvblJlc3BvbnNlKCkge1xuICBjb25zdCBlcnJvclJlc3BvbnNlID0gW1xuICAgIHtcbiAgICAgIC8qKlxuICAgICAgICogU3BlY2lmaWVzIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gKHJlZ2V4KSBwYXR0ZXJuIHVzZWQgdG8gY2hvb3NlXG4gICAgICAgKiBhbiBpbnRlZ3JhdGlvbiByZXNwb25zZSBiYXNlZCBvbiB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgYmFjayBlbmQuXG4gICAgICAgKiBJbiB0aGlzIGNhc2UgaXQgd2lsbCBtYXRjaCBhbGwgJzRYWCcgSFRUUCBFcnJvcnNcbiAgICAgICAqL1xuICAgICAgc2VsZWN0aW9uUGF0dGVybjogJzRcXFxcZHsyfScsXG4gICAgICBzdGF0dXNDb2RlOiAnNDAwJyxcbiAgICAgIHJlc3BvbnNlVGVtcGxhdGVzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogYHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJCYWQgcmVxdWVzdCFcIlxuICAgICAgICAgIH1gLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIC8qKlxuICAgICAgICogTWF0Y2ggYWxsICc1WFgnIEhUVFAgRXJyb3JzXG4gICAgICAgKi9cbiAgICAgIHNlbGVjdGlvblBhdHRlcm46ICc1XFxcXGR7Mn0nLFxuICAgICAgc3RhdHVzQ29kZTogJzUwMCcsXG4gICAgICByZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICdcImVycm9yXCI6ICRpbnB1dC5wYXRoKFxcJyQuZXJyb3JcXCcpJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcblxuICBjb25zdCBpbnRlZ1Jlc3BvbnNlID0gW1xuICAgIHtcbiAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgcmVzcG9uc2VUZW1wbGF0ZXM6IHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBbXG4gICAgICAgICAgJyNzZXQoJGlucHV0Um9vdCA9ICRpbnB1dC5wYXRoKFxcJyRcXCcpKScsXG4gICAgICAgICAgJyNpZigkaW5wdXQucGF0aChcXCckLnN0YXR1c1xcJykudG9TdHJpbmcoKS5lcXVhbHMoXCJGQUlMRURcIikpJyxcbiAgICAgICAgICAgICcjc2V0KCRjb250ZXh0LnJlc3BvbnNlT3ZlcnJpZGUuc3RhdHVzID0gNTAwKScsXG4gICAgICAgICAgICAneycsXG4gICAgICAgICAgICAgICdcImVycm9yXCI6IFwiJGlucHV0LnBhdGgoXFwnJC5lcnJvclxcJylcIiwnLFxuICAgICAgICAgICAgICAnXCJjYXVzZVwiOiBcIiRpbnB1dC5wYXRoKFxcJyQuY2F1c2VcXCcpXCInLFxuICAgICAgICAgICAgJ30nLFxuICAgICAgICAgICcjZWxzZScsXG4gICAgICAgICAgICAnJGlucHV0LnBhdGgoXFwnJC5vdXRwdXRcXCcpJyxcbiAgICAgICAgICAnI2VuZCcsXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAuLi5lcnJvclJlc3BvbnNlLFxuICBdO1xuXG4gIHJldHVybiBpbnRlZ1Jlc3BvbnNlO1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIHJlcXVlc3QgdGVtcGxhdGUgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSBpbnRlZ3JhdGlvblxuICogQHBhcmFtIHN0YXRlTWFjaGluZVxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zIHJlcXVlc3RUZW1wbGF0ZVxuICovXG5mdW5jdGlvbiByZXF1ZXN0VGVtcGxhdGVzKHN0YXRlTWFjaGluZTogc2ZuLklTdGF0ZU1hY2hpbmUsIG9wdGlvbnM6IFN0ZXBGdW5jdGlvbnNFeGVjdXRpb25JbnRlZ3JhdGlvbk9wdGlvbnMpIHtcbiAgY29uc3QgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0cmluZyhzdGF0ZU1hY2hpbmUsIG9wdGlvbnMpO1xuXG4gIGNvbnN0IHJlcXVlc3RUZW1wbGF0ZTogeyBbY29udGVudFR5cGU6c3RyaW5nXSA6IHN0cmluZyB9ID1cbiAgICB7XG4gICAgICAnYXBwbGljYXRpb24vanNvbic6IHRlbXBsYXRlU3RyLFxuICAgIH07XG5cbiAgcmV0dXJuIHJlcXVlc3RUZW1wbGF0ZTtcbn1cblxuLyoqXG4gKiBSZWFkcyB0aGUgVlRMIHRlbXBsYXRlIGFuZCByZXR1cm5zIHRoZSB0ZW1wbGF0ZSBzdHJpbmcgdG8gYmUgdXNlZFxuICogZm9yIHRoZSByZXF1ZXN0IHRlbXBsYXRlLlxuICpcbiAqIEBwYXJhbSBzdGF0ZU1hY2hpbmVcbiAqIEBwYXJhbSBpbmNsdWRlUmVxdWVzdENvbnRleHRcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV1dHJucyB0ZW1wbGF0ZVN0cmluZ1xuICovXG5mdW5jdGlvbiB0ZW1wbGF0ZVN0cmluZyhcbiAgc3RhdGVNYWNoaW5lOiBzZm4uSVN0YXRlTWFjaGluZSxcbiAgb3B0aW9uczogU3RlcEZ1bmN0aW9uc0V4ZWN1dGlvbkludGVncmF0aW9uT3B0aW9ucyk6IHN0cmluZyB7XG4gIGxldCB0ZW1wbGF0ZVN0cjogc3RyaW5nO1xuXG4gIGxldCByZXF1ZXN0Q29udGV4dFN0ciA9ICcnO1xuXG4gIGNvbnN0IGluY2x1ZGVIZWFkZXIgPSBvcHRpb25zLmhlYWRlcnM/PyBmYWxzZTtcbiAgY29uc3QgaW5jbHVkZVF1ZXJ5U3RyaW5nID0gb3B0aW9ucy5xdWVyeXN0cmluZz8/IHRydWU7XG4gIGNvbnN0IGluY2x1ZGVQYXRoID0gb3B0aW9ucy5wYXRoPz8gdHJ1ZTtcbiAgY29uc3QgaW5jbHVkZUF1dGhvcml6ZXIgPSBvcHRpb25zLmF1dGhvcml6ZXIgPz8gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMucmVxdWVzdENvbnRleHQgJiYgT2JqZWN0LmtleXMob3B0aW9ucy5yZXF1ZXN0Q29udGV4dCkubGVuZ3RoID4gMCkge1xuICAgIHJlcXVlc3RDb250ZXh0U3RyID0gcmVxdWVzdENvbnRleHQob3B0aW9ucy5yZXF1ZXN0Q29udGV4dCk7XG4gIH1cblxuICB0ZW1wbGF0ZVN0ciA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3RlcGZ1bmN0aW9ucy52dGwnKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0ci5yZXBsYWNlKCclU1RBVEVNQUNISU5FJScsIHN0YXRlTWFjaGluZS5zdGF0ZU1hY2hpbmVBcm4pO1xuICB0ZW1wbGF0ZVN0ciA9IHRlbXBsYXRlU3RyLnJlcGxhY2UoJyVJTkNMVURFX0hFQURFUlMlJywgU3RyaW5nKGluY2x1ZGVIZWFkZXIpKTtcbiAgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0ci5yZXBsYWNlKCclSU5DTFVERV9RVUVSWVNUUklORyUnLCBTdHJpbmcoaW5jbHVkZVF1ZXJ5U3RyaW5nKSk7XG4gIHRlbXBsYXRlU3RyID0gdGVtcGxhdGVTdHIucmVwbGFjZSgnJUlOQ0xVREVfUEFUSCUnLCBTdHJpbmcoaW5jbHVkZVBhdGgpKTtcbiAgdGVtcGxhdGVTdHIgPSB0ZW1wbGF0ZVN0ci5yZXBsYWNlKCclSU5DTFVERV9BVVRIT1JJWkVSJScsIFN0cmluZyhpbmNsdWRlQXV0aG9yaXplcikpO1xuICB0ZW1wbGF0ZVN0ciA9IHRlbXBsYXRlU3RyLnJlcGxhY2UoJyVSRVFVRVNUQ09OVEVYVCUnLCByZXF1ZXN0Q29udGV4dFN0cik7XG5cbiAgcmV0dXJuIHRlbXBsYXRlU3RyO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0Q29udGV4dChyZXF1ZXN0Q29udGV4dE9iajogUmVxdWVzdENvbnRleHQgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBjb25zdCBjb250ZXh0ID0ge1xuICAgIGFjY291bnRJZDogcmVxdWVzdENvbnRleHRPYmo/LmFjY291bnRJZD8gJyRjb250ZXh0LmlkZW50aXR5LmFjY291bnRJZCc6IHVuZGVmaW5lZCxcbiAgICBhcGlJZDogcmVxdWVzdENvbnRleHRPYmo/LmFwaUlkPyAnJGNvbnRleHQuYXBpSWQnOiB1bmRlZmluZWQsXG4gICAgYXBpS2V5OiByZXF1ZXN0Q29udGV4dE9iaj8uYXBpS2V5PyAnJGNvbnRleHQuaWRlbnRpdHkuYXBpS2V5JzogdW5kZWZpbmVkLFxuICAgIGF1dGhvcml6ZXJQcmluY2lwYWxJZDogcmVxdWVzdENvbnRleHRPYmo/LmF1dGhvcml6ZXJQcmluY2lwYWxJZD8gJyRjb250ZXh0LmF1dGhvcml6ZXIucHJpbmNpcGFsSWQnOiB1bmRlZmluZWQsXG4gICAgY2FsbGVyOiByZXF1ZXN0Q29udGV4dE9iaj8uY2FsbGVyPyAnJGNvbnRleHQuaWRlbnRpdHkuY2FsbGVyJzogdW5kZWZpbmVkLFxuICAgIGNvZ25pdG9BdXRoZW50aWNhdGlvblByb3ZpZGVyOiByZXF1ZXN0Q29udGV4dE9iaj8uY29nbml0b0F1dGhlbnRpY2F0aW9uUHJvdmlkZXI/ICckY29udGV4dC5pZGVudGl0eS5jb2duaXRvQXV0aGVudGljYXRpb25Qcm92aWRlcic6IHVuZGVmaW5lZCxcbiAgICBjb2duaXRvQXV0aGVudGljYXRpb25UeXBlOiByZXF1ZXN0Q29udGV4dE9iaj8uY29nbml0b0F1dGhlbnRpY2F0aW9uVHlwZT8gJyRjb250ZXh0LmlkZW50aXR5LmNvZ25pdG9BdXRoZW50aWNhdGlvblR5cGUnOiB1bmRlZmluZWQsXG4gICAgY29nbml0b0lkZW50aXR5SWQ6IHJlcXVlc3RDb250ZXh0T2JqPy5jb2duaXRvSWRlbnRpdHlJZD8gJyRjb250ZXh0LmlkZW50aXR5LmNvZ25pdG9JZGVudGl0eUlkJzogdW5kZWZpbmVkLFxuICAgIGNvZ25pdG9JZGVudGl0eVBvb2xJZDogcmVxdWVzdENvbnRleHRPYmo/LmNvZ25pdG9JZGVudGl0eVBvb2xJZD8gJyRjb250ZXh0LmlkZW50aXR5LmNvZ25pdG9JZGVudGl0eVBvb2xJZCc6IHVuZGVmaW5lZCxcbiAgICBodHRwTWV0aG9kOiByZXF1ZXN0Q29udGV4dE9iaj8uaHR0cE1ldGhvZD8gJyRjb250ZXh0Lmh0dHBNZXRob2QnOiB1bmRlZmluZWQsXG4gICAgc3RhZ2U6IHJlcXVlc3RDb250ZXh0T2JqPy5zdGFnZT8gJyRjb250ZXh0LnN0YWdlJzogdW5kZWZpbmVkLFxuICAgIHNvdXJjZUlwOiByZXF1ZXN0Q29udGV4dE9iaj8uc291cmNlSXA/ICckY29udGV4dC5pZGVudGl0eS5zb3VyY2VJcCc6IHVuZGVmaW5lZCxcbiAgICB1c2VyOiByZXF1ZXN0Q29udGV4dE9iaj8udXNlcj8gJyRjb250ZXh0LmlkZW50aXR5LnVzZXInOiB1bmRlZmluZWQsXG4gICAgdXNlckFnZW50OiByZXF1ZXN0Q29udGV4dE9iaj8udXNlckFnZW50PyAnJGNvbnRleHQuaWRlbnRpdHkudXNlckFnZW50JzogdW5kZWZpbmVkLFxuICAgIHVzZXJBcm46IHJlcXVlc3RDb250ZXh0T2JqPy51c2VyQXJuPyAnJGNvbnRleHQuaWRlbnRpdHkudXNlckFybic6IHVuZGVmaW5lZCxcbiAgICByZXF1ZXN0SWQ6IHJlcXVlc3RDb250ZXh0T2JqPy5yZXF1ZXN0SWQ/ICckY29udGV4dC5yZXF1ZXN0SWQnOiB1bmRlZmluZWQsXG4gICAgcmVzb3VyY2VJZDogcmVxdWVzdENvbnRleHRPYmo/LnJlc291cmNlSWQ/ICckY29udGV4dC5yZXNvdXJjZUlkJzogdW5kZWZpbmVkLFxuICAgIHJlc291cmNlUGF0aDogcmVxdWVzdENvbnRleHRPYmo/LnJlc291cmNlUGF0aD8gJyRjb250ZXh0LnJlc291cmNlUGF0aCc6IHVuZGVmaW5lZCxcbiAgfTtcblxuICBjb25zdCBjb250ZXh0QXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShjb250ZXh0KTtcblxuICAvLyBUaGUgVlRMIFRlbXBsYXRlIGNvbmZsaWN0cyB3aXRoIGRvdWJsZS1xdW90ZXMgKFwiKSBmb3Igc3RyaW5ncy5cbiAgLy8gQmVmb3JlIHNlbmRpbmcgdG8gdGhlIHRlbXBsYXRlLCB3ZSByZXBsYWNlIGRvdWJsZS1xdW90ZXMgKFwiKSB3aXRoIEBAIGFuZCByZXBsYWNlIGl0IGJhY2sgaW5zaWRlIHRoZSAudnRsIGZpbGVcbiAgY29uc3QgZG91YmxlcXVvdGVzID0gJ1wiJztcbiAgY29uc3QgcmVwbGFjZVdpdGggPSAnQEAnO1xuICByZXR1cm4gY29udGV4dEFzU3RyaW5nLnNwbGl0KGRvdWJsZXF1b3Rlcykuam9pbihyZXBsYWNlV2l0aCk7XG59XG5cbi8qKlxuICogTWV0aG9kIHJlc3BvbnNlIG1vZGVsIGZvciBlYWNoIEhUVFAgY29kZSByZXNwb25zZVxuICovXG5jb25zdCBNRVRIT0RfUkVTUE9OU0VTID0gW1xuICB7XG4gICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgcmVzcG9uc2VNb2RlbHM6IHtcbiAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogTW9kZWwuRU1QVFlfTU9ERUwsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHN0YXR1c0NvZGU6ICc0MDAnLFxuICAgIHJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAnYXBwbGljYXRpb24vanNvbic6IE1vZGVsLkVSUk9SX01PREVMLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICByZXNwb25zZU1vZGVsczoge1xuICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBNb2RlbC5FUlJPUl9NT0RFTCxcbiAgICB9LFxuICB9LFxuXTtcbiJdfQ==