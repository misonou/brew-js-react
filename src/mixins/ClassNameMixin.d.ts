import StatefulMixin, { MixinState } from "./StatefulMixin";

export interface ClassNameMixinState extends MixinState {
    classNames: Record<string, boolean>;
}

/**
 * Base class for implementing mixins that requires certain CSS class names to be
 * preserved after component update.
 */
export default class ClassNameMixin extends StatefulMixin<ClassNameMixinState> {
    /**
     * @param classNames Specifies a list of class names to be obeserved.
     */
    constructor(classNames?: string[]);

    /**
     * Override to perform actions when observed class names has changed.
     * @param element DOM element which its class names has changed.
     * @param prevState Previous states representing the presence of each class name.
     * @param state Current states representing the presence of each class name.
     */
    protected onClassNameUpdated(element: HTMLElement, prevState: Record<string, boolean>, state: Record<string, boolean>): void;
}
