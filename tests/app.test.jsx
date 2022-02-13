import { act, renderHook } from "@testing-library/react-hooks";
import { app } from "brew-js/app";
import { useAppReady } from "src/hooks";
import { initApp } from "./testUtil";

describe('useAppReady', () => {
    it('should return value indicating whether ready event has been fired', async () => {
        initApp(() => {});

        const { result } = renderHook(() => useAppReady());
        expect(result.current).toBe(false);

        await act(() => app.ready);
        expect(result.current).toBe(true);
    });
});
