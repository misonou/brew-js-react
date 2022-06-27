import ClassNameMixin from "./ClassNameMixin";

export default class FlyoutToggleMixin extends ClassNameMixin {
    open(state?: any): Promise<any>;
    close(state?: any): Promise<void>;
}
