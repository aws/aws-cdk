import { ValueTransform, ifDefined } from "./well-known-values";
import { IRenderable } from "./cm2";

export interface WireableProps {
  readonly required?: boolean;
  readonly wire?: string;
  readonly wireTransform?: ValueTransform;
}

export interface IWireable {
  wire(props: Record<string, IRenderable>): void;
}

export function maybeWire<A extends IRenderable>(receiver: IWireable, props: WireableProps, value: A): A {
  if (props.wire) {
    const transformedValue = props.wireTransform ? props.wireTransform(value) : value;
    receiver.wire({
      [props.wire]: props.required ? transformedValue : ifDefined(value, transformedValue),
    });
  }
  return value;
}