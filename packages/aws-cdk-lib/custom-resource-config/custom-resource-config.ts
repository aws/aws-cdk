import { IConstruct, MetadataEntry } from 'constructs';
import { CfnResource, IAspect, Aspects } from '../core/lib';
import * as logs from '../aws-logs';
import * as lambda from '../aws-lambda';

/**
 * Manages AWS vended Resources
 */
export class CustomResourceConfig {
    /**
     * Returns the tags API for this scope.
     * @param scope The scope
     */
    public static of(scope: IConstruct): CustomResourceConfig {
        return new CustomResourceConfig(scope);
    }

    private constructor(private readonly scope: IConstruct) { }

    /**
     * Add log retention to custom resources that have CDK metadata.
     */
    public addLogRetentionLifetime(rentention: logs.RetentionDays) {
        Aspects.of(this.scope).add(new AspectCustomResourceLogRetention(rentention))
    }

}

export class AspectCustomResourceLogRetention implements IAspect {
    readonly SET_LOG_RETENTION: logs.RetentionDays;

    constructor(setLogRetention: logs.RetentionDays) {
        if (setLogRetention == undefined) {
            throw new Error('Retention must have a value');
        }

        this.SET_LOG_RETENTION = setLogRetention;
    }
    visit(node: IConstruct) {
        for (const metaEntry of node.node.metadata as MetadataEntry[]) {
            // console.log("this is ", this.SET_LOG_RETENTION);
            if (metaEntry.type == 'aws:cdk:is-custom-resource-handler-logGroup') {
                console.log("Found a marked logGroup", node.node.path); //
                const localNode = node.node.defaultChild as logs.CfnLogGroup;
                // console.log("Modifying logGroup to RetentionInDays"); //
                localNode.addPropertyOverride("RetentionInDays", this.SET_LOG_RETENTION);
            }
            if (metaEntry.type == 'aws:cdk:is-custom-resource-handler-singleton') {
                // console.log("Found SingletonLambda")
                const localNode = node.node.defaultChild as lambda.CfnFunction;

                if (localNode && !localNode.loggingConfig) {
                    // console.log('Lambda has no Logging Configured');
                    localNode.addPropertyOverride("LoggingConfig", {
                        LogGroup: this.createLogGroup(localNode)
                    })
                    // console.log('Configuring a new Logging');
                }
            }
            if (node instanceof CfnResource && node.cfnResourceType === "Custom::LogRetention") {
                // console.log("Found Custom::LogRetention"); //
                // console.log("Modifying the RetentionInDays"); //
                node.addPropertyOverride("RetentionInDays", this.SET_LOG_RETENTION);
            }
        }
    }

    createLogGroup(scope: lambda.CfnFunction): string {
        return new logs.LogGroup(scope, 'logGroup', {
            retention: this.SET_LOG_RETENTION
        }).logGroupName
    }
}