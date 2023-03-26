import { IMetric } from './metric-types';
/**
 * The width of the grid we're filling
 */
export declare const GRID_WIDTH = 24;
/**
 * A single dashboard widget
 */
export interface IWidget {
    /**
     * The amount of horizontal grid units the widget will take up
     */
    readonly width: number;
    /**
     * The amount of vertical grid units the widget will take up
     */
    readonly height: number;
    /**
     * Any warnings that are produced as a result of putting together this widget
     */
    readonly warnings?: string[];
    /**
     * Place the widget at a given position
     */
    position(x: number, y: number): void;
    /**
     * Return the widget JSON for use in the dashboard
     */
    toJson(): any[];
}
/**
 * A real CloudWatch widget that has its own fixed size and remembers its position
 *
 * This is in contrast to other widgets which exist for layout purposes.
 */
export declare abstract class ConcreteWidget implements IWidget {
    readonly width: number;
    readonly height: number;
    protected x?: number;
    protected y?: number;
    readonly warnings: string[] | undefined;
    constructor(width: number, height: number);
    position(x: number, y: number): void;
    abstract toJson(): any[];
    /**
     * Copy the warnings from the given metric
     */
    protected copyMetricWarnings(...ms: IMetric[]): void;
}
