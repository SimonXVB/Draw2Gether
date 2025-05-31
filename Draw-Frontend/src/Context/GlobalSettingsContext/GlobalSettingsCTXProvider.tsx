import { useState } from "react"
import { globalSettingsCTX, type globalSettingsInterface } from "./globalSettingsCTX"

export function GlobalSettingsCTXProvider({children}: {children: React.ReactNode}) {
    const [globalSettings, setGlobalSettings] = useState<globalSettingsInterface>({
        color: "#000000",
        size: 10,
        mode: "draw"
    });

    return (
        <globalSettingsCTX.Provider value={{globalSettings, setGlobalSettings}}>
            {children}
        </globalSettingsCTX.Provider>
    )
};