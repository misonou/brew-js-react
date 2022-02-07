import dom from "../include/zeta-dom/dom";
import StatefulMixin from "./StatefulMixin";

export default class ErrorHandlerMixin extends StatefulMixin {
    /**
     * Catches errors from promises registered to descandant elements by {@link dom.lock}.
     * Unfiltered handlers are called after filtered handlers, registered by other overloads, regardless of order.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param handler Callback to be invoked.
     */
    catch(handler: (e: any) => any): Zeta.UnregisterCallback;

    /**
     * Catches errors with property `code` matching the specified code, from promises registered to descandant elements by {@link dom.lock}.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param code Value to be matched against.
     * @param handler Callback to be invoked when the criteria matches.
     */
    catch(code: string, handler: (e: Error) => any): Zeta.UnregisterCallback;

    /**
     * Catches errors that are instances of the specified error type, from promises registered to descandant elements by {@link dom.lock}.
     *
     * If handler returns a value other than `undefined`, including promises resolving to whatever values,
     * the error is marked as handled and no further handlers are called nor will be propagated up the DOM tree.
     * @param type Constructor of a specific error type.
     * @param handler Callback to be invoked when the criteria matches.
     */
    catch<T extends Error>(type: typeof T, handler: (e: T) => any): Zeta.UnregisterCallback;
}
