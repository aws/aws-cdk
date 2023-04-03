"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const sns_generated_1 = require("./sns.generated");
const topic_base_1 = require("./topic-base");
/**
 * A new SNS topic
 */
class Topic extends topic_base_1.TopicBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.topicName,
        });
        this.autoCreatePolicy = true;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_sns_TopicProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Topic);
            }
            throw error;
        }
        if (props.contentBasedDeduplication && !props.fifo) {
            throw new Error('Content based deduplication can only be enabled for FIFO SNS topics.');
        }
        let cfnTopicName;
        if (props.fifo && props.topicName && !props.topicName.endsWith('.fifo')) {
            cfnTopicName = this.physicalName + '.fifo';
        }
        else if (props.fifo && !props.topicName) {
            // Max lenght allowed by CloudFormation is 256, we subtract 5 to allow for ".fifo" suffix
            const prefixName = core_1.Names.uniqueResourceName(this, {
                maxLength: 256 - 5,
                separator: '-',
            });
            cfnTopicName = `${prefixName}.fifo`;
        }
        else {
            cfnTopicName = this.physicalName;
        }
        const resource = new sns_generated_1.CfnTopic(this, 'Resource', {
            displayName: props.displayName,
            topicName: cfnTopicName,
            kmsMasterKeyId: props.masterKey && props.masterKey.keyArn,
            contentBasedDeduplication: props.contentBasedDeduplication,
            fifoTopic: props.fifo,
        });
        this.topicArn = this.getResourceArnAttribute(resource.ref, {
            service: 'sns',
            resource: this.physicalName,
        });
        this.topicName = this.getResourceNameAttribute(resource.attrTopicName);
        this.fifo = props.fifo || false;
    }
    /**
     * Import an existing SNS topic provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param topicArn topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic)
     */
    static fromTopicArn(scope, id, topicArn) {
        class Import extends topic_base_1.TopicBase {
            constructor() {
                super(...arguments);
                this.topicArn = topicArn;
                this.topicName = core_1.Stack.of(scope).splitArn(topicArn, core_1.ArnFormat.NO_RESOURCE_NAME).resource;
                this.fifo = this.topicName.endsWith('.fifo');
                this.autoCreatePolicy = false;
            }
        }
        return new Import(scope, id);
    }
}
exports.Topic = Topic;
_a = JSII_RTTI_SYMBOL_1;
Topic[_a] = { fqn: "@aws-cdk/aws-sns.Topic", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9waWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b3BpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBd0Q7QUFFeEQsbURBQTJDO0FBQzNDLDZDQUFpRDtBQThDakQ7O0dBRUc7QUFDSCxNQUFhLEtBQU0sU0FBUSxzQkFBUztJQTBCbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFvQixFQUFFO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztRQUxjLHFCQUFnQixHQUFZLElBQUksQ0FBQzs7Ozs7OytDQXhCekMsS0FBSzs7OztRQStCZCxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsSUFBSSxZQUFvQixDQUFDO1FBQ3pCLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkUsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDO1NBQzVDO2FBQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUN6Qyx5RkFBeUY7WUFDekYsTUFBTSxVQUFVLEdBQUcsWUFBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtnQkFDaEQsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDO2dCQUNsQixTQUFTLEVBQUUsR0FBRzthQUNmLENBQUMsQ0FBQztZQUNILFlBQVksR0FBRyxHQUFHLFVBQVUsT0FBTyxDQUFDO1NBQ3JDO2FBQU07WUFDTCxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUNsQztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksd0JBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixTQUFTLEVBQUUsWUFBWTtZQUN2QixjQUFjLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDekQseUJBQXlCLEVBQUUsS0FBSyxDQUFDLHlCQUF5QjtZQUMxRCxTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUN6RCxPQUFPLEVBQUUsS0FBSztZQUNkLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUM1QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQztLQUNqQztJQTdERDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQWdCO1FBQ3ZFLE1BQU0sTUFBTyxTQUFRLHNCQUFTO1lBQTlCOztnQkFDa0IsYUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDcEIsY0FBUyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUNwRixTQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztZQUM5QyxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7QUFsQkgsc0JBZ0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUtleSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBOYW1lcywgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuVG9waWMgfSBmcm9tICcuL3Nucy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVRvcGljLCBUb3BpY0Jhc2UgfSBmcm9tICcuL3RvcGljLWJhc2UnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IFNOUyB0b3BpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFRvcGljUHJvcHMge1xuICAvKipcbiAgICogQSBkZXZlbG9wZXItZGVmaW5lZCBzdHJpbmcgdGhhdCBjYW4gYmUgdXNlZCB0byBpZGVudGlmeSB0aGlzIFNOUyB0b3BpYy5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzcGxheU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgbmFtZSBmb3IgdGhlIHRvcGljLlxuICAgKlxuICAgKiBJZiB5b3UgZG9uJ3Qgc3BlY2lmeSBhIG5hbWUsIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZXMgYSB1bmlxdWVcbiAgICogcGh5c2ljYWwgSUQgYW5kIHVzZXMgdGhhdCBJRCBmb3IgdGhlIHRvcGljIG5hbWUuIEZvciBtb3JlIGluZm9ybWF0aW9uLFxuICAgKiBzZWUgTmFtZSBUeXBlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBHZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgdG9waWNOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIEtNUyBLZXksIGVpdGhlciBtYW5hZ2VkIGJ5IHRoaXMgQ0RLIGFwcCwgb3IgaW1wb3J0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IG1hc3RlcktleT86IElLZXk7XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgY29udGVudC1iYXNlZCBkZWR1cGxpY2F0aW9uIGZvciBGSUZPIHRvcGljcy5cbiAgICpcbiAgICogQGRlZmF1bHQgTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudEJhc2VkRGVkdXBsaWNhdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHRvIGNyZWF0ZSBhIEZJRk8gdG9waWMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGZpZm8/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgbmV3IFNOUyB0b3BpY1xuICovXG5leHBvcnQgY2xhc3MgVG9waWMgZXh0ZW5kcyBUb3BpY0Jhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgU05TIHRvcGljIHByb3ZpZGVkIGFuIEFSTlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lXG4gICAqIEBwYXJhbSB0b3BpY0FybiB0b3BpYyBBUk4gKGkuZS4gYXJuOmF3czpzbnM6dXMtZWFzdC0yOjQ0NDQ1NTU1NjY2NjpNeVRvcGljKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVG9waWNBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgdG9waWNBcm46IHN0cmluZyk6IElUb3BpYyB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgVG9waWNCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSB0b3BpY0FybiA9IHRvcGljQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHRvcGljTmFtZSA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybih0b3BpY0FybiwgQXJuRm9ybWF0Lk5PX1JFU09VUkNFX05BTUUpLnJlc291cmNlO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGZpZm8gPSB0aGlzLnRvcGljTmFtZS5lbmRzV2l0aCgnLmZpZm8nKTtcbiAgICAgIHByb3RlY3RlZCBhdXRvQ3JlYXRlUG9saWN5OiBib29sZWFuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSB0b3BpY0Fybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdG9waWNOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBmaWZvOiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBhdXRvQ3JlYXRlUG9saWN5OiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVG9waWNQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnRvcGljTmFtZSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5jb250ZW50QmFzZWREZWR1cGxpY2F0aW9uICYmICFwcm9wcy5maWZvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRlbnQgYmFzZWQgZGVkdXBsaWNhdGlvbiBjYW4gb25seSBiZSBlbmFibGVkIGZvciBGSUZPIFNOUyB0b3BpY3MuJyk7XG4gICAgfVxuXG4gICAgbGV0IGNmblRvcGljTmFtZTogc3RyaW5nO1xuICAgIGlmIChwcm9wcy5maWZvICYmIHByb3BzLnRvcGljTmFtZSAmJiAhcHJvcHMudG9waWNOYW1lLmVuZHNXaXRoKCcuZmlmbycpKSB7XG4gICAgICBjZm5Ub3BpY05hbWUgPSB0aGlzLnBoeXNpY2FsTmFtZSArICcuZmlmbyc7XG4gICAgfSBlbHNlIGlmIChwcm9wcy5maWZvICYmICFwcm9wcy50b3BpY05hbWUpIHtcbiAgICAgIC8vIE1heCBsZW5naHQgYWxsb3dlZCBieSBDbG91ZEZvcm1hdGlvbiBpcyAyNTYsIHdlIHN1YnRyYWN0IDUgdG8gYWxsb3cgZm9yIFwiLmZpZm9cIiBzdWZmaXhcbiAgICAgIGNvbnN0IHByZWZpeE5hbWUgPSBOYW1lcy51bmlxdWVSZXNvdXJjZU5hbWUodGhpcywge1xuICAgICAgICBtYXhMZW5ndGg6IDI1NiAtIDUsXG4gICAgICAgIHNlcGFyYXRvcjogJy0nLFxuICAgICAgfSk7XG4gICAgICBjZm5Ub3BpY05hbWUgPSBgJHtwcmVmaXhOYW1lfS5maWZvYDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2ZuVG9waWNOYW1lID0gdGhpcy5waHlzaWNhbE5hbWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuVG9waWModGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZGlzcGxheU5hbWU6IHByb3BzLmRpc3BsYXlOYW1lLFxuICAgICAgdG9waWNOYW1lOiBjZm5Ub3BpY05hbWUsXG4gICAgICBrbXNNYXN0ZXJLZXlJZDogcHJvcHMubWFzdGVyS2V5ICYmIHByb3BzLm1hc3RlcktleS5rZXlBcm4sXG4gICAgICBjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uOiBwcm9wcy5jb250ZW50QmFzZWREZWR1cGxpY2F0aW9uLFxuICAgICAgZmlmb1RvcGljOiBwcm9wcy5maWZvLFxuICAgIH0pO1xuXG4gICAgdGhpcy50b3BpY0FybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UucmVmLCB7XG4gICAgICBzZXJ2aWNlOiAnc25zJyxcbiAgICAgIHJlc291cmNlOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLnRvcGljTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLmF0dHJUb3BpY05hbWUpO1xuICAgIHRoaXMuZmlmbyA9IHByb3BzLmZpZm8gfHwgZmFsc2U7XG4gIH1cbn1cbiJdfQ==