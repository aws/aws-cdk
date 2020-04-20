import { ConcreteWidget } from './widget';

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
}

/**
 * A dashboard widget that displays MarkDown
 */
export class TextWidget extends ConcreteWidget {
  private readonly markdown: string;

  constructor(props: TextWidgetProps) {
    super(props.width || 6, props.height || 2);
    this.markdown = props.markdown;
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
      },
    }];
  }
}
