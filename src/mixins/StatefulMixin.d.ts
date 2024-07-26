import Mixin from "./Mixin";

export interface MixinState {
    /**
     * Gets the element associated to this state object.
     */
    readonly element: HTMLElement;
    /**
     * Additional state.
     */
    [x: string]: any;

    /**
     * Registers callback to clean up resources when the element is unmounted.
     * @param callback A callback.
     */
    onDispose(callback: Zeta.UnregisterCallback): void;
}

export interface MixinRef<T extends StatefulMixin = StatefulMixin> {
    /**
     * @private
     */
    getMixin(): T;
}

export default abstract class StatefulMixin<T extends MixinState = MixinState> extends Mixin {
    /**
     * Gets a {@link MixinRef} object that can be passed to child components.
     */
    get ref(): MixinRef<typeof this>;
    /**
     * Gets a pending state object to store values before element is mounted.
     *
     * By default, existing values on the actual state object will be overwritten in subsequent update.
     * To handle changes, overrides the {@link StatefulMixin.mergeState} method.
     */
    protected get state(): Exclude<Partial<T>, 'element' | 'onDispose'>;

    /**
     * Gets an array of mounted elements which this mixin has been applied.
     */
    elements(): HTMLElement[];
    /**
     * Registers callback to clean up resources when the host component is unmounted.
     * For individual element, use {@link MixinState.onDispose}.
     * @param callback A callback.
     */
    onDispose(callback: Zeta.UnregisterCallback): void;

    /**
     * Override this method to create state object with initial values.
     * @deprecated Initialize state in {@link StatefulMixin.initElement} instead.
     */
    protected initState(): T;
    /**
     * Override this method to initialize resources when the element is first mounted, e.g. attach event listeners.
     * @param element A DOM element.
     * @param state Persisted state object associated with the element.
     */
    protected initElement(element: HTMLElement, state: T): void;
    /**
     * Override this method to handle state changes.
     * When overriden, new states are required to copied manually to the persisted state object.
     * @param element A DOM element.
     * @param state Persisted state object associated with the element.
     * @param newState New states passed from {@link StatefulMixin.state}.
     */
    protected mergeState(element: HTMLElement, state: T, newState: Partial<T>): void;
    /**
     * Override this method to apply changes to mounted element.
     * @param element A DOM element.
     * @param state Persisted state object associated with the element.
     */
    protected onLayoutEffect(element: HTMLElement, state: T): void;
    /**
     * Override this method to apply changes when element is about to be updated.
     * It is analogous to `getSnapshotBeforeUpdate` for a {@link React.Component}.
     * @param element A DOM element.
     * @param state Persisted state object associated with the element.
     */
    protected onBeforeUpdate(element: HTMLElement, state: T): void;
    /**
     * @deprecated This method is no longer used.
     */
    protected clone(): this;
}
