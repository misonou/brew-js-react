import { act, renderHook } from "@testing-library/react-hooks";
import brew from "brew-js/core";
import { useAppReady } from "src/hooks";

describe('useAppReady', () => {
    it('should return value indicating whether ready event has been fired', async () => {
        const app = brew(() => { });

        const { result } = renderHook(() => useAppReady());
        expect(result.current).toBe(false);

        await act(async () => void await app.ready);
        expect(result.current).toBe(true);
    });
});
