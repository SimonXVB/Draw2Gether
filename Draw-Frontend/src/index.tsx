import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './main';
import { CoordsCTXProvider } from "./Context/CoordsContext/CoordsCTXProvider"
import { GlobalSettingsCTXProvider } from "./Context/GlobalSettingsContext/GlobalSettingsCTXProvider"
import { DrawingCTXProvider } from "./Context/DrawingContext/DrawingCTXProvider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoordsCTXProvider>
    <GlobalSettingsCTXProvider>
    <DrawingCTXProvider>
      <Main/>
    </DrawingCTXProvider>
    </GlobalSettingsCTXProvider>
    </CoordsCTXProvider>
  </StrictMode>
);