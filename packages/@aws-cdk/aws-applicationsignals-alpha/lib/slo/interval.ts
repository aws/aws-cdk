import { CalendarIntervalProps, GoalConfig, IInterval, IntervalProps } from './slo';
import { DEFAULT_GOAL_CONFIG, DurationUnit } from './constants';

/**
 * Base class for Interval implementations
 */
export abstract class Interval implements IInterval {
    /**
     * Creates a calendar interval
     */
    public static calendar(props: CalendarIntervalProps): IInterval {
        return new CalendarInterval(props);
    }

    /**
     * Creates a rolling interval
     */
    public static rolling(props: IntervalProps): IInterval {
        return new RollingInterval(props);
    }

    abstract bind(): any;
}

/**
 * Implementation of Calendar Interval
 */
export class CalendarInterval extends Interval {
    /**
     * The duration value for the interval
     * Must be greater than 0
     *
     * @private
     */
    private readonly duration: number;

    /**
     * The unit of duration measurement
     * Can be MINUTE, HOUR, DAY, or MONTH
     *
     * @private
     */
    private readonly unit: DurationUnit;

    /**
     * The start time of the interval
     * Specified as Unix timestamp in milliseconds
     * Default starts from now
     *
     * @private
     */
    private readonly startTime: number;

    constructor(props: CalendarIntervalProps) {
        super();
        this.duration = props.duration;
        this.unit = props.unit;
        this.startTime = props.startTime?? Date.now();
        this.validate();
    }

    private validate() {
        if (this.duration <= 0) {
            throw new Error('Duration must be greater than 0');
        }

        if (this.unit === DurationUnit.MONTH && this.duration > 12) {
            throw new Error('Month duration cannot exceed 12');
        }

        if (this.unit === DurationUnit.DAY && this.duration > 31) {
            throw new Error('Day duration cannot exceed 31');
        }

        if (this.startTime <= 0) {
            throw new Error('Start time must be greater than 0');
        }
    }

    bind() {
        return {
            calendarInterval: {
                duration: this.duration,
                durationUnit: this.unit,
                startTime: this.startTime,
            },
        };
    }
}

/**
 * Implementation of Rolling Interval
 */
export class RollingInterval extends Interval {
    private readonly duration: number;
    private readonly unit: DurationUnit;

    constructor(props: IntervalProps) {
        super();
        this.duration = props.duration;
        this.unit = props.unit;
        this.validate();
    }

    private validate() {
        if (this.duration <= 0) {
            throw new Error('Duration must be greater than 0');
        }

        if (this.unit === DurationUnit.MONTH && this.duration > 12) {
            throw new Error('Month duration cannot exceed 12');
        }

        if (this.unit === DurationUnit.DAY && this.duration > 31) {
            throw new Error('Day duration cannot exceed 31');
        }
    }

    bind() {
        return {
            rollingInterval: {
                duration: this.duration,
                durationUnit: this.unit,
            },
        };
    }
}

/**
 * Implementation of goal configuration
 */
export class Goal {
    /**
     * Creates a new goal configuration
     */
    public static of(props: GoalConfig): Goal {
        return new Goal(props);
    }

    private constructor(private readonly props: GoalConfig) {}

    /**
     * Binds the goal configuration to L1 construct properties
     */
    public _bind(): applicationsignals.CfnServiceLevelObjective.GoalProperty {
        return {
            attainmentGoal: this.props.attainmentGoal ?? DEFAULT_GOAL_CONFIG.ATTAINMENT_GOAL,
            warningThreshold: this.props.warningThreshold ?? DEFAULT_GOAL_CONFIG.WARNING_THRESHOLD,
            interval: this.props.interval._bind(),
        };
    }
}
