"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJsAspect = exports.RuntimeAspect = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const custom_resources_1 = require("aws-cdk-lib/custom-resources");
const aws_ses_1 = require("aws-cdk-lib/aws-ses");
/**
 * Runtime aspect
 */
class RuntimeAspectsBase {
    constructor(runtime) {
        this.targetRuntime = runtime;
    }
    visit(construct) {
        //To handle custom providers
        if (construct instanceof cdk.CustomResourceProviderBase) {
            this.handleCustomResourceProvider(construct);
        }
        //To handle providers
        else if (construct instanceof custom_resources_1.Provider) {
            this.handleProvider(construct);
        }
        //To handle single Function case
        else if (construct instanceof aws_ses_1.ReceiptRuleSet) {
            this.handleReceiptRuleSet(construct);
        }
        //To handle AwsCustomResource
        else if (construct instanceof custom_resources_1.AwsCustomResource) {
            this.handleAwsCustomResource(construct);
        }
    }
    handleAwsCustomResource(node) {
        const providerNode = node.node.findChild('Provider');
        const functionNode = providerNode.stack.node.children.find((child) => child instanceof lambda.Function);
        const targetNode = functionNode?.node.children.find((child) => child instanceof lambda.CfnFunction);
        targetNode.runtime = this.targetRuntime;
    }
    handleCustomResourceProvider(provider) {
        const node = provider;
        // only replace for nodejs case
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
            // onEvent Handlers
            const onEventHandler = provider.onEventHandler;
            const onEventHandlerRuntime = this.getChildFunctionNode(onEventHandler);
            if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
                onEventHandlerRuntime.addPropertyOverride('Runtime', this.targetRuntime);
            }
            //isComplete Handlers
            // Handlers
            const isCompleteHandler = provider.isCompleteHandler;
            const isCompleteHandlerRuntime = this.getChildFunctionNode(isCompleteHandler);
            if (this.isValidRuntime(this.getRuntimeProperty(targetNode))) {
                isCompleteHandlerRuntime.addPropertyOverride('Runtime', 'nodejs20.x');
            }
        }
    }
    handleReceiptRuleSet(ruleSet) {
        const functionnode = ruleSet.node.findChild('DropSpam');
        const ses = functionnode.node.findChild('Function');
        if (ses.runtime && this.isValidRuntime(ses.runtime)) {
            ses.addPropertyOverride('Runtime', 'nodejs20.x');
        }
    }
    /**
   *Runtime Validation
   *
   */
    isValidRuntime(runtime) {
        const family = this.getRuntimeFamily(runtime);
        return family === lambda.RuntimeFamily.NODEJS;
    }
    getRuntimeProperty(node) {
        return (node.getResourceProperty('runtime') || node.getResourceProperty('Runtime'));
    }
    getChildFunctionNode(node) {
        const childNode = node.node.children.find((child) => cdk.CfnResource.isCfnResource(child) && child.cfnResourceType === 'AWS::Lambda::Function');
        return childNode;
    }
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
 * RuntimeAspect
 */
class RuntimeAspect extends RuntimeAspectsBase {
    constructor(key) {
        super(key);
    }
}
exports.RuntimeAspect = RuntimeAspect;
_a = JSII_RTTI_SYMBOL_1;
RuntimeAspect[_a] = { fqn: "@aws-cdk/aws-nodejs-aspect.RuntimeAspect", version: "0.0.0" };
class NodeJsAspect {
    static modifyRuntimeTo(key) {
        return new RuntimeAspect(key.name);
    }
}
exports.NodeJsAspect = NodeJsAspect;
_b = JSII_RTTI_SYMBOL_1;
NodeJsAspect[_b] = { fqn: "@aws-cdk/aws-nodejs-aspect.NodeJsAspect", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWpzLWFzcGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGVqcy1hc3BlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxtQ0FBbUM7QUFDbkMsaURBQWlEO0FBRWpELG1FQUEyRTtBQUMzRSxpREFBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFlLGtCQUFrQjtJQU8vQixZQUFZLE9BQWU7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7S0FDOUI7SUFFTSxLQUFLLENBQUMsU0FBcUI7UUFFaEMsNEJBQTRCO1FBQzVCLElBQUksU0FBUyxZQUFZLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0QscUJBQXFCO2FBQ2hCLElBQUksU0FBUyxZQUFZLDJCQUFRLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxnQ0FBZ0M7YUFDM0IsSUFBSSxTQUFTLFlBQVksd0JBQWMsRUFBRSxDQUFDO1lBQzdDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsNkJBQTZCO2FBQ3hCLElBQUksU0FBUyxZQUFZLG9DQUFpQixFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FFRjtJQUNPLHVCQUF1QixDQUFDLElBQTRDO1FBQzFFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBNkIsQ0FBQztRQUNqRixNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLFlBQVksTUFB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Q0FBQyxDQUFDO1FBQzlDLE9BQU8sTUFBTSxLQUFLLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0tBQy9DO0lBRU8sa0JBQWtCLENBQUMsSUFBcUI7UUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQVcsQ0FBQztLQUMvRjtJQUVPLG9CQUFvQixDQUFDLElBQWU7UUFDMUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsZUFBZSxLQUFLLHVCQUF1QixDQUFvQixDQUFDO1FBQ25LLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRU8sZ0JBQWdCLENBQUMsT0FBZTtRQUN0QyxRQUFRLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLEtBQUssWUFBWTtnQkFDZixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUMzQztnQkFDRSxPQUFPLGFBQWEsQ0FBQztRQUN6QixDQUFDO0tBQ0Y7Q0FFRjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxhQUFjLFNBQVEsa0JBQWtCO0lBQ25ELFlBQVksR0FBVztRQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDWjs7QUFISCxzQ0FJQzs7O0FBRUQsTUFBYSxZQUFZO0lBQ2hCLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBbUI7UUFDL0MsT0FBTyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEM7O0FBSEgsb0NBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBicmFjZS1zdHlsZSAqL1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgSUFzcGVjdCB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHsgQXdzQ3VzdG9tUmVzb3VyY2UsIFByb3ZpZGVyIH0gZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBSZWNlaXB0UnVsZVNldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZXMnO1xuXG4vKipcbiAqIFJ1bnRpbWUgYXNwZWN0XG4gKi9cbmFic3RyYWN0IGNsYXNzIFJ1bnRpbWVBc3BlY3RzQmFzZSBpbXBsZW1lbnRzIElBc3BlY3Qge1xuXG4gIC8qKlxuICAgKiBUaGUgc3RyaW5nIGtleSBmb3IgdGhlIHJ1bnRpbWVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRSdW50aW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocnVudGltZTogc3RyaW5nKSB7XG4gICAgdGhpcy50YXJnZXRSdW50aW1lID0gcnVudGltZTtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdChjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiB2b2lkIHtcblxuICAgIC8vVG8gaGFuZGxlIGN1c3RvbSBwcm92aWRlcnNcbiAgICBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgY2RrLkN1c3RvbVJlc291cmNlUHJvdmlkZXJCYXNlKSB7XG4gICAgICB0aGlzLmhhbmRsZUN1c3RvbVJlc291cmNlUHJvdmlkZXIoY29uc3RydWN0KTtcbiAgICB9XG4gICAgLy9UbyBoYW5kbGUgcHJvdmlkZXJzXG4gICAgZWxzZSBpZiAoY29uc3RydWN0IGluc3RhbmNlb2YgUHJvdmlkZXIpIHtcbiAgICAgIHRoaXMuaGFuZGxlUHJvdmlkZXIoY29uc3RydWN0KTtcbiAgICB9XG5cbiAgICAvL1RvIGhhbmRsZSBzaW5nbGUgRnVuY3Rpb24gY2FzZVxuICAgIGVsc2UgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIFJlY2VpcHRSdWxlU2V0KSB7XG4gICAgICB0aGlzLmhhbmRsZVJlY2VpcHRSdWxlU2V0KGNvbnN0cnVjdCk7XG4gICAgfVxuXG4gICAgLy9UbyBoYW5kbGUgQXdzQ3VzdG9tUmVzb3VyY2VcbiAgICBlbHNlIGlmIChjb25zdHJ1Y3QgaW5zdGFuY2VvZiBBd3NDdXN0b21SZXNvdXJjZSkge1xuICAgICAgdGhpcy5oYW5kbGVBd3NDdXN0b21SZXNvdXJjZShjb25zdHJ1Y3QpO1xuICAgIH1cblxuICB9XG4gIHByaXZhdGUgaGFuZGxlQXdzQ3VzdG9tUmVzb3VyY2Uobm9kZTogY2RrLmN1c3RvbV9yZXNvdXJjZXMuQXdzQ3VzdG9tUmVzb3VyY2UpIHtcbiAgICBjb25zdCBwcm92aWRlck5vZGUgPSBub2RlLm5vZGUuZmluZENoaWxkKCdQcm92aWRlcicpIGFzIGxhbWJkYS5TaW5nbGV0b25GdW5jdGlvbjtcbiAgICBjb25zdCBmdW5jdGlvbk5vZGUgPSBwcm92aWRlck5vZGUuc3RhY2subm9kZS5jaGlsZHJlbi5maW5kKChjaGlsZCkgPT4gY2hpbGQgaW5zdGFuY2VvZiBsYW1iZGEuRnVuY3Rpb24pO1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBmdW5jdGlvbk5vZGU/Lm5vZGUuY2hpbGRyZW4uZmluZCgoY2hpbGQpID0+IGNoaWxkIGluc3RhbmNlb2YgbGFtYmRhLkNmbkZ1bmN0aW9uKSBhcyBsYW1iZGEuQ2ZuRnVuY3Rpb247XG4gICAgdGFyZ2V0Tm9kZS5ydW50aW1lID0gdGhpcy50YXJnZXRSdW50aW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDdXN0b21SZXNvdXJjZVByb3ZpZGVyKHByb3ZpZGVyOiBjZGsuQ3VzdG9tUmVzb3VyY2VQcm92aWRlckJhc2UpOiB2b2lkIHtcbiAgICBjb25zdCBub2RlID0gcHJvdmlkZXIgYXMgY2RrLkN1c3RvbVJlc291cmNlUHJvdmlkZXJCYXNlO1xuICAgIC8vIG9ubHkgcmVwbGFjZSBmb3Igbm9kZWpzIGNhc2VcbiAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZShub2RlLnJ1bnRpbWUpKSB7XG4gICAgICBjb25zdCB0YXJnZXRub2RlID0gdGhpcy5nZXRDaGlsZEZ1bmN0aW9uTm9kZShub2RlKTtcbiAgICAgIHRhcmdldG5vZGUuYWRkUHJvcGVydHlPdmVycmlkZSgnUnVudGltZScsIHRoaXMudGFyZ2V0UnVudGltZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVQcm92aWRlcihwcm92aWRlcjogUHJvdmlkZXIpOiB2b2lkIHtcbiAgICBjb25zdCBmdW5jdGlvbk5vZGVzID0gcHJvdmlkZXIubm9kZS5jaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZCBpbnN0YW5jZW9mIGxhbWJkYS5GdW5jdGlvbik7XG4gICAgZm9yICggdmFyIG5vZGUgb2YgZnVuY3Rpb25Ob2Rlcykge1xuICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IHRoaXMuZ2V0Q2hpbGRGdW5jdGlvbk5vZGUobm9kZSk7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZSh0aGlzLmdldFJ1bnRpbWVQcm9wZXJ0eSh0YXJnZXROb2RlKSkpIHtcbiAgICAgICAgdGFyZ2V0Tm9kZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdSdW50aW1lJywgdGhpcy50YXJnZXRSdW50aW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gb25FdmVudCBIYW5kbGVyc1xuICAgICAgY29uc3Qgb25FdmVudEhhbmRsZXIgPSBwcm92aWRlci5vbkV2ZW50SGFuZGxlciBhcyBsYW1iZGEuRnVuY3Rpb247XG4gICAgICBjb25zdCBvbkV2ZW50SGFuZGxlclJ1bnRpbWUgPSB0aGlzLmdldENoaWxkRnVuY3Rpb25Ob2RlKG9uRXZlbnRIYW5kbGVyKTtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWRSdW50aW1lKHRoaXMuZ2V0UnVudGltZVByb3BlcnR5KHRhcmdldE5vZGUpKSkge1xuICAgICAgICBvbkV2ZW50SGFuZGxlclJ1bnRpbWUuYWRkUHJvcGVydHlPdmVycmlkZSgnUnVudGltZScsIHRoaXMudGFyZ2V0UnVudGltZSk7XG4gICAgICB9XG5cbiAgICAgIC8vaXNDb21wbGV0ZSBIYW5kbGVyc1xuICAgICAgLy8gSGFuZGxlcnNcbiAgICAgIGNvbnN0IGlzQ29tcGxldGVIYW5kbGVyID0gcHJvdmlkZXIuaXNDb21wbGV0ZUhhbmRsZXIgYXMgbGFtYmRhLkZ1bmN0aW9uO1xuICAgICAgY29uc3QgaXNDb21wbGV0ZUhhbmRsZXJSdW50aW1lID0gdGhpcy5nZXRDaGlsZEZ1bmN0aW9uTm9kZShpc0NvbXBsZXRlSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkUnVudGltZSh0aGlzLmdldFJ1bnRpbWVQcm9wZXJ0eSh0YXJnZXROb2RlKSkpIHtcbiAgICAgICAgaXNDb21wbGV0ZUhhbmRsZXJSdW50aW1lLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1J1bnRpbWUnLCAnbm9kZWpzMjAueCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlUmVjZWlwdFJ1bGVTZXQocnVsZVNldDogUmVjZWlwdFJ1bGVTZXQpOiB2b2lkIHtcbiAgICBjb25zdCBmdW5jdGlvbm5vZGUgPSBydWxlU2V0Lm5vZGUuZmluZENoaWxkKCdEcm9wU3BhbScpO1xuICAgIGNvbnN0IHNlcyA9IGZ1bmN0aW9ubm9kZS5ub2RlLmZpbmRDaGlsZCgnRnVuY3Rpb24nKSBhcyBsYW1iZGEuQ2ZuRnVuY3Rpb247XG4gICAgaWYgKHNlcy5ydW50aW1lICYmIHRoaXMuaXNWYWxpZFJ1bnRpbWUoc2VzLnJ1bnRpbWUpKSB7XG4gICAgICBzZXMuYWRkUHJvcGVydHlPdmVycmlkZSgnUnVudGltZScsICdub2RlanMyMC54Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gKlJ1bnRpbWUgVmFsaWRhdGlvblxuICpcbiAqL1xuICBwcml2YXRlIGlzVmFsaWRSdW50aW1lKHJ1bnRpbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGZhbWlseSA9IHRoaXMuZ2V0UnVudGltZUZhbWlseShydW50aW1lKTtcbiAgICByZXR1cm4gZmFtaWx5ID09PSBsYW1iZGEuUnVudGltZUZhbWlseS5OT0RFSlM7XG4gIH1cblxuICBwcml2YXRlIGdldFJ1bnRpbWVQcm9wZXJ0eShub2RlOiBjZGsuQ2ZuUmVzb3VyY2UpIHtcbiAgICByZXR1cm4gKG5vZGUuZ2V0UmVzb3VyY2VQcm9wZXJ0eSgncnVudGltZScpIHx8IG5vZGUuZ2V0UmVzb3VyY2VQcm9wZXJ0eSgnUnVudGltZScpKSBhcyBzdHJpbmc7XG4gIH1cblxuICBwcml2YXRlIGdldENoaWxkRnVuY3Rpb25Ob2RlKG5vZGU6IENvbnN0cnVjdCkgOiBjZGsuQ2ZuUmVzb3VyY2Uge1xuICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5vZGUubm9kZS5jaGlsZHJlbi5maW5kKChjaGlsZCkgPT4gY2RrLkNmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoY2hpbGQpICYmIGNoaWxkLmNmblJlc291cmNlVHlwZSA9PT0gJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicpIGFzIGNkay5DZm5SZXNvdXJjZTtcbiAgICByZXR1cm4gY2hpbGROb2RlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSdW50aW1lRmFtaWx5KHJ1bnRpbWU6IHN0cmluZykge1xuICAgIHN3aXRjaCAocnVudGltZSkge1xuICAgICAgY2FzZSAnbm9kZWpzMTgueCc6XG4gICAgICAgIHJldHVybiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWC5mYW1pbHk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ1Vuc3VwcG9ydGVkJztcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIFJ1bnRpbWVBc3BlY3RcbiAqL1xuZXhwb3J0IGNsYXNzIFJ1bnRpbWVBc3BlY3QgZXh0ZW5kcyBSdW50aW1lQXNwZWN0c0Jhc2Uge1xuICBjb25zdHJ1Y3RvcihrZXk6IHN0cmluZykge1xuICAgIHN1cGVyKGtleSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVKc0FzcGVjdCB7XG4gIHB1YmxpYyBzdGF0aWMgbW9kaWZ5UnVudGltZVRvKGtleTogbGFtYmRhLlJ1bnRpbWUpIHtcbiAgICByZXR1cm4gbmV3IFJ1bnRpbWVBc3BlY3Qoa2V5Lm5hbWUpO1xuICB9XG59XG5cbiJdfQ==