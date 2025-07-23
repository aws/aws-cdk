export interface Mixin<In, Out extends In> {
  apply(resource: In): Out;
}
