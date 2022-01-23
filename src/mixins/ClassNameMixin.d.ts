import StatefulMixin from "./StatefulMixin";

export interface ClassNameMixinState extends MixinState {
    classNames: Record<string, boolean>;
}

export default class ClassNameMixin extends StatefulMixin {
    constructor(classNames: string[] = []);

    protected onClassNameUpdated(element: HTMLElement, prevState: Record<string, boolean>, state: Record<string, boolean>): void;
}

