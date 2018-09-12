/**
 * An ECR life cycle rule
 */
export interface LifecycleRule {
    /**
     * Controls the order in which rules are evaluated (low to high)
     *
     *  When you add rules to a lifecycle policy, you must give them each a
     *  unique value for rulePriority. Values do not need to be sequential
     *  across rules in a policy. A rule with a tagStatus value of any must have
     *  the highest value for rulePriority and be evaluated last.
     */
    rulePriority: number;

    /**
     * Describes the purpose of the rule
     *
     * @default No description
     */
    description?: string;

    /**
     * Select images based on tags
     *
     * Only one rule is allowed to select untagged images, and it must
     * have the highest rulePriority.
     *
     * @default TagStatus.Any
     */
    tagStatus?: TagStatus;

    /**
     * Select images that have ALL the given prefixes in their tag.
     *
     * Only if tagStatus == TagStatus.Any
     */
    tagPrefixList?: string[];

    /**
     * Specify limit type to apply to the repository
     */
    countType: CountType;

    /**
     * The unit of specifying the count
     *
     * Only applies when countType = CountType.SinceImagePushed.
     *
     * @default CountUnit.Days
     */
    countUnit?: CountUnit;

    /**
     * The number of images or days, according to countType
     */
    countNumber: number;

    /**
     * The action to take
     *
     * @default Action.expire
     */
    action?: Action;
}

/**
 * Select images based on tags
 */
export enum TagStatus {
    /**
     * Rule applies to all images
     */
    Any = 'any',

    /**
     * Rule applies to tagged images
     */
    Tagged = 'tagged',

    /**
     * Rule applies to untagged images
     */
    Untagged = 'untagged',
}

/**
 * Select images based on counts
 */
export enum CountType {
    /**
     * Set a limit on the number of images in your repository
     */
    ImageCountMoreThan = 'imageCountMoreThan',

    /**
     * Set an age limit on the images in your repository
     */
    SinceImagePushed = 'sinceImagePushed',
}

/**
 * The unit to count time in
 */
export enum CountUnit {
    /**
     * countNumber is in days
     */
    Days = 'days',

    /**
     * Do not use this value
     *
     * It is here to work around issues with the JSII type checker that
     * occur when an enum only has one member.
     */
    _ = '_',
}

/**
 * Action to take on the image
 */
export enum Action {
    /**
     * The image is expired
     */
    Expire = 'expire',

    /**
     * Do not use this value
     *
     * It is here to work around issues with the JSII type checker that
     * occur when an enum only has one member.
     */
    _ = '_',
}
