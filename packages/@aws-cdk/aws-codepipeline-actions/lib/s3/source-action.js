"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3SourceAction = exports.S3Trigger = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const targets = require("@aws-cdk/aws-events-targets");
const core_1 = require("@aws-cdk/core");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * How should the S3 Action detect changes.
 * This is the type of the `S3SourceAction.trigger` property.
 */
var S3Trigger;
(function (S3Trigger) {
    /**
     * The Action will never detect changes -
     * the Pipeline it's part of will only begin a run when explicitly started.
     */
    S3Trigger["NONE"] = "None";
    /**
     * CodePipeline will poll S3 to detect changes.
     * This is the default method of detecting changes.
     */
    S3Trigger["POLL"] = "Poll";
    /**
     * CodePipeline will use CloudWatch Events to be notified of changes.
     * Note that the Bucket that the Action uses needs to be part of a CloudTrail Trail
     * for the events to be delivered.
     */
    S3Trigger["EVENTS"] = "Events";
})(S3Trigger = exports.S3Trigger || (exports.S3Trigger = {}));
/**
 * Source that is provided by a specific Amazon S3 object.
 *
 * Will trigger the pipeline as soon as the S3 object changes, but only if there is
 * a CloudTrail Trail in the account that captures the S3 event.
 */
class S3SourceAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.bucket,
            category: codepipeline.ActionCategory.SOURCE,
            provider: 'S3',
            artifactBounds: common_1.sourceArtifactBounds(),
            outputs: [props.output],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_S3SourceActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, S3SourceAction);
            }
            throw error;
        }
        if (props.bucketKey.length === 0) {
            throw new Error('Property bucketKey cannot be an empty string');
        }
        this.props = props;
    }
    /** The variables emitted by this action. */
    get variables() {
        return {
            versionId: this.variableExpression('VersionId'),
            eTag: this.variableExpression('ETag'),
        };
    }
    bound(_scope, stage, options) {
        if (this.props.trigger === S3Trigger.EVENTS) {
            const id = this.generateEventId(stage);
            this.props.bucket.onCloudTrailWriteObject(id, {
                target: new targets.CodePipeline(stage.pipeline),
                paths: [this.props.bucketKey],
                crossStackScope: stage.pipeline,
            });
        }
        // we need to read from the source bucket...
        this.props.bucket.grantRead(options.role, this.props.bucketKey);
        // ...and write to the Pipeline bucket
        options.bucket.grantWrite(options.role);
        return {
            configuration: {
                S3Bucket: this.props.bucket.bucketName,
                S3ObjectKey: this.props.bucketKey,
                PollForSourceChanges: this.props.trigger && this.props.trigger === S3Trigger.POLL,
            },
        };
    }
    generateEventId(stage) {
        let ret;
        const baseId = core_1.Names.nodeUniqueId(stage.pipeline.node) + 'SourceEventRule';
        if (core_1.Token.isUnresolved(this.props.bucketKey)) {
            // If bucketKey is a Token, don't include it in the ID.
            // Instead, use numbers to differentiate if multiple actions observe the same bucket
            let candidate = baseId;
            let counter = 0;
            while (this.props.bucket.node.tryFindChild(candidate) !== undefined) {
                counter += 1;
                candidate = baseId + counter;
            }
            ret = candidate;
        }
        else {
            // we can't use Tokens in construct IDs,
            // however, if bucketKey is not a Token,
            // we want it to differentiate between multiple actions
            // observing the same Bucket with different keys
            ret = baseId + this.props.bucketKey;
            if (this.props.bucket.node.tryFindChild(ret)) {
                // this means a duplicate path for the same bucket - error out
                throw new Error(`S3 source action with path '${this.props.bucketKey}' is already present in the pipeline for this source bucket`);
            }
        }
        return ret;
    }
}
exports.S3SourceAction = S3SourceAction;
_a = JSII_RTTI_SYMBOL_1;
S3SourceAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.S3SourceAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNvdXJjZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELHVEQUF1RDtBQUV2RCx3Q0FBNkM7QUFFN0Msc0NBQW1DO0FBQ25DLHNDQUFpRDtBQUVqRDs7O0dBR0c7QUFDSCxJQUFZLFNBbUJYO0FBbkJELFdBQVksU0FBUztJQUNuQjs7O09BR0c7SUFDSCwwQkFBYSxDQUFBO0lBRWI7OztPQUdHO0lBQ0gsMEJBQWEsQ0FBQTtJQUViOzs7O09BSUc7SUFDSCw4QkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBbkJXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBbUJwQjtBQWdERDs7Ozs7R0FLRztBQUNILE1BQWEsY0FBZSxTQUFRLGVBQU07SUFHeEMsWUFBWSxLQUEwQjtRQUNwQyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDdEIsUUFBUSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTTtZQUM1QyxRQUFRLEVBQUUsSUFBSTtZQUNkLGNBQWMsRUFBRSw2QkFBb0IsRUFBRTtZQUN0QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ3hCLENBQUMsQ0FBQzs7Ozs7OytDQVhNLGNBQWM7Ozs7UUFhdkIsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFRCw0Q0FBNEM7SUFDNUMsSUFBVyxTQUFTO1FBQ2xCLE9BQU87WUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztTQUN0QyxDQUFDO0tBQ0g7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxLQUEwQixFQUFFLE9BQXVDO1FBRXBHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLEVBQUUsRUFBRTtnQkFDNUMsTUFBTSxFQUFFLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUNoRCxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFDN0IsZUFBZSxFQUFFLEtBQUssQ0FBQyxRQUFnQzthQUN4RCxDQUFDLENBQUM7U0FDSjtRQUVELDRDQUE0QztRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWhFLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsT0FBTztZQUNMLGFBQWEsRUFBRTtnQkFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDdEMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztnQkFDakMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLElBQUk7YUFDbEY7U0FDRixDQUFDO0tBQ0g7SUFFTyxlQUFlLENBQUMsS0FBMEI7UUFDaEQsSUFBSSxHQUFXLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsWUFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLGlCQUFpQixDQUFDO1FBRTNFLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzVDLHVEQUF1RDtZQUN2RCxvRkFBb0Y7WUFDcEYsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUNuRSxPQUFPLElBQUksQ0FBQyxDQUFDO2dCQUNiLFNBQVMsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDO2FBQzlCO1lBQ0QsR0FBRyxHQUFHLFNBQVMsQ0FBQztTQUNqQjthQUFNO1lBQ0wsd0NBQXdDO1lBQ3hDLHdDQUF3QztZQUN4Qyx1REFBdUQ7WUFDdkQsZ0RBQWdEO1lBQ2hELEdBQUcsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM1Qyw4REFBOEQ7Z0JBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyw2REFBNkQsQ0FBQyxDQUFDO2FBQ25JO1NBQ0Y7UUFFRCxPQUFPLEdBQUcsQ0FBQztLQUNaOztBQWpGSCx3Q0FrRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMtdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgTmFtZXMsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2FjdGlvbic7XG5pbXBvcnQgeyBzb3VyY2VBcnRpZmFjdEJvdW5kcyB9IGZyb20gJy4uL2NvbW1vbic7XG5cbi8qKlxuICogSG93IHNob3VsZCB0aGUgUzMgQWN0aW9uIGRldGVjdCBjaGFuZ2VzLlxuICogVGhpcyBpcyB0aGUgdHlwZSBvZiB0aGUgYFMzU291cmNlQWN0aW9uLnRyaWdnZXJgIHByb3BlcnR5LlxuICovXG5leHBvcnQgZW51bSBTM1RyaWdnZXIge1xuICAvKipcbiAgICogVGhlIEFjdGlvbiB3aWxsIG5ldmVyIGRldGVjdCBjaGFuZ2VzIC1cbiAgICogdGhlIFBpcGVsaW5lIGl0J3MgcGFydCBvZiB3aWxsIG9ubHkgYmVnaW4gYSBydW4gd2hlbiBleHBsaWNpdGx5IHN0YXJ0ZWQuXG4gICAqL1xuICBOT05FID0gJ05vbmUnLFxuXG4gIC8qKlxuICAgKiBDb2RlUGlwZWxpbmUgd2lsbCBwb2xsIFMzIHRvIGRldGVjdCBjaGFuZ2VzLlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IG1ldGhvZCBvZiBkZXRlY3RpbmcgY2hhbmdlcy5cbiAgICovXG4gIFBPTEwgPSAnUG9sbCcsXG5cbiAgLyoqXG4gICAqIENvZGVQaXBlbGluZSB3aWxsIHVzZSBDbG91ZFdhdGNoIEV2ZW50cyB0byBiZSBub3RpZmllZCBvZiBjaGFuZ2VzLlxuICAgKiBOb3RlIHRoYXQgdGhlIEJ1Y2tldCB0aGF0IHRoZSBBY3Rpb24gdXNlcyBuZWVkcyB0byBiZSBwYXJ0IG9mIGEgQ2xvdWRUcmFpbCBUcmFpbFxuICAgKiBmb3IgdGhlIGV2ZW50cyB0byBiZSBkZWxpdmVyZWQuXG4gICAqL1xuICBFVkVOVFMgPSAnRXZlbnRzJyxcbn1cblxuLyoqXG4gKiBUaGUgQ29kZVBpcGVsaW5lIHZhcmlhYmxlcyBlbWl0dGVkIGJ5IHRoZSBTMyBzb3VyY2UgQWN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFMzU291cmNlVmFyaWFibGVzIHtcbiAgLyoqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBTMyB2ZXJzaW9uIG9mIHRoZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIGJ1aWxkLiAqL1xuICByZWFkb25seSB2ZXJzaW9uSWQ6IHN0cmluZztcblxuICAvKiogVGhlIGUtdGFnIG9mIHRoZSBTMyB2ZXJzaW9uIG9mIHRoZSBvYmplY3QgdGhhdCB0cmlnZ2VyZWQgdGhlIGJ1aWxkLiAqL1xuICByZWFkb25seSBlVGFnOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgb2YgdGhlIGBTM1NvdXJjZUFjdGlvbiBTMyBzb3VyY2UgQWN0aW9uYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTM1NvdXJjZUFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqXG4gICAqL1xuICByZWFkb25seSBvdXRwdXQ6IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICAvKipcbiAgICogVGhlIGtleSB3aXRoaW4gdGhlIFMzIGJ1Y2tldCB0aGF0IHN0b3JlcyB0aGUgc291cmNlIGNvZGUuXG4gICAqXG4gICAqIEBleGFtcGxlICdwYXRoL3RvL2ZpbGUuemlwJ1xuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0S2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEhvdyBzaG91bGQgQ29kZVBpcGVsaW5lIGRldGVjdCBzb3VyY2UgY2hhbmdlcyBmb3IgdGhpcyBBY3Rpb24uXG4gICAqIE5vdGUgdGhhdCBpZiB0aGlzIGlzIFMzVHJpZ2dlci5FVkVOVFMsIHlvdSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBpbmNsdWRlIHRoZSBzb3VyY2UgQnVja2V0IGluIGEgQ2xvdWRUcmFpbCBUcmFpbCxcbiAgICogYXMgb3RoZXJ3aXNlIHRoZSBDbG91ZFdhdGNoIEV2ZW50cyB3aWxsIG5vdCBiZSBlbWl0dGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTM1RyaWdnZXIuUE9MTFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9ldmVudHMvbG9nLXMzLWRhdGEtZXZlbnRzLmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHRyaWdnZXI/OiBTM1RyaWdnZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUzMgYnVja2V0IHRoYXQgc3RvcmVzIHRoZSBzb3VyY2UgY29kZS5cbiAgICpcbiAgICogSWYgeW91IGltcG9ydCBhbiBlbmNyeXB0ZWQgYnVja2V0IGluIHlvdXIgc3RhY2ssIHBsZWFzZSBzcGVjaWZ5XG4gICAqIHRoZSBlbmNyeXB0aW9uIGtleSBhdCBpbXBvcnQgdGltZSBieSB1c2luZyBgQnVja2V0LmZyb21CdWNrZXRBdHRyaWJ1dGVzKClgIG1ldGhvZC5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcbn1cblxuLyoqXG4gKiBTb3VyY2UgdGhhdCBpcyBwcm92aWRlZCBieSBhIHNwZWNpZmljIEFtYXpvbiBTMyBvYmplY3QuXG4gKlxuICogV2lsbCB0cmlnZ2VyIHRoZSBwaXBlbGluZSBhcyBzb29uIGFzIHRoZSBTMyBvYmplY3QgY2hhbmdlcywgYnV0IG9ubHkgaWYgdGhlcmUgaXNcbiAqIGEgQ2xvdWRUcmFpbCBUcmFpbCBpbiB0aGUgYWNjb3VudCB0aGF0IGNhcHR1cmVzIHRoZSBTMyBldmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFMzU291cmNlQWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwcm9wczogUzNTb3VyY2VBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUzNTb3VyY2VBY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgcmVzb3VyY2U6IHByb3BzLmJ1Y2tldCxcbiAgICAgIGNhdGVnb3J5OiBjb2RlcGlwZWxpbmUuQWN0aW9uQ2F0ZWdvcnkuU09VUkNFLFxuICAgICAgcHJvdmlkZXI6ICdTMycsXG4gICAgICBhcnRpZmFjdEJvdW5kczogc291cmNlQXJ0aWZhY3RCb3VuZHMoKSxcbiAgICAgIG91dHB1dHM6IFtwcm9wcy5vdXRwdXRdLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmJ1Y2tldEtleS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgYnVja2V0S2V5IGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICAvKiogVGhlIHZhcmlhYmxlcyBlbWl0dGVkIGJ5IHRoaXMgYWN0aW9uLiAqL1xuICBwdWJsaWMgZ2V0IHZhcmlhYmxlcygpOiBTM1NvdXJjZVZhcmlhYmxlcyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZlcnNpb25JZDogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ1ZlcnNpb25JZCcpLFxuICAgICAgZVRhZzogdGhpcy52YXJpYWJsZUV4cHJlc3Npb24oJ0VUYWcnKSxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGJvdW5kKF9zY29wZTogQ29uc3RydWN0LCBzdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgb3B0aW9uczogY29kZXBpcGVsaW5lLkFjdGlvbkJpbmRPcHRpb25zKTpcbiAgY29kZXBpcGVsaW5lLkFjdGlvbkNvbmZpZyB7XG4gICAgaWYgKHRoaXMucHJvcHMudHJpZ2dlciA9PT0gUzNUcmlnZ2VyLkVWRU5UUykge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLmdlbmVyYXRlRXZlbnRJZChzdGFnZSk7XG4gICAgICB0aGlzLnByb3BzLmJ1Y2tldC5vbkNsb3VkVHJhaWxXcml0ZU9iamVjdChpZCwge1xuICAgICAgICB0YXJnZXQ6IG5ldyB0YXJnZXRzLkNvZGVQaXBlbGluZShzdGFnZS5waXBlbGluZSksXG4gICAgICAgIHBhdGhzOiBbdGhpcy5wcm9wcy5idWNrZXRLZXldLFxuICAgICAgICBjcm9zc1N0YWNrU2NvcGU6IHN0YWdlLnBpcGVsaW5lIGFzIHVua25vd24gYXMgQ29uc3RydWN0LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gd2UgbmVlZCB0byByZWFkIGZyb20gdGhlIHNvdXJjZSBidWNrZXQuLi5cbiAgICB0aGlzLnByb3BzLmJ1Y2tldC5ncmFudFJlYWQob3B0aW9ucy5yb2xlLCB0aGlzLnByb3BzLmJ1Y2tldEtleSk7XG5cbiAgICAvLyAuLi5hbmQgd3JpdGUgdG8gdGhlIFBpcGVsaW5lIGJ1Y2tldFxuICAgIG9wdGlvbnMuYnVja2V0LmdyYW50V3JpdGUob3B0aW9ucy5yb2xlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFMzQnVja2V0OiB0aGlzLnByb3BzLmJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgICBTM09iamVjdEtleTogdGhpcy5wcm9wcy5idWNrZXRLZXksXG4gICAgICAgIFBvbGxGb3JTb3VyY2VDaGFuZ2VzOiB0aGlzLnByb3BzLnRyaWdnZXIgJiYgdGhpcy5wcm9wcy50cmlnZ2VyID09PSBTM1RyaWdnZXIuUE9MTCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVFdmVudElkKHN0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlKTogc3RyaW5nIHtcbiAgICBsZXQgcmV0OiBzdHJpbmc7XG4gICAgY29uc3QgYmFzZUlkID0gTmFtZXMubm9kZVVuaXF1ZUlkKHN0YWdlLnBpcGVsaW5lLm5vZGUpICsgJ1NvdXJjZUV2ZW50UnVsZSc7XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHRoaXMucHJvcHMuYnVja2V0S2V5KSkge1xuICAgICAgLy8gSWYgYnVja2V0S2V5IGlzIGEgVG9rZW4sIGRvbid0IGluY2x1ZGUgaXQgaW4gdGhlIElELlxuICAgICAgLy8gSW5zdGVhZCwgdXNlIG51bWJlcnMgdG8gZGlmZmVyZW50aWF0ZSBpZiBtdWx0aXBsZSBhY3Rpb25zIG9ic2VydmUgdGhlIHNhbWUgYnVja2V0XG4gICAgICBsZXQgY2FuZGlkYXRlID0gYmFzZUlkO1xuICAgICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgICAgd2hpbGUgKHRoaXMucHJvcHMuYnVja2V0Lm5vZGUudHJ5RmluZENoaWxkKGNhbmRpZGF0ZSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIGNhbmRpZGF0ZSA9IGJhc2VJZCArIGNvdW50ZXI7XG4gICAgICB9XG4gICAgICByZXQgPSBjYW5kaWRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdlIGNhbid0IHVzZSBUb2tlbnMgaW4gY29uc3RydWN0IElEcyxcbiAgICAgIC8vIGhvd2V2ZXIsIGlmIGJ1Y2tldEtleSBpcyBub3QgYSBUb2tlbixcbiAgICAgIC8vIHdlIHdhbnQgaXQgdG8gZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIG11bHRpcGxlIGFjdGlvbnNcbiAgICAgIC8vIG9ic2VydmluZyB0aGUgc2FtZSBCdWNrZXQgd2l0aCBkaWZmZXJlbnQga2V5c1xuICAgICAgcmV0ID0gYmFzZUlkICsgdGhpcy5wcm9wcy5idWNrZXRLZXk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5idWNrZXQubm9kZS50cnlGaW5kQ2hpbGQocmV0KSkge1xuICAgICAgICAvLyB0aGlzIG1lYW5zIGEgZHVwbGljYXRlIHBhdGggZm9yIHRoZSBzYW1lIGJ1Y2tldCAtIGVycm9yIG91dFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFMzIHNvdXJjZSBhY3Rpb24gd2l0aCBwYXRoICcke3RoaXMucHJvcHMuYnVja2V0S2V5fScgaXMgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBwaXBlbGluZSBmb3IgdGhpcyBzb3VyY2UgYnVja2V0YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuIl19