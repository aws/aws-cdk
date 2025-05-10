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
        if (!props.type) {
            throw new Error('Type is required for Application Signals service');
        }

        if ([KeyAttributeType.SERVICE, KeyAttributeType.REMOTE_SERVICE, KeyAttributeType.AWS_SERVICE].includes(props.type)) {
            if (!props.name || !props.environment) {
                throw new Error('Name and Environment are required for Service types');
            }
        }

        if ([KeyAttributeType.RESOURCE, KeyAttributeType.AWS_RESOURCE].includes(props.type)) {
            if (props.name) {
                throw new Error('Name is not allowed for Resource types');
            }
            if (props.resourceType === undefined) {
                throw new Error('ResourceType is required for Resource types');
            }
        }
    }


    public bind(): { [key: string]: string } {
        const attributes: { [key: string]: string } = {
            Type: this.props.type,
            Name: this.props.name,
            Environment: this.props.environment,
        };

        if (this.props.resourceType) {
            attributes.ResourceType = this.props.resourceType;
        }

        if (this.props.identifier) {
            attributes.Identifier = this.props.identifier;
        }

        return attributes;
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

    /**
     * Creates key attributes for a resource
     */
    public static resource(props: Omit<KeyAttributesProps, 'type'>): KeyAttributes {
        return new KeyAttributes({
            type: KeyAttributeType.RESOURCE,
            ...props,
        });
    }

    /**
     * Creates key attributes for an AWS resource
     */
    public static awsResource(props: Omit<KeyAttributesProps, 'type'>): KeyAttributes {
        return new KeyAttributes({
            type: KeyAttributeType.AWS_RESOURCE,
            ...props,
        });
    }
}
