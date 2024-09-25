/**
 * Docker Credential Helper to retrieve credentials based on an external configuration file.
 * Supports loading credentials from ECR repositories and from Secrets Manager,
 * optionally via an assumed role.
 *
 * The only operation currently supported by this credential helper at this time is the `get`
 * command, which receives a domain name as input on stdin and returns a Username/Secret in
 * JSON format on stdout.
 *
 * IMPORTANT - The credential helper must not output anything else besides the final credentials
 * in any success case; doing so breaks docker's parsing of the output and causes the login to fail.
 */
export {};
