import { KeyAttributeType } from './constants';
import { KeyAttributesProps } from './slo';

/**
 * Class representing Application Signals key attributes with validation
 */
export class KeyAttributes {
    private readonly props: KeyAttributesProps;

    constructor(props: KeyAttributesProps) {
        this.validateProps(props);
        this.props = props;
    }

    private validateProps(props: KeyAttributesProps) {
        if (!props.name && !props.environment && !props.type) {
            throw new Error('name or type or environment is required for Application Signals service');
        }
    }

    public bind(): { [key: string]: string } {
        return {
            Type: this.props.type,
            Name: this.props.name,
            Environment: this.props.environment,
            ...(this.props.identifier && { Identifier: this.props.identifier }),
        };
    }

    /**
     * Creates key attributes for an AWS service
     */
    public static awsService(props: Omit<KeyAttributesProps, 'type'>): KeyAttributes {
        return new KeyAttributes({
            type: KeyAttributeType.AWS_SERVICE,
            ...props,
        });
    }

    /**
     * Creates key attributes for a custom service
     */
    public static service(props: Omit<KeyAttributesProps, 'type'>): KeyAttributes {
        return new KeyAttributes({
            type: KeyAttributeType.SERVICE,
            ...props,
        });
    }

    /**
     * Creates key attributes for a remote service
     */
    public static remoteService(props: Omit<KeyAttributesProps, 'type'>): KeyAttributes {
        return new KeyAttributes({
            type: KeyAttributeType.REMOTE_SERVICE,
            ...props,
        });
    }
}
