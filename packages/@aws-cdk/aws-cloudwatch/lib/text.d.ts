import { ConcreteWidget } from './widget';
/**
 * Background types available
 */
export declare enum TextWidgetBackground {
    /**
     * Solid background
     */
    SOLID = "solid",
    /**
    * Transparent background
    */
    TRANSPARENT = "transparent"
}
/**
 * Properties for a Text widget
 */
export interface TextWidgetProps {
    /**
     * The text to display, in MarkDown format
     */
    readonly markdown: string;
    /**
     * Width of the widget, in a grid of 24 units wide
     *
     * @default 6
     */
    readonly width?: number;
    /**
     * Height of the widget
     *
     * @default 2
     */
    readonly height?: number;
    /**
     * Background for the widget
     *
     * @default solid
     */
    readonly background?: TextWidgetBackground;
}
/**
 * A dashboard widget that displays MarkDown
 */
export declare class TextWidget extends ConcreteWidget {
    private readonly markdown;
    private readonly background?;
    constructor(props: TextWidgetProps);
    position(x: number, y: number): void;
    toJson(): any[];
}
