// Some defines to lightly type the JSX elements for TypeScript
//
// Cannot use @types/react because those require more properties than we supply on
// JSX elements.
declare namespace JSX {
    interface Element { }
    interface IntrinsicElements { div: any; }
}
