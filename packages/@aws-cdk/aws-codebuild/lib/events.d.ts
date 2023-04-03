/**
 * Event fields for the CodeBuild "state change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
export declare class StateChangeEvent {
    /**
     * The triggering build's status
     */
    static get buildStatus(): string;
    /**
     * The triggering build's project name
     */
    static get projectName(): string;
    /**
     * Return the build id
     */
    static get buildId(): string;
    static get currentPhase(): string;
    private constructor();
}
/**
 * Event fields for the CodeBuild "phase change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
export declare class PhaseChangeEvent {
    /**
     * The triggering build's project name
     */
    static get projectName(): string;
    /**
     * The triggering build's id
     */
    static get buildId(): string;
    /**
     * The phase that was just completed
     */
    static get completedPhase(): string;
    /**
     * The status of the completed phase
     */
    static get completedPhaseStatus(): string;
    /**
     * The duration of the completed phase
     */
    static get completedPhaseDurationSeconds(): string;
    /**
     * Whether the build is complete
     */
    static get buildComplete(): string;
    private constructor();
}
