import { useRef } from "react";
import { transformCTX, type transformInterface } from "./transformCtx";

export function TransformCTXProvider({ children }: { children: React.ReactNode }) {
    const transform = useRef<transformInterface>({
        x: 0,
        y: 0,
        scale: 1
    });

    return (
        <transformCTX.Provider value={transform.current}>
            {children}
        </transformCTX.Provider>
    )
};