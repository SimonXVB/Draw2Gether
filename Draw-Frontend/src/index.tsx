import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './main';
import { TransformCTXProvider } from "./Context/TransformContext/TransformCTXProvider"
import { GlobalSettingsCTXProvider } from "./Context/GlobalSettingsContext/GlobalSettingsCTXProvider"
import { DrawingCTXProvider } from "./Context/DrawingContext/DrawingCTXProvider"
import { ClientDataCTXProvider } from './Context/ClientDataContext/ClientDataCTXProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientDataCTXProvider>
    <TransformCTXProvider>
    <GlobalSettingsCTXProvider>
    <DrawingCTXProvider>
      <Main/>
    </DrawingCTXProvider>
    </GlobalSettingsCTXProvider>
    </TransformCTXProvider>
    </ClientDataCTXProvider>
  </StrictMode>
);