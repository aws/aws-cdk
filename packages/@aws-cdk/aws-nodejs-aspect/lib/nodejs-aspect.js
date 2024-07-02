"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeAspect = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
const aws_ses_1 = require("aws-cdk-lib/aws-ses");
/**
 * Runtime aspect base class to walk through a given construct tree and modify runtime to the provided input value.
 */
class RuntimeAspectBase {
    constructor(runtime) {
        this.targetRuntime = runtime;
    }
    /**
     * Below visit method changes runtime value of custom resource lambda functions.
     * For more details on how aspects work https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.Aspects.html
     */
    visit(construct) {
        //To handle custom providers
        if (construct instanceof cdk.CustomResourceProviderBase) {
            this.handleCustomResourceProvider(construct);
        }
        //To handle providers
        else if (construct instanceof custom_resources_1.Provider) {
            this.handleProvider(construct);
        }
        //To handle SES custom resource lambda
        else if (construct instanceof aws_ses_1.ReceiptRuleSet) {
            this.handleReceiptRuleSet(construct);
        }
        //To handle AwsCustomResource
        else if (construct instanceof custom_resources_1.AwsCustomResource) {
            this.handleAwsCustomResource(construct);
        }
    }
    handleAwsCustomResource(resource) {
        const providerNode = resource.node.findChild('Provider');
        const functionNode = providerNode.stack.node.children.find((child) => child instanceof lambda.Function);
        const targetNode = functionNode?.node.children.find((child) => child instanceof lambda.CfnFunction);
        targetNode.runtime = this.targetRuntime;
    }
    handleCustomResourceProvider(provider) {
        const node = provider;
        // Validates before modifying whether the runtime belongs to nodejs family
        if (this.isValidRuntime(node.runtime)) {
            const targetnode = this.getChildFunctionNode(node);
            targetnode.addPropertyOverride('Runtime', this.targetRuntime);
        }
    }
    handleProvider(provider) {
        const functionNodes = provider.node.children.filter((child) => child instanceof lambda.Function);
        for (var node of functionNodes) {
            const targetNode = this.getChildFunctionNode(node);
            if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
                targetNode.addPropertyOverride('Runtime', this.targetRuntime);
            }
            // onEvent Handler
            const onEventHandler = provider.onEventHandler;
            const onEventHandlerRuntime = this.getChildFunctionNode(onEventHandler);
            if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
                onEventHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
            }
            //isComplete Handler
            const isCompleteHandler = provider.isCompleteHandler;
            const isCompleteHandlerRuntime = this.getChildFunctionNode(isCompleteHandler);
            if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
                isCompleteHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
            }
        }
    }
    handleReceiptRuleSet(ruleSet) {
        const functionnode = ruleSet.node.findChild('DropSpam');
        const ses = functionnode.node.findChild('Function');
        if (ses.runtime && this.isValidRuntime(ses.runtime)) {
            ses.addPropertyOverride('Runtime', this.targetRuntime);
        }
    }
    /**
    * Validates whether runtime belongs to correct familty i.e. NodeJS
    */
    isValidRuntime(runtime) {
        const family = this.getRuntimeFamily(runtime);
        return family === lambda.RuntimeFamily.NODEJS;
    }
    /**
     * @param node
     * @returns Runtime name of a given node.
     */
    getRuntimeProperty(node) {
        return (node.getResourceProperty('runtime') || node.getResourceProperty('Runtime'));
    }
    /**
     *
     * @param node
     * @returns Child lambda function node
     */
    getChildFunctionNode(node) {
        const childNode = node.node.children.find((child) => cdk.CfnResource.isCfnResource(child) && child.cfnResourceType === 'AWS::Lambda::Function');
        return childNode;
    }
    /**
     *
     * @param runtime
     * @returns Runtime family for a given input runtime name eg. nodejs18.x
     */
    getRuntimeFamily(runtime) {
        switch (runtime) {
            case 'nodejs18.x':
                return lambda.Runtime.NODEJS_18_X.family;
            default:
                return 'Unsupported';
        }
    }
}
/**
 * RuntimeAspect class to Update lambda Runtime for a given construct tree, currently supports only nodejs20.x
 */
class RuntimeAspect extends RuntimeAspectBase {
    /**
     * Updates lambda Runtime value to nodejs20.x
     */
    static nodejs20() {
        return new RuntimeAspect(lambda.Runtime.NODEJS_20_X.name);
    }
    constructor(runtime) {
        super(runtime);
    }
}
exports.RuntimeAspect = RuntimeAspect;
_a = JSII_RTTI_SYMBOL_1;
RuntimeAspect[_a] = { fqn: "@aws-cdk/aws-nodejs-aspect.RuntimeAspect", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWFzcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVqcy1hc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBRWpELG1FQUEyRTtBQUMzRSxpREFBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFlLGlCQUFpQjtJQU85QixZQUFZLE9BQWU7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7S0FDOUI7SUFFRDs7O09BR0c7SUFFSSxLQUFLLENBQUMsU0FBcUI7UUFFaEMsNEJBQTRCO1FBQzVCLElBQUksU0FBUyxZQUFZLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0QscUJBQXFCO2FBQ2hCLElBQUksU0FBUyxZQUFZLDJCQUFRLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxzQ0FBc0M7YUFDakMsSUFBSSxTQUFTLFlBQVksd0JBQWMsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsNkJBQTZCO2FBQ3hCLElBQUksU0FBUyxZQUFZLG9DQUFpQixFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FFRjtJQUVPLHVCQUF1QixDQUFDLFFBQWdEO1FBQzlFLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBNkIsQ0FBQztRQUNyRixNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxL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cnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBJQXNwZWN0IH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgUHJvdmlkZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IFJlY2VpcHRSdWxlU2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNlcyc7XG5cbi8qKlxuICogUnVudGltZSBhc3BlY3QgYmFzZSBjbGFzcyB0byB3YWxrIHRocm91Z2ggYSBnaXZlbiBjb25zdHJ1Y3QgdHJlZSBhbmQgbW9kaWZ5IHJ1bnRpbWUgdG8gdGhlIHByb3ZpZGVkIGlucHV0IHZhbHVlLlxuICovXG5hYnN0cmFjdCBjbGFzcyBSdW50aW1lQXNwZWN0QmFzZSBpbXBsZW1lbnRzIElBc3BlY3Qge1xuXG4gIC8qKlxuICAgKiBUaGUgcnVudGltZSB0aGF0IHRoZSBhc3BlY3Qgd2lsbCB0YXJnZXQgZm9yIHVwZGF0ZXMgd2hpbGUgd2Fsa2luZyB0aGUgY29uc3RydWN0IHRyZWUuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHRhcmdldFJ1bnRpbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihydW50aW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnRhcmdldFJ1bnRpbWUgPSBydW50aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlbG93IHZpc2l0IG1ldGhvZCBjaGFuZ2VzIHJ1bnRpbWUgdmFsdWUgb2YgY3VzdG9tIHJlc291cmNlIGxhbWJkYSBmdW5jdGlvbnMuXG4gICAqIEZvciBtb3JlIGRldGFpbHMgb24gaG93IGFzcGVjdHMgd29yayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92Mi9kb2NzL2F3cy1jZGstbGliLkFzcGVjdHMuaHRtbFxuICAgKi9cblxuICBwdWJsaWMgdmlzaXQoY29uc3RydWN0OiBJQ29uc3RydWN0KTogdm9pZCB7XG5cbiAgICAvL1RvIGhhbmRsZSBjdXN0b20gcHJvdmlkZXJzXG4gICAgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIGNkay5DdXN0b21SZXNvdXJjZVByb3ZpZGVyQmFzZSkge1xuICAgICAgdGhpcy5oYW5kbGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyKGNvbnN0cnVjdCk7XG4gICAgfVxuICAgIC8vVG8gaGFuZGxlIHByb3ZpZGVyc1xuICAgIGVsc2UgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIFByb3ZpZGVyKSB7XG4gICAgICB0aGlzLmhhbmRsZVByb3ZpZGVyKGNvbnN0cnVjdCk7XG4gICAgfVxuXG4gICAgLy9UbyBoYW5kbGUgU0VTIGN1c3RvbSByZXNvdXJjZSBsYW1iZGFcbiAgICBlbHNlIGlmIChjb25zdHJ1Y3QgaW5zdGFuY2VvZiBSZWNlaXB0UnVsZVNldCkge1xuICAgICAgdGhpcy5oYW5kbGVSZWNlaXB0UnVsZVNldChjb25zdHJ1Y3QpO1xuICAgIH1cblxuICAgIC8vVG8gaGFuZGxlIEF3c0N1c3RvbVJlc291cmNlXG4gICAgZWxzZSBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgQXdzQ3VzdG9tUmVzb3VyY2UpIHtcbiAgICAgIHRoaXMuaGFuZGxlQXdzQ3VzdG9tUmVzb3VyY2UoY29uc3RydWN0KTtcbiAgICB9XG5cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQXdzQ3VzdG9tUmVzb3VyY2UocmVzb3VyY2U6IGNkay5jdXN0b21fcmVzb3VyY2VzLkF3c0N1c3RvbVJlc291cmNlKSB7XG4gICAgY29uc3QgcHJvdmlkZXJOb2RlID0gcmVzb3VyY2Uubm9kZS5maW5kQ2hpbGQoJ1Byb3ZpZGVyJykgYXMgbGFtYmRhLlNpbmdsZXRvbkZ1bmN0aW9uO1xuICAgIGNvbnN0IGZ1bmN0aW9uTm9kZSA9IHByb3ZpZGVyTm9kZS5zdGFjay5ub2RlLmNoaWxkcmVuLmZpbmQoKGNoaWxkKSA9PiBjaGlsZCBpbnN0YW5jZW9mIGxhbWJkYS5GdW5jdGlvbik7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGZ1bmN0aW9uTm9kZT8ubm9kZS5jaGlsZHJlbi5maW5kKChjaGlsZCkgPT4gY2hpbGQgaW5zdGFuY2VvZiBsYW1iZGEuQ2ZuRnVuY3Rpb24pIGFzIGxhbWJkYS5DZm5GdW5jdGlvbjtcbiAgICB0YXJnZXROb2RlLnJ1bnRpbWUgPSB0aGlzLnRhcmdldFJ1bnRpbWU7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUN1c3RvbVJlc291cmNlUHJvdmlkZXIocHJvdmlkZXI6IGNkay5DdXN0b21SZXNvdXJjZVByb3ZpZGVyQmFzZSk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSBwcm92aWRlciBhcyBjZGsuQ3VzdG9tUmVzb3VyY2VQcm92aWRlckJhc2U7XG4gICAgLy8gVmFsaWRhdGVzIGJlZm9yZSBtb2RpZnlpbmcgd2hldGhlciB0aGUgcnVudGltZSBiZWxvbmdzIHRvIG5vZGVqcyBmYW1pbHlcbiAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZShub2RlLnJ1bnRpbWUpKSB7XG4gICAgICBjb25zdCB0YXJnZXRub2RlID0gdGhpcy5nZXRDaGlsZEZ1bmN0aW9uTm9kZShub2RlKTtcbiAgICAgIHRhcmdldG5vZGUuYWRkUHJvcGVydHlPdmVycmlkZSgnUnVudGltZScsIHRoaXMudGFyZ2V0UnVudGltZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVQcm92aWRlcihwcm92aWRlcjogUHJvdmlkZXIpOiB2b2lkIHtcbiAgICBjb25zdCBmdW5jdGlvbk5vZGVzID0gcHJvdmlkZXIubm9kZS5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZCBpbnN0YW5jZW9mIGxhbWJkYS5GdW5jdGlvbik7XG4gICAgZm9yICggdmFyIG5vZGUgb2YgZnVuY3Rpb25Ob2Rlcykge1xuICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHRoaXMuZ2V0Q2hpbGRGdW5jdGlvbk5vZGUobm9kZSk7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZSh0aGlzLmdldFJ1bnRpbWVQcm9wZXJ0eSh0YXJnZXROb2RlKSkpIHtcbiAgICAgICAgdGFyZ2V0Tm9kZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdSdW50aW1lJywgdGhpcy50YXJnZXRSdW50aW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gb25FdmVudCBIYW5kbGVyXG4gICAgICBjb25zdCBvbkV2ZW50SGFuZGxlciA9IHByb3ZpZGVyLm9uRXZlbnRIYW5kbGVyIGFzIGxhbWJkYS5GdW5jdGlvbjtcbiAgICAgIGNvbnN0IG9uRXZlbnRIYW5kbGVyUnVudGltZSA9IHRoaXMuZ2V0Q2hpbGRGdW5jdGlvbk5vZGUob25FdmVudEhhbmRsZXIpO1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZFJ1bnRpbWUodGhpcy5nZXRSdW50aW1lUHJvcGVydHkodGFyZ2V0Tm9kZSkpKSB7XG4gICAgICAgIG9uRXZlbnRIYW5kbGVyUnVudGltZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdSdW50aW1lJywgdGhpcy50YXJnZXRSdW50aW1lKTtcbiAgICAgIH1cblxuICAgICAgLy9pc0NvbXBsZXRlIEhhbmRsZXJcbiAgICAgIGNvbnN0IGlzQ29tcGxldGVIYW5kbGVyID0gcHJvdmlkZXIuaXNDb21wbGV0ZUhhbmRsZXIgYXMgbGFtYmRhLkZ1bmN0aW9uO1xuICAgICAgY29uc3QgaXNDb21wbGV0ZUhhbmRsZXJSdW50aW1lID0gdGhpcy5nZXRDaGlsZEZ1bmN0aW9uTm9kZShpc0NvbXBsZXRlSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZSh0aGlzLmdldFJ1bnRpbWVQcm9wZXJ0eSh0YXJnZXROb2RlKSkpIHtcbiAgICAgICAgaXNDb21wbGV0ZUhhbmRsZXJSdW50aW1lLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1J1bnRpbWUnLCB0aGlzLnRhcmdldFJ1bnRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlUmVjZWlwdFJ1bGVTZXQocnVsZVNldDogUmVjZWlwdFJ1bGVTZXQpOiB2b2lkIHtcbiAgICBjb25zdCBmdW5jdGlvbm5vZGUgPSBydWxlU2V0Lm5vZGUuZmluZENoaWxkKCdEcm9wU3BhbScpO1xuICAgIGNvbnN0IHNlcyA9IGZ1bmN0aW9ubm9kZS5ub2RlLmZpbmRDaGlsZCgnRnVuY3Rpb24nKSBhcyBsYW1iZGEuQ2ZuRnVuY3Rpb247XG4gICAgaWYgKHNlcy5ydW50aW1lICYmIHRoaXMuaXNWYWxpZFJ1bnRpbWUoc2VzLnJ1bnRpbWUpKSB7XG4gICAgICBzZXMuYWRkUHJvcGVydHlPdmVycmlkZSgnUnVudGltZScsIHRoaXMudGFyZ2V0UnVudGltZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogVmFsaWRhdGVzIHdoZXRoZXIgcnVudGltZSBiZWxvbmdzIHRvIGNvcnJlY3QgZmFtaWx0eSBpLmUuIE5vZGVKU1xuICAqL1xuICBwcml2YXRlIGlzVmFsaWRSdW50aW1lKHJ1bnRpbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGZhbWlseSA9IHRoaXMuZ2V0UnVudGltZUZhbWlseShydW50aW1lKTtcbiAgICByZXR1cm4gZmFtaWx5ID09PSBsYW1iZGEuUnVudGltZUZhbWlseS5OT0RFSlM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5vZGVcbiAgICogQHJldHVybnMgUnVudGltZSBuYW1lIG9mIGEgZ2l2ZW4gbm9kZS5cbiAgICovXG4gIHByaXZhdGUgZ2V0UnVudGltZVByb3BlcnR5KG5vZGU6IGNkay5DZm5SZXNvdXJjZSkge1xuICAgIHJldHVybiAobm9kZS5nZXRSZXNvdXJjZVByb3BlcnR5KCdydW50aW1lJykgfHwgbm9kZS5nZXRSZXNvdXJjZVByb3BlcnR5KCdSdW50aW1lJykpIGFzIHN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZVxuICAgKiBAcmV0dXJucyBDaGlsZCBsYW1iZGEgZnVuY3Rpb24gbm9kZVxuICAgKi9cblxuICBwcml2YXRlIGdldENoaWxkRnVuY3Rpb25Ob2RlKG5vZGU6IENvbnN0cnVjdCkgOiBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5vZGUubm9kZS5jaGlsZHJlbi5maW5kKChjaGlsZCkgPT4gY2RrLkNmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoY2hpbGQpICYmIGNoaWxkLmNmblJlc291cmNlVHlwZSA9PT0gJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpIGFzIGNkay5DZm5SZXNvdXJjZTtcbiAgICByZXR1cm4gY2hpbGROb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBydW50aW1lXG4gICAqIEByZXR1cm5zIFJ1bnRpbWUgZmFtaWx5IGZvciBhIGdpdmVuIGlucHV0IHJ1bnRpbWUgbmFtZSBlZy4gbm9kZWpzMTgueFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRSdW50aW1lRmFtaWx5KHJ1bnRpbWU6IHN0cmluZykge1xuICAgIHN3aXRjaCAocnVudGltZSkge1xuICAgICAgY2FzZSAnbm9kZWpzMTgueCc6XG4gICAgICAgIHJldHVybiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWC5mYW1pbHk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ1Vuc3VwcG9ydGVkJztcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIFJ1bnRpbWVBc3BlY3QgY2xhc3MgdG8gVXBkYXRlIGxhbWJkYSBSdW50aW1lIGZvciBhIGdpdmVuIGNvbnN0cnVjdCB0cmVlLCBjdXJyZW50bHkgc3VwcG9ydHMgb25seSBub2RlanMyMC54XG4gKi9cbmV4cG9ydCBjbGFzcyBSdW50aW1lQXNwZWN0IGV4dGVuZHMgUnVudGltZUFzcGVjdEJhc2Uge1xuXG4gIC8qKlxuICAgKiBVcGRhdGVzIGxhbWJkYSBSdW50aW1lIHZhbHVlIHRvIG5vZGVqczIwLnhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm9kZWpzMjAoKSB7XG4gICAgcmV0dXJuIG5ldyBSdW50aW1lQXNwZWN0KGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLm5hbWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocnVudGltZTogc3RyaW5nKSB7XG4gICAgc3VwZXIocnVudGltZSk7XG4gIH1cbn1cblxuIl19