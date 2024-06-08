import React, { useEffect, useRef, useState } from "react";
import { jest } from "@jest/globals";
import { act, render, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { addAnimateIn, addAnimateOut, animateIn } from "brew-js/anim";
import { isFlyoutOpen, openFlyout } from "brew-js/domAction";
import dom from "zeta-dom/dom";
import { delay, extend, watch } from "zeta-dom/util";
import { classNames, useUpdateTrigger } from "zeta-dom-react";
import { AnimateSequenceMixin, ClassNameMixin, FlyoutMixin, ScrollIntoViewMixin, useAnimateMixin, useAnimateSequenceMixin, useClassNameToggleMixin, useFlyoutMixin, useFocusStateMixin, useLoadingStateMixin, useMixin, useMixinRef, useScrollableMixin, useUnmanagedClassNameMixin } from "src/mixin";
import Mixin from "src/mixins/Mixin";
import StatefulMixin from "src/mixins/StatefulMixin";
import StaticAttributeMixin from "src/mixins/StaticAttributeMixin";
import { after, mockFn, verifyCalls, _, cleanup, root } from "@misonou/test-utils";
import initAppBeforeAll from "./harness/initAppBeforeAll";

class ScrollIntoViewMixinImpl extends ScrollIntoViewMixin {
    static callback = mockFn();
    initElement(element, state) {
        super.initElement(element, state);
        const callback = state.callback;
        state.callback = function () {
            ScrollIntoViewMixinImpl.callback(element);
            callback();
        };
    }
}

const customAnimateIn = mockFn(() => delay(10));
const customAnimateOut = mockFn(() => delay(10));
addAnimateIn('custom-anim', customAnimateIn)
addAnimateOut('custom-anim', customAnimateOut)

initAppBeforeAll(() => { });

describe('use', () => {
    it('should accept ref callback as first argument', () => {
        const cb = mockFn();
        const Component = function () {
            return (<div {...Mixin.use(cb, Mixin.scrollableTarget)}>foo</div>)
        };
        const { asFragment, getByText } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
        verifyCalls(cb, [[getByText('foo')]]);
    });

    it('should accept undefined as first argument', () => {
        const Component = function () {
            return (<div {...Mixin.use(undefined, Mixin.scrollableTarget)}>foo</div>)
        };
        const { asFragment } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should accept mutable ref object as first argument', () => {
        const ref = { current: undefined };
        const Component = function () {
            return (<div {...Mixin.use(ref, Mixin.scrollableTarget)}>foo</div>)
        };
        const { asFragment, getByText } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
        expect(ref.current).toBe(getByText('foo'));
    });

    it('should accept class name string as second or next argument', () => {
        const Component = function () {
            return (<div {...Mixin.use(mockFn(), 'foo')}>foo</div>)
        };
        const { asFragment } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should apply all class names from mixins', () => {
        class ClassNameMixin extends Mixin {
            constructor(...args) {
                super();
                this.classNames = args;
            }
            getClassNames() {
                return this.classNames;
            }
        }
        const Component = function () {
            return (<div {...Mixin.use(
                new ClassNameMixin({ foo: true }),
                new ClassNameMixin('bar'))}></div>);
        };
        const { asFragment } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('should apply all custom attributes from mixins', () => {
        const Component = function () {
            return (<div {...Mixin.use(
                new StaticAttributeMixin({ 'data-custom-1': 'foo' }),
                new StaticAttributeMixin({ 'data-custom-2': 'bar' }))}></div>);
        };
        const { asFragment } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('useMixin', () => {
    it('should work with base class', () => {
        const { result, unmount } = renderHook(() => useMixin(Mixin));
        expect(result.current).toBeInstanceOf(Mixin);
        unmount();
    });
});

describe('StaticAttributeMixin', () => {
    it('should add custom attributes to element', () => {
        const Component = function ({ value }) {
            return (<div {...Mixin.use(new StaticAttributeMixin({ 'data-custom': 'foo' }))}></div>);
        }
        const { asFragment, rerender } = render(<Component value="1" />);
        expect(asFragment()).toMatchSnapshot();

        rerender(<Component value="2" />)
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('StatefulMixin', () => {
    it('should flush changes on observable property synchronously when disposed', async () => {
        class TestMixin extends StatefulMixin {
            prop = 1;
        }
        const cb = mockFn();
        const { result, unmount } = renderHook(() => useMixin(TestMixin));

        watch(result.current, 'prop', cb);
        result.current.prop = 2;
        expect(cb).not.toBeCalled();
        unmount();
        await delay(0);
        expect(cb).toBeCalledTimes(1);
    });
});

describe('StatefulMixin#elements', () => {
    it('should return a list of rendered elements', () => {
        class TestMixin extends StatefulMixin { }
        let mixin;
        const Component = function ({ count }) {
            mixin = useState(() => new TestMixin())[0].reset();
            return (<>
                {' '.repeat(count).split('').map((_, i) => {
                    return (<div key={i} {...Mixin.use(mixin)}>foo</div>)
                })}
            </>);
        };
        const { rerender, getAllByText } = render(<Component count={2} />);
        expect(mixin.elements()).toEqual(getAllByText('foo'));
        expect(mixin.elements().length).toBe(2);

        rerender(<Component count={3} />);
        expect(mixin.elements()).toEqual(getAllByText('foo'));
        expect(mixin.elements().length).toBe(3);
    });

    it('should return a list of rendered elements from child components', () => {
        class TestMixin extends StatefulMixin { }
        let mixin;
        const Inner = function ({ mixinRef, count }) {
            const mixin = useMixinRef(mixinRef);
            return (<>
                {' '.repeat(count).split('').map((_, i) => {
                    return (<div key={i} {...Mixin.use(mixin)}>foo</div>)
                })}
            </>);
        };
        const Component = function ({ count }) {
            mixin = useState(() => new TestMixin())[0].reset();
            return (<Inner count={count} mixinRef={mixin.ref} />);
        };
        const { getAllByText } = render(<Component count={2} />);
        expect(mixin.elements()).toEqual(getAllByText('foo'));
        expect(mixin.elements().length).toBe(2);
    });

    it('should not return unmounted elements', () => {
        class TestMixin extends StatefulMixin { }
        let mixin;
        const Component = function ({ count }) {
            mixin = useMixin(TestMixin);
            return (<>
                {' '.repeat(count).split('').map((_, i) => {
                    return (<div key={i} {...Mixin.use(mixin)}>foo</div>)
                })}
            </>);
        };
        const { rerender } = render(<Component count={2} />);
        expect(mixin.elements().length).toBe(2);

        rerender(<Component count={1} />);
        expect(mixin.elements().length).toBe(1);
    });
});

describe('StatefulMixin#initElement', () => {
    it('should be called for each rendered element exactly once', () => {
        const cb = mockFn();
        class TestMixin extends StatefulMixin {
            initElement(element) {
                cb(element);
            }
        }
        const Component = function ({ count }) {
            const mixin = useState(() => new TestMixin())[0].reset();
            return (<>
                {' '.repeat(count).split('').map((_, i) => {
                    return (<div key={i} {...Mixin.use(mixin)}>foo</div>)
                })}
            </>);
        };
        const { rerender, getAllByText } = render(<Component count={2} />);
        const [n1, n2] = getAllByText('foo');
        verifyCalls(cb, [[n1], [n2]]);

        cb.mockClear();
        rerender(<Component count={3} />);

        const [, , n3] = getAllByText('foo');
        verifyCalls(cb, [[n3]]);
    });

    it('should be called with unique state per element', () => {
        const cb = mockFn();
        class TestMixin extends StatefulMixin {
            initElement(element, state) {
                cb(state);
            }
        }
        const Component = function () {
            const mixin = useState(() => new TestMixin())[0].reset();
            return (<>
                <div {...Mixin.use(mixin)}>foo</div>
                <div {...Mixin.use(mixin)}>foo</div>
            </>);
        };
        render(<Component />);

        expect(cb).toBeCalledTimes(2);
        expect(cb.mock.calls[0][0]).not.toBe(cb.mock.calls[1][0]);
    });
});

describe('StatefulMixin#state', () => {
    it('should set state to correct target in each render cycle', () => {
        class TestMixin extends StatefulMixin {
            setIndex(index) {
                this.state.index = index;
                return this;
            }
            initElement(element, state) {
                state.text = element.innerHTML;
            }
            onLayoutEffect(element, state) {
                element.setAttribute('data-index', state.index);
                element.setAttribute('data-text', state.text);
            }
        }
        const Component = function ({ value }) {
            const mixin = useMixin(TestMixin);
            return (<>
                {value.map((v, i) => (
                    <div key={v} {...Mixin.use(mixin.setIndex(i))}>{v}</div>
                ))}
            </>);
        };
        const { asFragment, rerender, unmount } = render(<Component value={[1, 2]} />);
        expect(asFragment()).toMatchSnapshot();

        rerender(<Component value={[2, 1]} />);
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should set state to correct target in each render cycle in child component', () => {
        const updateChild = mockFn();
        class TestMixin extends StatefulMixin {
            setIndex(index) {
                this.state.index = index;
                return this;
            }
            initElement(element, state) {
                state.text = element.innerHTML;
                state.count = 0;
            }
            onLayoutEffect(element, state) {
                element.setAttribute('data-index', state.index);
                element.setAttribute('data-text', state.text);
                element.setAttribute('data-count', ++state.count);
            }
        }
        const Inner = function ({ mixinRef }) {
            const mixin = useMixinRef(mixinRef);
            const [values, setValues] = useState([2, 3]);
            updateChild.mockImplementation(setValues);
            return (<>
                {values.map((v, i) => (
                    <div key={v} {...Mixin.use(mixin.setIndex(i))}>{v}</div>
                ))}
            </>);
        };
        const Component = function () {
            const mixin = useMixin(TestMixin);
            return (<>
                <div {...Mixin.use(mixin.setIndex(1))}>{1}</div>
                <Inner mixinRef={mixin.ref} />
            </>);
        }
        const { asFragment, unmount } = render(<Component />);
        expect(asFragment()).toMatchSnapshot();

        act(() => updateChild([3, 2]));
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });

    it('should return accessible state object on creation', () => {
        new class TestMixin extends StatefulMixin {
            constructor() {
                super();
                expect(this.state).toEqual({});
            }
        }
        expect.assertions(1);
    });
});

describe('StatefulMixin#mergeState', () => {
    it('should be invoked in each render cycle when needed', () => {
        const mergeState = mockFn();
        class TestMixin extends StatefulMixin {
            setIndex(index) {
                this.state.index = index;
                return this;
            }
            mergeState(element, state, newState) {
                mergeState(element, extend({}, state), extend({}, newState));
                super.mergeState(element, state, newState);
            }
        }
        const Component = function ({ value }) {
            const mixin = useMixin(TestMixin);
            return (<>
                {value.map((v, i) => (
                    <div key={v} {...Mixin.use(mixin.setIndex(i))}>{v}</div>
                ))}
            </>);
        };
        const { rerender, unmount } = render(<Component value={['foo', 'bar']} />);
        expect(mergeState).not.toBeCalled();

        rerender(<Component value={['bar', 'foo']} />);
        verifyCalls(mergeState, [
            [screen.getByText('bar'), expect.objectContaining({ index: 1 }), { index: 0 }],
            [screen.getByText('foo'), expect.objectContaining({ index: 0 }), { index: 1 }],
        ]);
        unmount();
    });
});

describe('StatefulMixin#onLayoutEffect', () => {
    it('should be invoked for each element in each render cycle', () => {
        const onLayoutEffect = mockFn();
        class TestMixin extends StatefulMixin {
            onLayoutEffect = onLayoutEffect;
        }
        const Component = function ({ value }) {
            const mixin = useMixin(TestMixin);
            return (
                <>
                    <div data-testid="elm1" {...Mixin.use(mixin)}></div>
                    <div data-testid="elm2" {...Mixin.use(mixin)}></div>
                </>
            );
        };
        const { unmount, rerender } = render(<Component value="foo" />);
        verifyCalls(onLayoutEffect, [
            [screen.getByTestId('elm1'), _],
            [screen.getByTestId('elm2'), _],
        ]);
        const state1 = onLayoutEffect.mock.calls[0][1];
        const state2 = onLayoutEffect.mock.calls[1][1];

        onLayoutEffect.mockClear();
        rerender(<Component value="bar" />);
        verifyCalls(onLayoutEffect, [
            [screen.getByTestId('elm1'), state1],
            [screen.getByTestId('elm2'), state2],
        ]);
        unmount();
    });

    it('should be invoked for each element in updated component only', () => {
        let update;
        const onLayoutEffect = mockFn();
        class TestMixin extends StatefulMixin {
            onLayoutEffect = onLayoutEffect;
        }
        const Inner = function ({ mixinRef }) {
            const mixin = useMixinRef(mixinRef);
            update = useUpdateTrigger();
            return (
                <div data-testid="elm2" {...Mixin.use(mixin)}></div>
            );
        }
        const Component = function () {
            const mixin = useMixin(TestMixin);
            return (
                <>
                    <div data-testid="elm1" {...Mixin.use(mixin)}></div>
                    <Inner mixinRef={mixin.ref} />
                </>
            );
        };
        const { unmount } = render(<Component />);
        verifyCalls(onLayoutEffect, [
            [screen.getByTestId('elm1'), _],
            [screen.getByTestId('elm2'), _],
        ]);

        onLayoutEffect.mockClear();
        act(() => update());
        verifyCalls(onLayoutEffect, [
            [screen.getByTestId('elm2'), _],
        ]);
        unmount();
    });

    it('should be called with same state object passed to initElement', () => {
        class TestMixin extends StatefulMixin {
            _counter = 0;
            initElement(element, state) {
                state.value = String(++this._counter);
            }
            onLayoutEffect(element, state) {
                element.setAttribute('data-custom', state.value);
            }
        }
        const Component = function ({ value }) {
            const mixin = useMixin(TestMixin);
            return (<>
                {value.map(v => (
                    <div key={v} {...Mixin.use(mixin)}>{v}</div>
                ))}
            </>);
        };
        const { asFragment, rerender, unmount } = render(<Component value={[1, 2]} />);
        expect(asFragment()).toMatchSnapshot();

        rerender(<Component value={[2, 1]} />);
        expect(asFragment()).toMatchSnapshot();

        rerender(<Component value={[3, 1]} />);
        expect(asFragment()).toMatchSnapshot();
        unmount();
    });
});

describe('ClassNameMixin', () => {
    it('should persist monitored class names in re-render', async () => {
        const mixin = new ClassNameMixin(['foo']);
        const Component = function ({ value }) {
            mixin.reset();
            return (<div {...Mixin.use(mixin, classNames({ baz: value }))}></div>);
        };
        const { container, rerender, unmount } = render(<Component value={true} />);
        const div = container.firstChild;
        await after(() => {
            div.classList.add('foo');
            div.classList.add('bar');
        });

        rerender(<Component value={false} />);
        expect(div.classList.contains('foo')).toBe(true);
        expect(div.classList.contains('bar')).toBe(false);
        expect(div).toMatchSnapshot();
        unmount();
    });

    it('should invoke onClassNameUpdated', async () => {
        const mixin = new ClassNameMixin(['foo', 'bar']);
        const onClassNameUpdated = jest.spyOn(mixin, 'onClassNameUpdated');
        const Component = function () {
            mixin.reset();
            return (<div {...Mixin.use(mixin, 'test')}></div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;
        div.classList.add('foo');
        div.classList.add('bar');

        await delay(100);
        verifyCalls(onClassNameUpdated, [
            [div, { foo: false, bar: false }, { foo: true, bar: true }]
        ]);
        unmount();
    });
});

describe('AnimateMixin', () => {
    it('should set animate-in attributes', async () => {
        const Component = function () {
            const mixin = useAnimateMixin();
            return (<div {...Mixin.use(mixin.withEffects('fade-in'))}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('animate-in', 'fade-in');
        expect(div).toHaveAttribute('animate-on', 'show');
        unmount();
    });

    it('should set animate-on attributes', async () => {
        const Component = function () {
            const mixin = useAnimateMixin();
            return (<div {...Mixin.use(mixin.with({ trigger: 'open', effects: ['fade-in'] }))}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('animate-in', 'fade-in');
        expect(div).toHaveAttribute('animate-on', 'open');
        unmount();
    });
});

describe('AnimateSequenceMixin', () => {
    it('should set animate-sequence attributes', async () => {
        const Component = function () {
            const mixin = useAnimateSequenceMixin();
            return (<div {...Mixin.use(mixin.withEffects('fade-in'))}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('animate-sequence');
        unmount();
    });

    it('should support auto start for intro animation', async () => {
        const Component = function ({ count }) {
            const mixin = useAnimateSequenceMixin();
            return (
                <div {...Mixin.use(mixin.withEffects('fade-in'))}>
                    {' '.repeat(count).split('').map(v => (
                        <div data-testid="item" {...Mixin.use(mixin.item)}></div>
                    ))}
                </div>
            );
        };
        const { container, rerender, unmount } = render(<Component count={0} />);
        animateIn(container, 'show', '', true);

        const cb = mockFn();
        rerender(<Component count={1} />);
        cleanup(dom.on(screen.getByTestId('item'), 'animatein', cb));
        await waitFor(() => {
            expect(cb).toBeCalledTimes(1);
        });
        unmount();
    });

    it('should support auto start for intro animation using selector', async () => {
        const Component = function ({ count }) {
            const mixin = useAnimateSequenceMixin('[data-testid="item"]');
            return (
                <div {...Mixin.use(mixin.withEffects('fade-in'))}>
                    {' '.repeat(count).split('').map(v => (
                        <div data-testid="item"></div>
                    ))}
                </div>
            );
        };
        const { container, rerender, unmount } = render(<Component count={0} />);
        animateIn(container, 'show', '', true);

        const cb = mockFn();
        rerender(<Component count={1} />);
        cleanup(dom.on(screen.getByTestId('item'), 'animatein', cb));
        await waitFor(() => {
            expect(cb).toBeCalledTimes(1);
        });
        unmount();
    });
});

describe('FlyoutMixin', () => {
    it('should set is-flyout attributes', async () => {
        const Component = function () {
            const mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('is-flyout', '');
        unmount();
    });

    it('should set animate-* attributes when withEffects is called', async () => {
        const Component = function () {
            const mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin.withEffects('fade-in', 'slide-up'))}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('animate-on', 'open');
        expect(div).toHaveAttribute('animate-in', 'fade-in slide-up');
        expect(div).toHaveAttribute('animate-out', '');
        unmount();
    });

    it('should invoke and pass value onOpen handler when flyout is opened', async () => {
        const cb = mockFn();
        const Component = function () {
            const mixin = useFlyoutMixin();
            useEffect(() => mixin.onOpen(cb), [mixin]);
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        await after(() => void openFlyout(div, 'foo'));
        expect(div).toHaveClassName('open');
        verifyCalls(cb, [
            ['foo']
        ]);
        unmount();
    });

    it('should open flyout and pass value to onOpen handler', async () => {
        let mixin;
        const cb = mockFn();
        const Component = function () {
            mixin = useFlyoutMixin();
            useEffect(() => mixin.onOpen(cb), [mixin]);
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        await after(() => void mixin.open('foo'));
        expect(div).toHaveClassName('open');
        verifyCalls(cb, [
            ['foo']
        ]);
        unmount();
    });

    it('should not leak value to subsequent open', async () => {
        let mixin;
        const cb = mockFn();
        const Component = function () {
            mixin = useFlyoutMixin();
            useEffect(() => mixin.onOpen(cb), [mixin]);
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        await after(() => void mixin.open('foo'));
        await mixin.close();
        verifyCalls(cb, [['foo']]);
        cb.mockClear();

        await after(() => void openFlyout(div));
        verifyCalls(cb, [[undefined]]);
        cb.mockClear();

        await after(() => void mixin.open('bar'));
        expect(cb).not.toBeCalled();

        await mixin.close();
        await after(() => void openFlyout(div));
        verifyCalls(cb, [[undefined]]);
        unmount();
    });

    it('should close flyout and pass value to promise', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { unmount } = render(<Component />);
        const promise = mixin.open();

        await delay(0);
        mixin.close('foo');
        await expect(promise).resolves.toBe('foo');
        unmount();
    });

    it('should set visible and invoke onVisibilityChanged handler at correct timing', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin.withEffects('fade-in'))} custom-anim="">test</div>);
        };
        const { unmount } = render(<Component />);
        const cb = mockFn();
        mixin.onVisibilityChanged(cb);
        mixin.open();
        expect(mixin.visible).toBe(true);
        expect(cb).not.toBeCalled();

        await delay(0);
        expect(cb).toBeCalledWith(true, false, _, _);

        await delay(100);
        mixin.close();

        await delay(0);
        expect(customAnimateOut).toBeCalled();
        expect(mixin.visible).toBe(true);
        expect(cb).toBeCalledTimes(1);

        await customAnimateOut.mock.results[0].value;
        await delay(0);
        expect(mixin.visible).toBe(false);
        expect(cb).toBeCalledWith(false, true, _, _);
        unmount();
    });

    it('should set animating to true during animation', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin.withEffects('fade-in'))} custom-anim="">test</div>);
        };
        const { unmount } = render(<Component />);
        const animationcomplete = mockFn();
        cleanup(dom.on(mixin.elements()[0], 'animationcomplete', animationcomplete));

        mixin.open();
        expect(customAnimateIn).toBeCalledTimes(1);
        expect(mixin.animating).toBe(true);

        await customAnimateIn.mock.results[0].value;
        await delay(0);
        expect(mixin.animating).toBe(false);
        expect(animationcomplete).toBeCalledTimes(1);
        unmount();
    });

    it('should set initial focus to specified element', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin({ initialFocus: '.item' });
            return (<div {...Mixin.use(mixin)}><button></button><div className="item"></div></div>);
        };
        const { container, unmount } = render(<Component />);
        await after(() => void mixin.open());
        expect(dom.activeElement).toBe(container.querySelector('.item'));
        unmount();
    });

    it('should not have flyout closed upon focus leaving when closeOnBlur option is set to false', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin({ closeOnBlur: false });
            return (<div {...Mixin.use(mixin)}><button data-testid="button"></button></div>);
        };
        const { unmount } = render(<Component />);
        const flyout = mixin.elements()[0];

        await after(() => void mixin.open());
        expect(isFlyoutOpen(flyout)).toBe(true);

        await after(() => dom.focus(root));
        expect(isFlyoutOpen(flyout)).toBe(true);
        unmount();
    });
});

describe('FlyoutToggleMixin', () => {
    it('should toggle flyout by clicking element', async () => {
        const Component = function () {
            const mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin)}><button {...Mixin.use(mixin.toggle)}>test</button></div>);
        };
        const { container, unmount, getByRole } = render(<Component />);
        const div = container.firstChild;

        // toggle is ready in next event cycle
        await delay(0);
        fireEvent.click(getByRole('button'));
        expect(div).toHaveClassName('open');
        unmount();
    });

    it('should open flyout and pass value to onOpen handler', async () => {
        let mixin;
        const cb = mockFn();
        const Component = function () {
            mixin = useFlyoutMixin();
            useEffect(() => mixin.onOpen(cb), [mixin]);
            return (<div {...Mixin.use(mixin)}><button {...Mixin.use(mixin.toggle)}>test</button></div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        // toggle is ready in next event cycle
        await delay(0);
        await after(() => void mixin.toggle.open('foo'));

        expect(div).toHaveClassName('open');
        verifyCalls(cb, [
            ['foo']
        ]);
        unmount();
    });

    it('should close flyout and pass value to promise', async () => {
        let mixin, promise;
        const Component = function () {
            mixin = useFlyoutMixin();
            return (<div {...Mixin.use(mixin)}><button {...Mixin.use(mixin.toggle)}>test</button></div>);
        };
        const { unmount } = render(<Component />);

        // toggle is ready in next event cycle
        await delay(0);
        promise = mixin.toggle.open();

        await delay(0);
        mixin.toggle.close('foo');
        await expect(promise).resolves.toBe('foo');
        unmount();
    });

    it('should set initial focus to specified element', async () => {
        let mixin;
        const Component = function () {
            mixin = useFlyoutMixin({ initialFocus: '.item' });
            return (<>
                <div {...Mixin.use(mixin)}><div className="item"></div></div>
                <button {...Mixin.use(mixin.toggle)}></button>
            </>);
        };
        const { container, unmount, getByRole } = render(<Component />);

        // toggle is ready in next event cycle
        await delay(0);
        await after(() => fireEvent.click(getByRole('button')));
        expect(dom.activeElement).toBe(container.querySelector('.item'));
        unmount();
    });
});

describe('FocusStateMixin', () => {
    it('should toggle focused class', async () => {
        const Component = function () {
            return (<div {...Mixin.use(useFocusStateMixin())}>test</div>);
        };
        const { container, rerender, unmount } = render(<Component />);
        const div = container.firstChild;

        dom.focus(div);
        expect(div).toHaveClassName('focused');
        expect(div).toHaveClassName('focused-script');

        rerender(<Component />);
        expect(div).toHaveClassName('focused');
        expect(div).toHaveClassName('focused-script');

        dom.focus(dom.root);
        expect(div).not.toHaveClassName('focused');
        expect(div).not.toHaveClassName('focused-script');

        rerender(<Component />);
        expect(div).not.toHaveClassName('focused');
        expect(div).not.toHaveClassName('focused-script');
        unmount();
    });

    it('should synchronize focus state for target element by selector', () => {
        const Component = function () {
            return (
                <div {...Mixin.use(useFocusStateMixin().for('[data-testid="target"]'))}>
                    <div data-testid="target"></div>
                </div>
            );
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;
        const target = screen.getByTestId('target');

        dom.focus(div);
        expect(dom.activeElement).toBe(target);
        expect(div).toHaveClassName('focused');

        dom.blur(target);
        expect(dom.activeElement).toBe(div.parentElement);
        expect(div).not.toHaveClassName('focused');
        unmount();
    });

    it('should synchronize focus state for target element by ref', () => {
        const Component = function () {
            const ref = useRef();
            return (
                <div {...Mixin.use(useFocusStateMixin().for(ref))}>
                    <div ref={ref} data-testid="target"></div>
                </div>
            );
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;
        const target = screen.getByTestId('target');

        dom.focus(div);
        expect(dom.activeElement).toBe(target);
        expect(div).toHaveClassName('focused');

        dom.blur(target);
        expect(dom.activeElement).toBe(div.parentElement);
        expect(div).not.toHaveClassName('focused');
        unmount();
    });
});

describe('LoadingStateMixin', () => {
    it('should toggle loading class', async () => {
        const Component = function () {
            return (<div {...Mixin.use(useLoadingStateMixin())}>test</div>);
        };
        const { container, rerender, unmount } = render(<Component />);
        const div = container.firstChild;

        const promise = delay(100);
        dom.notifyAsync(div, promise);
        expect(div).toHaveClassName('loading');

        rerender(<Component />);
        expect(div).toHaveClassName('loading');

        await promise;
        await delay(0);
        expect(div).not.toHaveClassName('loading');

        rerender(<Component />);
        expect(div).not.toHaveClassName('loading');
        unmount();
    });

    it('should remove loading class when operation is cancelled', async () => {
        const Component = function () {
            return (<div {...Mixin.use(useLoadingStateMixin())}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        const promise = delay(100);
        dom.notifyAsync(div, promise);
        expect(div).toHaveClassName('loading');

        await dom.cancelLock(div);
        expect(div).not.toHaveClassName('loading');
        unmount();
    });

    it('should set loading property', async () => {
        let loadingState;
        const Component = function () {
            loadingState = useLoadingStateMixin();
            return (<>
                <div {...Mixin.use(loadingState)}>test</div>
                <div {...Mixin.use(loadingState)}>test</div>
            </>);
        };
        const { container, unmount } = render(<Component />);
        const div1 = container.firstChild;
        const div2 = container.lastChild;
        expect(loadingState.loading).toBe(false);

        const promise1 = delay(100);
        const promise2 = delay(200);
        dom.notifyAsync(div1, promise1);
        expect(loadingState.loading).toBe(true);
        dom.notifyAsync(div2, promise2);
        expect(loadingState.loading).toBe(true);

        await promise1;
        await 0;
        expect(loadingState.loading).toBe(true);
        await promise2;
        await 0;
        expect(loadingState.loading).toBe(false);
        unmount();
    });
});

describe('ScrollIntoViewMixin', () => {
    it('should scroll element into view when dependency list changes', async () => {
        const Component = function ({ deps }) {
            const mixin = useMixin(ScrollIntoViewMixinImpl);
            return (<div {...Mixin.use(mixin.when(deps))}>test</div>);
        };
        const { container, rerender, unmount } = render(<Component deps={[1]} />);
        await delay(0);
        expect(ScrollIntoViewMixinImpl.callback).not.toBeCalled();

        rerender(<Component deps={[2]} />);
        await delay(0);
        expect(ScrollIntoViewMixinImpl.callback).toBeCalledWith(container.firstChild);

        ScrollIntoViewMixinImpl.callback.mockClear();
        rerender(<Component deps={[2]} />);
        await delay(0);
        expect(ScrollIntoViewMixinImpl.callback).not.toBeCalled();
        unmount();
    });

    it('should scroll element into view when flag changed from false to true', async () => {
        const Component = function ({ index }) {
            const mixin = useMixin(ScrollIntoViewMixinImpl);
            return (<>
                {' '.repeat(3).split('').map((v, i) => (
                    <div {...Mixin.use(mixin.when(index === i))}>test</div>
                ))}
            </>);
        };
        const { container, rerender, unmount } = render(<Component index={0} />);
        await delay(0);
        expect(ScrollIntoViewMixinImpl.callback).not.toBeCalled();

        rerender(<Component index={1} />);
        await delay(0);
        expect(ScrollIntoViewMixinImpl.callback).toBeCalledWith(container.children[1]);
        unmount();
    });
});

describe('ScrollableMixin', () => {
    it('should set scrollable attributes', async () => {
        const Component = function () {
            const mixin = useScrollableMixin();
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        expect(div).toHaveAttribute('scrollable');
        unmount();
    });
});

describe('UnmanagedClassNameMixin', () => {
    it('should restore target classes', async () => {
        const Component = function ({ value }) {
            const mixin = useUnmanagedClassNameMixin();
            return (<div {...Mixin.use(mixin.memorize('class-1'), classNames({ [value]: true }))}>test</div>);
        };
        const { container, rerender, unmount } = render(<Component value="foo" />);
        const div = container.firstChild;
        await after(() => {
            div.classList.add('class-1');
            div.classList.add('class-2');
        });
        rerender(<Component value="bar" />);
        expect(div).toHaveClassName('class-1');
        expect(div).not.toHaveClassName('class-2');
        unmount();
    });
});

describe('ClassNameToggleMixin', () => {
    it('should set target classes', () => {
        let mixin;
        const Component = function ({ value }) {
            mixin = useClassNameToggleMixin({});
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, rerender, unmount } = render(<Component value={1} />);
        const div = container.firstChild;
        expect(div).not.toHaveClassName('class-1');

        mixin.set('class-1', true);
        expect(div).toHaveClassName('class-1');
        rerender(<Component value={2} />);
        expect(div).toHaveClassName('class-1');

        mixin.set('class-1', false);
        expect(div).not.toHaveClassName('class-1');
        rerender(<Component value={3} />);
        expect(div).not.toHaveClassName('class-1');
        unmount();
    });

    it('should set target classes initially', () => {
        const Component = function () {
            const mixin = useClassNameToggleMixin({ foo: true, bar: false });
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;
        expect(div).toHaveClassName('foo');
        expect(div).not.toHaveClassName('bar');
        unmount();
    });
});
