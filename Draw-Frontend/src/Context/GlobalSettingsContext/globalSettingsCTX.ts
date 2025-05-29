import { createContext, type Dispatch, type SetStateAction } from "react";

type modeType = "draw" | "erase";

export interface globalSettingsInterface {
    color: string,
    size: number,
    mode: modeType,
    isJoined: boolean
};

interface globalSettingsCTXInterface {
    globalSettings: globalSettingsInterface,
    setGlobalSettings: Dispatch<SetStateAction<globalSettingsInterface>>
};

export const globalSettingsCTX = createContext<globalSettingsCTXInterface>({} as globalSettingsCTXInterface);