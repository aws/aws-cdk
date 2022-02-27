/*
Alloy model to confirm the logic behind merging IAM Statements.

This proves that merging two statements based on the following conditions:

- Effects are the same
- NotAction, NotResource, NotPrincipal are the same(*)
- Of Action, Resource, Principal sets, 2 out of 3 are the same(*)

Is sound, as the model doesn't find any examples of where the meaning
of statements is changed by merging.

Find Alloy at https://alloytools.org/.

(*) Some of these sets may be empty--that is fine, the logic still works out.
*/

---------------------------------------------------------
-- Base Statement definitions
enum Effect { Allow, Deny }
enum Resource { ResourceA, ResourceB }
enum Action { ActionA, ActionB }
enum Principal { PrincipalA, PrincipalB }

sig Statement {
  effect: Effect,
  principal: set Principal,
  notPrincipal: set Principal,
  action: set Action,
  notAction: set Action,
  resource: set Resource,
  notResource: set Resource,
} {
  // Exactly one of Xxx and notXxx is non-empty
  (some principal) iff not (some notPrincipal)
  (some action) iff not (some notAction)
  (some resource) iff not (some notResource)
}

// So that we can compare Statements using =, if two Statements have
// exactly the same properties then they are the same Statement
fact {
  all a, b: Statement {
     (
      a.effect = b.effect and
      a.principal = b.principal and 
      a.notPrincipal = b.notPrincipal and
      a.action = b.action and
      a.notAction = b.notAction and
      a.resource = b.resource and
      a.notResource = b.notResource) implies a = b 
  }
}

---------------------------------------------------------
-- Requests and evaluations
sig Request {
  principal: Principal,
  action: Action,
  resource: Resource,
}

// Whether the statement applies to the given request
pred applies[s: Statement, req: Request] {
  some s.principal implies req.principal in s.principal
  some s.notPrincipal implies req.principal not in s.notPrincipal
  some s.action implies req.action in s.action
  some s.notAction implies req.action not in s.notAction
  some s.resource implies req.resource in s.resource
  some s.notResource implies req.resource not in s.notResource
}

// Whether or not to allow the given request according to the given statements
//
// A request is allowed if there's at least one statement allowing it and
// no statements denying it.
pred allow[req: Request, ss: some Statement] {
  some s: ss | applies[s, req] and s.effect = Allow
  no s: ss | applies[s, req] and s.effect = Deny
}

run show_some_allowed_requests {
  some ss: set Statement, r: Request | allow[r, ss] and /* no useless Statements floating around */ (no s" : Statement | s" not in ss)
} for 3 but 1 Request

---------------------------------------------------------
-- Statement merging

// Helpers to assert that certain fields are the same
let sameAction[a, b] = { a.action = b.action and a.notAction = b.notAction }
let sameResource[a, b] = { a.resource = b.resource and a.notResource = b.notResource }
let samePrincipal[a, b] = { a.principal = b.principal and a.notPrincipal = b.notPrincipal }

// Assert that m is the merged version of a and b
//
// This encodes the important logic: the rules of merging.
pred merged[a: Statement, b: Statement, m: Statement] {
  a.effect = b.effect and m.effect = a.effect

  -- If 2 of the pairs { Resource, Action, Principal } are subsets of each other, then the 3rd may be merged
  let R = a.resource = b.resource, A = a.action = b.action, P = a.principal = b.principal {
    (R and A) or (R and P) or (A and P)
  }

  -- Result of merging
  m.action = a.action + b.action and m.notAction = a.notAction and m.notAction = b.notAction
  m.resource = a.resource + b.resource and m.notResource = a.notResource and m.notResource = b.notResource
  m.principal = a.principal + b.principal and m.notPrincipal = a.notPrincipal and m.notPrincipal = b.notPrincipal
}

run show_some_nontrivial_merges {
  some disj s0, s1, M: Statement | merged[s0, s1, M] and s0.action != s1.action
}

// For any pair of statements, there is only one possible merging
check merging_is_unique {
  all s0, s1: Statement {
    no disj m1, m2 : Statement | merged[s0, s1, m1] and merged[s0, s1, m2]
  }
} for 5

// For all statements, the evaluation of the individual statements is the same as the evaluation
// of the merged statement.
check merging_does_not_change_evaluation {
  all a: Statement, b: Statement, m: Statement, r: Request {
    merged[a, b, m] implies (allow[r, a + b] iff allow[r, m])
  }
} for 3

// There are no 3 statements such that merged(merged(s0, s1), s2) != merged(s0, merged(s1, s2))
check merging_is_associative {
  no s0, s1, s2, h1, h2, m1, m2 : Statement {
    merged[s0, s1, h1] and merged[h1, s2, m1]
    merged[s1, s2, h2] and merged[h2, s0, m2]
    m1 != m2
  }
} for 10
