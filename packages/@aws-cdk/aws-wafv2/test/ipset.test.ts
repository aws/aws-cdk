import { expect } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as waf from '../lib';

test('IPV4 IP Set', () => {
    const stack = new cdk.Stack();
    new waf.IpSet(stack, 'IpSet', {
        addresses: [
            '192.168.1.1'
        ],
        scope: waf.IpSetScope.CLOUDFRONT,
        ipAddressVersion: waf.IpAddressVersion.IPV4
    });

    expect(stack).toMatch({
        Resources: {
            IPSetEBDDFDAE: {
                Type: "AWS::WAFv2::IPSet",
                Properties: {
                    Addresses: {
                        IPAddresses: ["192.168.1.1"]
                    },
                    IPAddressVersion: "IPV4",
                    Scope: "CLOUDFRONT"
                }
            }
        }
    });
});

test('IPV6 IP Set', () => {
    const stack = new cdk.Stack();
    new waf.IpSet(stack, 'IpSet', {
        addresses: [
            '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
        ],
        scope: waf.IpSetScope.CLOUDFRONT,
        ipAddressVersion: waf.IpAddressVersion.IPV6
    });

    expect(stack).toMatch({
        Resources: {
            IPSetEBDDFDAE: {
                Type: "AWS::WAFv2::IPSet",
                Properties: {
                    Addresses: {
                        IPAddresses: [
                            "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
                        ]
                    },
                    IPAddressVersion: "IPV6",
                    Scope: "CLOUDFRONT"
                }
            }
        }
    });
});

test('addAddresses method with name and description', () => {
    const stack = new cdk.Stack();

    const ipSet = new waf.IpSet(stack, 'IpSet', {
        scope: waf.IpSetScope.CLOUDFRONT,
        ipAddressVersion: waf.IpAddressVersion.IPV6,
        name: 'MyIpSet',
        description: 'MyIpSet Description'
    });

    ipSet.addAddresses('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

    expect(stack).toMatch({
        Resources: {
            IPSetEBDDFDAE: {
                Type: "AWS::WAFv2::IPSet",
                Properties: {
                    Addresses: {
                        IPAddresses: [
                            "2001:0db8:85a3:0000:0000:8a2e:0370:7334"
                        ]
                    },
                    IPAddressVersion: "IPV6",
                    Scope: "CLOUDFRONT",
                    Name: "MyIpSet",
                    Description: "MyIPSet Description"
                }
            }
        }
    });
});