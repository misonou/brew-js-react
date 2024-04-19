declare namespace Brew {
    interface PageEvent {
        /**
         * Returns the view component associated to target.
         * The property is only available in `pageenter` or `pageleave event.
         */
        readonly view?: import("./view").ViewComponent<any>;
    }
}
