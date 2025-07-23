export interface Mixin<In, Out> {
  apply(resource: In): Out;
}
