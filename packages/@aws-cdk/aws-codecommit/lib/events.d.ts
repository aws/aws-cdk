/**
 * Fields of CloudWatch Events that change references
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#codebuild_event_type
 */
export declare class ReferenceEvent {
    /**
     * The type of reference event
     *
     * 'referenceCreated', 'referenceUpdated' or 'referenceDeleted'
     */
    static get eventType(): string;
    /**
     * Name of the CodeCommit repository
     */
    static get repositoryName(): string;
    /**
     * Id of the CodeCommit repository
     */
    static get repositoryId(): string;
    /**
     * Type of reference changed
     *
     * 'branch' or 'tag'
     */
    static get referenceType(): string;
    /**
     * Name of reference changed (branch or tag name)
     */
    static get referenceName(): string;
    /**
     * Full reference name
     *
     * For example, 'refs/tags/myTag'
     */
    static get referenceFullName(): string;
    /**
     * Commit id this reference now points to
     */
    static get commitId(): string;
    private constructor();
}
