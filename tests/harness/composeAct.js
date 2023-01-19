export default function composeAct(act) {
    return {
        actAndReturn(callback) {
            var result;
            act(() => {
                result = callback();
            });
            return result;
        },
        async actAwaitSetImmediate(callback) {
            await act(async () => {
                callback();
                // ensure act() extends after next setImmediate callback
                await new Promise(resolve => resolve());
            });
        }
    };
}
