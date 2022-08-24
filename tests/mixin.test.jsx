import React, { useState } from "react";
import { jest } from "@jest/globals";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { delay, watch } from "zeta-dom/util";
import { ClassNameMixin, useMixin, useMixinRef } from "src/mixin";
import Mixin from "src/mixins/Mixin";
import StatefulMixin from "src/mixins/StatefulMixin";
import StaticAttributeMixin from "src/mixins/StaticAttributeMixin";
import { initApp, mockFn, verifyCalls, _ } from "./testUtil";

beforeAll(async () => {
    await initApp();
});

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
    it('should flush changes on observable property synchronously when disposed', () => {
        class TestMixin extends StatefulMixin {
            prop = 1;
        }
        const cb = mockFn();
        const { result, unmount } = renderHook(() => useMixin(TestMixin));

        watch(result.current, 'prop', cb);
        result.current.prop = 2;
        expect(cb).not.toBeCalled();
        unmount();
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
