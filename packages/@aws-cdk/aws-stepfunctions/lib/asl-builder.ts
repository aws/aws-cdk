import { Condition } from "./asl-condition";
import { Choice, ChoiceProps, Fail, INextable, Pass, State, StateMachineDefinition, Task, Wait, WaitProps } from "./asl-states";

export class Branch {
    protected first?: State;
    private current?: INextable;

    constructor(private readonly definition: StateMachineDefinition, private readonly choices?: Choices) {
        Array.isArray(this.definition); // FORCE USAGE
    }

    public pass(task: Pass) {
        this.add(task);
        this.current = task;
        return this;
    }

    public wait(task: Wait) {
        this.add(task);
        this.current = task;
        return this;
    }

    public wait_(id: string, props: WaitProps) {
        return this.wait(new Wait(this.definition, id, props));
    }

    public task(task: Task) {
        this.add(task);
        this.current = task;
        return this;
    }

    public fail(task: Fail) {
        this.add(task);
        return this;
    }

    public choice(choice: Choice): Choices {
        this.add(choice);
        return new Choices(this.definition, this, choice);
    }

    public choice_(id: string, props: ChoiceProps): Choices {
        return this.choice(new Choice(this.definition, id, props));
    }

    public label(_label: string): Branch {
        return this;
    }

    public goto(_label: string) {
        return this.end();
    }

    public end(): Choices {
        if (!this.choices) {
            throw new Error('No need to .end() a top-level branch!');
        }

        this.onEnd();
        return this.choices;
    }

    protected onEnd(): void {
        // Nothing
    }

    private add(state: State) {
        // FIXME: check task against children of definition
        if (!this.first) {
            this.first = state;
        }
        if (this.current) {
            this.current.next(state);
        }
    }
}

export class Choices {
    constructor(private readonly definition: StateMachineDefinition, private readonly parent: Branch, private readonly choice: Choice) {
    }

    public on(condition: Condition): ChoiceBranchBuilder {
        return new ChoiceBranchBuilder(this.definition, this, condition);
    }

    public otherwise(): Branch {
        return new Branch(this.definition, this);
    }

    public end(): Branch {
        return this.parent;
    }

    public _addChoice(condition: Condition, nextState: State) {
        this.choice.on(condition, nextState);
    }
}

/**
 * You'd say this needs to inherit from Branch but it can't because the return type needs to be ChoiceBranchBuilder
 */
export class ChoiceBranchBuilder extends Branch {
    constructor(definition: StateMachineDefinition, private readonly parent: Choices, private readonly condition: Condition) {
        super(definition, parent);
    }

    protected onEnd() {
        if (!this.first) {
            throw new Error('Branch has no states. Did you mean to add .success()?');
        }

        this.parent._addChoice(this.condition, this.first);
    }
}