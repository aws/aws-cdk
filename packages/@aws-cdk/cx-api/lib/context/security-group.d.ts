/**
 * Properties of a discovered SecurityGroup.
 */
export interface SecurityGroupContextResponse {
    /**
     * The security group's id.
     */
    readonly securityGroupId: string;
    /**
     * Whether the security group allows all outbound traffic. This will be true
     * when the security group has all-protocol egress permissions to access both
     * `0.0.0.0/0` and `::/0`.
     */
    readonly allowAllOutbound: boolean;
}
