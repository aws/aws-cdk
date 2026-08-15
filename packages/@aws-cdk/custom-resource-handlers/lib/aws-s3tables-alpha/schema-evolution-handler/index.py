# Custom resource handler for S3 Table's Schema Evolution
#
# Since S3 tables doesn't have an UpdateTable API in CloudFormation. This resource handler will 
# handle the schema evolution where an existing table needs to be updated.
#
# The following schema changes are valid:
# - add new columns
# - change nullability
# - update column doc
# - rename columns
# - widen types
# - evolve partition specs
#
# Invalidate schema changes that:
# - are not backward compatible
# - drops columns
# - reorders column order
# - change column type to a narrower type