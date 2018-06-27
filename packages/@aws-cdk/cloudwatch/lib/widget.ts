/**
 * The width of the grid we're filling
 */
export const GRID_WIDTH = 24;

/**
 * A single dashboard widget
 */
export interface IWidget {
    /**
     * The width of the widget
     *
     * Will only ever be queried after 'determineSize' has been called.
     */
    readonly width: number;

    /**
     * The height of the widget
     *
     * Will only ever be queried after 'determineSize' has been called.
     */
    readonly height: number;

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
export abstract class ConcreteWidget implements IWidget {
    public readonly width: number;
    public readonly height: number;
    protected x?: number;
    protected y?: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        if (this.width > GRID_WIDTH) {
            throw new Error(`Widget is too wide, max ${GRID_WIDTH} units allowed`);
        }
    }

    public position(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public abstract toJson(): any[];
}