import { waitFor } from "@testing-library/dom";
import { renderHook } from "@testing-library/react-hooks";
import brew from "brew-js/core";
import router from "brew-js/extension/router";
import { createObjectStorage } from "brew-js/util/storage";
import { useRouteState } from "src/hooks";
import { randomId } from "zeta-dom/util";

beforeAll(async () => {
    var sessionId = randomId();
    var stateId = randomId();
    var store = createObjectStorage(sessionStorage, 'brew.router./');
    store.set('g', {});
    store.set('c', stateId);
    store.set('s', [
        [stateId, '/bar', 1, false, null, sessionId],
    ]);
    store.set(stateId, { foo: 'foo' });
    history.replaceState(stateId, '');
});

describe('useRouteState', () => {
    it('should restore value correctly when it is mounted before app ready', async () => {
        brew.with(router)(app => {
            app.useRouter({
                routes: ['/*']
            });
        });
        const { result } = renderHook(() => useRouteState('foo', ''));
        expect(result.current[0]).toBe('');

        await waitFor(() => expect(result.all.length).toBe(2));
        expect(result.current[0]).toBe('foo');
    });
});
