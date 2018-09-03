- Goal: should be possible to define structures such as IfThenElse() by users.
  We'd like the usage of these constructs to look more or less like they would look
  in regular programming languages. It should look roughly like this:

    task
    .then(new IfThenElse(
        new Condition(),
        task.then(task).then(task),
        task.then(task))
    .then(task)

- Goal: should be possible to define reusable-recurring pieces with parameters,
  and then reuse them.

    new Parallel([
        new DoSomeWork({ quality: 'high' }),
        new DoSomeWork({ quality: 'medium' }),
        new DoSomeWork({ quality: 'low' }),
    ])

- Goal: States defined in the same StateMachineDefinition share a scope and cannot refer
  to states outside that scope. StateMachineDefinition can be exploded into other
  StateMachineDefinitions.

- Goal: you shouldn't HAVE to define a StateMachineDefinition to use in a Parallel
  (even though should render as such when expanding to ASL). The following should also work:

    new Parallel([
        task.then(task).then(task),
        task.then(task),
        task
    ]);

  Regardless of how the states get into the Parallel, it should not be possible for them
  to jump outside the Parallel branch.

- Other kind of syntax:

    task1.then(task2).then(task3).goto(task1);  // <--- ends chain

- Interface we need from State:

    interface IState {
        next(chainable): Chainable;
        goto(state): void; // Use this for terminators as well?

        first(): State;
        allReachable(): State[];
    }

    StateMachineDefinition
        - All targeted states must be part of the same StateMachineDefinition
          enclosure.
        - States can be "lifted" into a separate enclosure by being a target of the
          Parallel branch.
        - Must be able to enumerate all reachable states, so that it can error on
          them. Every task can only be the target of a .next() once, but it can
          be the target of multiple goto()s.

- Contraints: Because of JSII:

    - No overloading (Golang)
    - No generics (Golang)
    - No return type covariance (C#)

    Lack of overloading means that in order to not have a different function call for
    every state type, we'll have to do runtime checks (for example, not all states
    can be next()'ed onto, and we cannot use the type system to detect and appropriately
    constrain this).

    Bonus: runtime checks are going to help dynamically-typed users.

- Constraint: Trying to next() onto a Chainable that doens't have a next(), runtime error;
  Lack of overloads make it impossible to do otherwise.

- State machine definition should be frozen (and complete) after being chained to.

Nextable: Pass, Task, Wait, Parallel
Terminating: Succeed, Fail
Weird: Choice

class Blah extends StateMachine {
    constructor() {
        // define statemachine here
    }
}

Use as:

    new StateMachine(..., {
        definintion: new Blah()
    });

But also:

    const def = new StateMachineDefinition();
    const task = new Task(def, ...);
    task.then(new Blah())// <-- expand (does that introduce naming? It should!)
        .then(new Task(...); // <-- appends transition to every end state!

And also:

    const p = new Parallel();
    p.parallel(new Blah()); // <-- leave as state machine

But not:

    const p = new Parallel();
    blah = new Blah();
    p.parallel(blah);

    blah.then(...); // <-- should be immutable!!

And also:

    const task1 = new Task1();
    const task2 = new Task1();

    const p = new Parallel();
    p.parallel(task1);   // <-- convert to state machine
    p.parallel(task2);

class FrozenStateMachine {
    render();
}

TO CHECK
- Can SMDef be mutable?

QUESTION
- Do branches in Parallel allow Timeout/Version?

PROBLEMS ENCOUNTERED
--------------------

    task1.catch(handler).then(task2)

Does this mean:

    (a) task1 -> task2
        |
        +---> handler

Or does this mean:

    (b) task1 -------> task2
        |              ^
        +--> handler --+

In the case of simply writing this, you probably want (a), but
in the case of a larger composition:

    someStateMachine.then(task2)

You want behavior (b) in case someStateMachine = task1.catch(handler).

How to distinguish the two? The problem is in the .then() operator, but the
only way to solve it is with more operators (.close(), or otherwise) which is
going to confuse people 99% of the time.

If we make everything mutable, we can simply do the narrow .then() definition
(open transitions only include task1), and people can manually add more
transitions after handler if they want to (in an immutable system, there's no
good way to "grab" that handler object and add to the transitions later).
Also, in the mutable representation, goto's are easier to represent (as in:
need no special representation, we can simply use .then()).

Next complication however: if we do the mutable thing, and we can add to the
state machine in fragments, there's no object that represents the ENTIRE
state machine with all states and transitions. How do we get the full state
machine? Either we enumerate all children of a StateMachineDefinition object,
or we begin at the start state and crawl all accessible states. In the former
case, we can warn/error if not all states are used in the SM.

Then there is the construct model API. I would like to allow:

```ts
class SomeConstruct extends cdk.Construct {
    constructor(parent: cdk.Construct) {
        const task1 = new Task(this, ...);
        const task2 = new Task(this, ...);

        // ALLOW THIS
        new StateMachine(..., {
            definition: task1.then(task2)
        });

        // ALLOW THIS
        task1.then(task2);
        new StateMachine(..., {
            definition: task1
        });

        new StateMachineDefinition(this, {
        });
    }
}
```

It's desirable to just have a StateMachineDefinition own and list everything,
but that kind of requires that for Parallel you need a StateMachineDefinition
as well (but probably without appending names).