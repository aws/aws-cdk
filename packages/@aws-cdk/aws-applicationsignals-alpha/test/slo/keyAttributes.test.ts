import { KeyAttributes } from '../../lib/slo/keyAttributes';
import { KeyAttributeType } from '../../lib/slo/constants';
import { KeyAttributesProps } from "../../lib";

describe('KeyAttributes', () => {
    describe('constructor validation', () => {
        test('throws error when type is missing', () => {
            expect(() => {
                new KeyAttributes({} as KeyAttributesProps);
            }).toThrow('Type is required for Application Signals service');
        });

        describe('Service type validation', () => {
            const serviceTypes = [
                KeyAttributeType.SERVICE,
                KeyAttributeType.REMOTE_SERVICE,
                KeyAttributeType.AWS_SERVICE,
            ];

            serviceTypes.forEach(type => {
                test(`requires name and environment for ${type}`, () => {
                    expect(() => {
                        new KeyAttributes({
                            type,
                            name: undefined,
                            environment: undefined
                        } as any);
                    }).toThrow('Name and Environment are required for Service types');

                    expect(() => {
                        new KeyAttributes({
                            type,
                            name: 'test',
                            environment: undefined
                        } as any);
                    }).toThrow('Name and Environment are required for Service types');

                    expect(() => {
                        new KeyAttributes({
                            type,
                            name: undefined,
                            environment: 'prod'
                        } as any);
                    }).toThrow('Name and Environment are required for Service types');
                });

                test(`accepts valid configuration for ${type}`, () => {
                    const props: KeyAttributesProps = {
                        type,
                        name: 'test',
                        environment: 'prod'
                    };
                    expect(() => {
                        new KeyAttributes(props);
                    }).not.toThrow();
                });
            });
        });

        describe('Resource type validation', () => {
            const resourceTypes = [
                KeyAttributeType.RESOURCE,
                KeyAttributeType.AWS_RESOURCE,
            ];

            resourceTypes.forEach(type => {
                test(`validates ${type} requirements`, () => {
                    expect(() => {
                        new KeyAttributes({
                            type,
                            name: 'test',
                            resourceType: 'someResource',
                            environment: 'prod'
                        } as any);
                    }).toThrow('Name is not allowed for Resource types');

                    expect(() => {
                        new KeyAttributes({
                            type,
                            resourceType: undefined
                        } as any);
                    }).toThrow('ResourceType is required for Resource types');
                });

                test(`accepts valid configuration for ${type}`, () => {
                    const props = {
                        type,
                        resourceType: 'someResource'
                    } as KeyAttributesProps;
                    expect(() => {
                        new KeyAttributes(props);
                    }).not.toThrow();
                });
            });
        });
    });

    describe('bind method', () => {
        test('returns correct attributes for service type', () => {
            const keyAttributes = new KeyAttributes({
                type: KeyAttributeType.SERVICE,
                name: 'testService',
                environment: 'beta'
            });
            expect(keyAttributes.bind()).toEqual({
                Type: KeyAttributeType.SERVICE,
                Name: 'testService',
                Environment: 'beta'
            });
        });

        test('returns correct attributes for resource type', () => {
            const keyAttributes = new KeyAttributes({
                type: KeyAttributeType.RESOURCE,
                resourceType: 'database'
            } as KeyAttributesProps);
            expect(keyAttributes.bind()).toEqual({
                Type: KeyAttributeType.RESOURCE,
                ResourceType: 'database'
            });
        });
    });

    describe('static factory methods', () => {
        test('service creates correct configuration', () => {
            const keyAttributes = KeyAttributes.service({
                name: 'testService',
                environment: 'production'
            });
            expect(keyAttributes.bind()).toEqual({
                Type: KeyAttributeType.SERVICE,
                Name: 'testService',
                Environment: 'production'
            });
        });
    });
});
