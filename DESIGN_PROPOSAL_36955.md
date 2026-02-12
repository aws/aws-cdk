# Design Proposal: Fix StepFunctionsIntegration Cognito Claims Handling

## Issue
[#36955](https://github.com/aws/aws-cdk/issues/36955)

## Problem Statement
`StepFunctionsIntegration` with Cognito User Pool Authorizer doesn't properly pass claims to Step Functions execution input. The VTL template iterates over `$context.authorizer.keySet()` but Cognito claims are nested under `$context.authorizer.claims`.

## Current Behavior
```json
{
  "authorizer": {
    "claims": ""
  }
}
```

## Expected Behavior
```json
{
  "authorizer": {
    "sub": "user-id",
    "email": "user@example.com",
    "cognito:username": "username"
  }
}
```

## Proposed Solution

### Option 1: Cognito-only (Current Implementation)
**Change:** Iterate over `$context.authorizer.claims.keySet()` instead of `$context.authorizer.keySet()`

**Pros:**
- Minimal change
- Fixes Cognito User Pool Authorizer

**Cons:**
- Breaks Lambda Authorizer compatibility (claims are at top level)

### Option 2: Conditional Logic (Recommended)
**Change:** Check if `$context.authorizer.claims` exists, use it; otherwise fallback to `$context.authorizer`

```vtl
#if ($includeAuthorizer)
   #set($inputString = "$inputString, @@authorizer@@:{")
   #if ($context.authorizer.claims)
       #foreach($paramName in $context.authorizer.claims.keySet())
           #set($inputString = "$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.claims.get($paramName))@@")
           #if($foreach.hasNext)
               #set($inputString = "$inputString,")
           #end
       #end
   #else
       #foreach($paramName in $context.authorizer.keySet())
           #set($inputString = "$inputString @@$paramName@@: @@$util.escapeJavaScript($context.authorizer.get($paramName))@@")
           #if($foreach.hasNext)
               #set($inputString = "$inputString,")
           #end
       #end
   #end
   #set($inputString = "$inputString }")
#end
```

**Pros:**
- Supports both Cognito User Pool Authorizer and Lambda Authorizer
- Backward compatible
- No breaking changes

**Cons:**
- Slightly more complex VTL logic

## Decision
**Option 2** should be implemented to maintain backward compatibility with Lambda Authorizers while fixing Cognito User Pool Authorizer support.

## Testing Requirements
1. Integration test with Cognito User Pool Authorizer
2. Integration test with Lambda Authorizer
3. Verify claims are properly passed in both scenarios

## Breaking Changes
None - this is a bug fix that restores expected functionality.
