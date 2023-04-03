import { IWidget } from './widget';
/**
 * A widget that contains other widgets in a horizontal row
 *
 * Widgets will be laid out next to each other
 */
export declare class Row implements IWidget {
    /**
     * Same as width, but writable inside class methods
     */
    private _width;
    /**
     * Same as height, but writable inside class methods
     */
    private _height;
    /**
     * List of contained widgets
     */
    readonly widgets: IWidget[];
    /**
     * Relative position of each widget inside this row
     */
    private readonly offsets;
    constructor(...widgets: IWidget[]);
    get width(): number;
    get height(): number;
    private updateDimensions;
    /**
     * Add the widget to this container
     */
    addWidget(w: IWidget): void;
    position(x: number, y: number): void;
    toJson(): any[];
}
/**
 * A widget that contains other widgets in a vertical column
 *
 * Widgets will be laid out next to each other
 */
export declare class Column implements IWidget {
    /**
     * Same as width, but writable inside class methods
     */
    private _width;
    /**
     * Same as height, but writable inside class methods
     */
    private _height;
    /**
     * List of contained widgets
     */
    readonly widgets: IWidget[];
    constructor(...widgets: IWidget[]);
    get width(): number;
    get height(): number;
    /**
     * Add the widget to this container
     */
    addWidget(w: IWidget): void;
    position(x: number, y: number): void;
    toJson(): any[];
}
/**
 * Props of the spacer
 */
export interface SpacerProps {
    /**
     * Width of the spacer
     *
     * @default 1
     */
    readonly width?: number;
    /**
     * Height of the spacer
     *
     * @default: 1
     */
    readonly height?: number;
}
/**
 * A widget that doesn't display anything but takes up space
 */
export declare class Spacer implements IWidget {
    readonly width: number;
    readonly height: number;
    constructor(props?: SpacerProps);
    position(_x: number, _y: number): void;
    toJson(): any[];
}
