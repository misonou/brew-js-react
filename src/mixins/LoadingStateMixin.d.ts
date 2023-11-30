import ClassNameMixin from "./ClassNameMixin";
import Mixin from "./Mixin";
import { useLoadingStateMixin } from "../mixin";

/**
 * Adds `loading` CSS class to applied elements, when asynchronous operation is notified
 * through `notifyAsync` for any descendent elements. The `asyncStart` and `asyncEnd` events are also enabled on the applied elements.
 *
 * Mixin should be created using {@link useLoadingStateMixin} and applied to element by {@link Mixin.use}.
 */
export default class LoadingStateMixin extends ClassNameMixin { }
