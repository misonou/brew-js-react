import React, { useEffect, useRef, useState } from "react";
import { jest } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { openFlyout } from "brew-js/domAction";
import dom from "zeta-dom/dom";
import { delay, watch } from "zeta-dom/util";
import { AnimateSequenceMixin, ClassNameMixin, FlyoutMixin, useAnimateMixin, useAnimateSequenceMixin, useFlyoutMixin, useFocusStateMixin, useLoadingStateMixin, useMixin, useMixinRef, useScrollableMixin } from "src/mixin";
import Mixin from "src/mixins/Mixin";
import StatefulMixin from "src/mixins/StatefulMixin";
import StaticAttributeMixin from "src/mixins/StaticAttributeMixin";
import { after, mockFn, verifyCalls, _ } from "@misonou/test-utils";
import initAppBeforeAll from "./harness/initAppBeforeAll";

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
    it('should return the same state in canonical order', () => {
        class TestMixin extends StatefulMixin {
            _counter = 0;
            getCustomAttributes() {
                return { 'data-custom': this.state.value };
            }
            initState() {
                return { value: String(++this._counter) };
            }
        }
        const Component = function ({ value }) {
            const mixin = useState(() => new TestMixin())[0].reset();
            return (<>
                <div {...Mixin.use(mixin)}>{value}</div>
                <div {...Mixin.use(mixin)}>{value}</div>
            </>);
        };
        const { asFragment, rerender } = render(<Component value="foo" />);
        expect(asFragment()).toMatchSnapshot();

        rerender(<Component value="bar" />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('ClassNameMixin', () => {
    it('should persist monitored class names in re-render', () => {
        const mixin = new ClassNameMixin(['foo', 'bar']);
        const getClassNames = jest.spyOn(mixin, 'getClassNames');
        const Component = function () {
            mixin.reset();
            return (<div {...Mixin.use(mixin, 'test')}></div>);
        };
        const { container, rerender, unmount } = render(<Component />);
        const div = container.firstChild;
        div.classList.add('foo');
        div.classList.add('bar');
        getClassNames.mockClear();

        rerender(<Component />);
        expect(getClassNames).toBeCalledTimes(1);
        expect(getClassNames.mock.results[0].value).toEqual([{ foo: true, bar: true }]);
        expect(div.classList.contains('foo')).toBe(true);
        expect(div.classList.contains('bar')).toBe(true);
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
            [div, {}, { foo: true, bar: true }]
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

    it('should clone item mixin', () => {
        const mixin = new AnimateSequenceMixin();
        const ref = jest.spyOn(mixin.item, 'ref', 'get');
        expect(mixin.clone().item).not.toBe(mixin.item);
        expect(ref).toBeCalledTimes(1);
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

    it('should invoke onOpen handler when flyout is opened', async () => {
        const cb = mockFn();
        const Component = function () {
            const mixin = useFlyoutMixin();
            useEffect(() => mixin.onOpen(cb), [mixin]);
            return (<div {...Mixin.use(mixin)}>test</div>);
        };
        const { container, unmount } = render(<Component />);
        const div = container.firstChild;

        await after(() => void openFlyout(div));
        expect(div).toHaveClassName('open');
        expect(cb).toBeCalledTimes(1);
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

    it('should clone toggle mixin', () => {
        const mixin = new FlyoutMixin();
        const ref = jest.spyOn(mixin.toggle, 'ref', 'get');
        expect(mixin.clone().toggle).not.toBe(mixin.toggle);
        expect(ref).toBeCalledTimes(1);
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
