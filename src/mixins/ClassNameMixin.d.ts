import StatefulMixin, { MixinState } from "./StatefulMixin";

export interface ClassNameMixinState extends MixinState {
    classNames: Record<string, boolean>;
}

export default class ClassNameMixin extends StatefulMixin<ClassNameMixinState> {
    /**
     * @param classNames Specifies a list of class names to be obeserved.
     */
    constructor(classNames: string[] = []);

    protected onClassNameUpdated(element: HTMLElement, prevState: Record<string, boolean>, state: Record<string, boolean>): void;
}

