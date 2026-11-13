# Custom resource handler for S3 Table's Schema Evolution
#
# Since S3 tables doesn't have an UpdateTable API in CloudFormation. This resource handler will 
# handle the schema evolution where an existing table needs to be updated.
#
# We will automate any additive changes such as:
# - adding new columns
# - updating or adding column doc/metadata 
# - widen types