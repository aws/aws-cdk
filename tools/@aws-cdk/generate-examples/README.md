# Generate synthetic examples

This tool is designed to run during the build. It will find all classes in the
JSII assembly that don't yet have any example code associated with them, and
will generate a synthetic example that shows how to instantiate the type.

This is a method of last resort: we'd obviously prefer hand-written examples,
but this will make sure L1s will at least get something usable (which otherwise
would not have any examples at all).
