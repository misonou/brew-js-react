import ClassNameMixin from "./ClassNameMixin";

export type AnimationEffect = 'fade-in' | 'slide-down' | 'slide-up' | 'slide-left' | 'slide-right';
export type AnimationTrigger = 'show' | 'open';

export default class AnimateMixin extends ClassNameMixin {
    with(props: { effects?: AnimationEffect[], trigger?: AnimationTrigger }): this;
    withEffects(...effects: AnimationEffect[]): this;
}
