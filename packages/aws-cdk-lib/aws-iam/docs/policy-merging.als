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

//-------------------------------------------------------
// Base Statement definitions
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

//-------------------------------------------------------
// Requests and evaluations
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

//-------------------------------------------------------
// Statement merging

// Assert that m is the merged version of a and b
//
// This encodes the important logic: the rules of merging.
pred merged[a: Statement, b: Statement, m: Statement] {
  // Preconditions
  a.effect = b.effect
  a.notAction = b.notAction
  a.notResource = b.notResource
  a.notPrincipal = b.notPrincipal

  // Merging is allowed in one of 2 cases:
  // - of the pairs { Resource, Action, Principal } 2 are the same (then the 3rd pair may be merged)
  // - if one statement is a full subset of the other one (then it may be subsumed) [not implemented yet]
  let R = a.resource = b.resource, A = a.action = b.action, P = a.principal = b.principal {
    ((R and A) or (R and P) or  (A and P) or 
     (a.resource in b.resource and a.action in b.action and a.principal in b.principal) or
     (b.resource in a.resource and b.action in a.action and b.principal in a.principal))
  }

  // Result of merging
  m.effect = a.effect
  m.action = a.action + b.action
  m.notAction = a.notAction
  m.resource = a.resource + b.resource
  m.notResource = a.notResource 
  m.principal = a.principal + b.principal
  m.notPrincipal = a.notPrincipal
}

run show_some_nontrivial_merges {
  some disj s0, s1, M: Statement | merged[s0, s1, M] and s0.action != s1.action
}

// For any pair of statements, there is only one possible merging
check merging_is_unique {
  all s0, s1: Statement {
    no disj m0, m1 : Statement | merged[s0, s1, m0] and merged[s0, s1, m1]
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
  no s0, s1, s2, h0, h1, m0, m1: Statement {
    merged[s0, s1, h0] and merged[h0, s2, m0]
    merged[s1, s2, h1] and merged[h1, s0, m1]
    m0 != m1
  }
} for 10

// For all statements, merged(s0, s1) = merged(s1, s0)
check merging_is_commutative {
  all s0, s1, m: Statement {
    merged[s0, s1, m] implies merged[s1, s0, m]
  }
} for 5

//-------------------------------------------------------
// Repeated application of merging

// Whether a and b are mergeable
pred mergeable[a: Statement, b: Statement] {
  some m: Statement | m != a and m != b and merged[a, b, m]
}

// Maximally merged items in a set
pred maxMerged(input: set Statement, output: set Statement) {
  no disj a, b: output | mergeable[a, b]

  input = output or {
    #input > #output
    some a, b: input | some m: Statement {
      m != a
      m != b
      merged[a, b, m]
      maxMerged[input - a - b + m, output]
    }
  }
}

run some_interesting_maxMerged_statements {
  some input, output: set Statement { 
    maxMerged[input, output]
    #input = 3
    #output = 1
    all x: output | x not in input
  }
} for 5

check max_merging_does_not_change_eval {
  all input, output: set Statement, r: Request { 
    maxMerged[input, output] implies (allow[r, input] iff allow[r, output])
  }
} for 5

// This used to be written the opposite way. But you know: merging is NOT unique.
// Counterexample found by Alloy:
//     {{ A, B, A }, {B, B, A} { A, B, B }}
// Reduces to either:
//     {{ AB, B, A }, { A, B, B }}
// or {{ A, B, AB }, { B, B, A }}
run max_merging_is_not_unique {
  some input, m0, m1: set Statement { 
    maxMerged[input, m0] and maxMerged[input, m1] and m0 != m1
  }
} for 5
