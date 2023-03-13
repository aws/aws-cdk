import { ConcreteWidget } from './widget';

/**
 * Background types available
 */
export enum TextWidgetBackground {
  /**
   * Solid background
   */
  SOLID = 'solid',
  /**
  * Transparent background
  */
  TRANSPARENT = 'transparent'
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
export class TextWidget extends ConcreteWidget {
  private readonly markdown: string;
  private readonly background?: TextWidgetBackground;

  constructor(props: TextWidgetProps) {
    super(props.width || 6, props.height || 2);
    this.markdown = props.markdown;
    this.background = props.background;
  }

  public position(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public toJson(): any[] {
    return [{
      type: 'text',
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      properties: {
        markdown: this.markdown,
        background: this.background,
      },
    }];
  }
}
