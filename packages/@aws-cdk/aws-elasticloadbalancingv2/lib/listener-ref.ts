import cdk = require('@aws-cdk/cdk');
import { ListenerArn } from './elasticloadbalancingv2.generated';

/**
 * A listener
 */
export abstract class ListenerRef extends cdk.Construct {
    /**
     * Import an existing listener
     */
    public static import(parent: cdk.Construct, id: string, props: ListenerRefProps) {
        return new ImportedListener(parent, id, props);
    }

    /**
     * ARN of the listener
     */
    public abstract readonly listenerArn: ListenerArn;

    /**
     * Export this listener
     */
    public export(): ListenerRefProps {
        return {
            listenerArn: new ListenerArn(new cdk.Output(this, 'ListenerArn', { value: this.listenerArn }).makeImportValue())
        };
    }
}

/**
 * Properties to reference an existing listener
 */
export interface ListenerRefProps {
    /**
     * ARN of the listener
     */
    listenerArn: ListenerArn;
}

/**
 * An existing listener
 */
class ImportedListener extends ListenerRef {
    public readonly listenerArn: ListenerArn;
    constructor(parent: cdk.Construct, id: string, props: ListenerRefProps) {
        super(parent, id);

        this.listenerArn = props.listenerArn;
    }
}