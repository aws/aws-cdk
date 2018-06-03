We discovered that SSM::Assocations have an AssociationName and a Name parameter, which introduced a conflict.

Apart from that we have to resolve the conflict, the original heuristics were even wrong:

- Name is NOT the name of the resource to be created, it's the name of the SSM document to associate with.
- AssociationName IS the name of the resource to be created, that's fine, it's the name that we would have
picked for that attribute anyway.

We rename "Name" to "DocumentName" to clearly indicate what the Name attribute is for.
