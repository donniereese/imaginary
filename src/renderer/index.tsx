import { createRoot } from 'react-dom/client';
import App from './App';
import { AppState } from './hooks/state-container'
import { IpcMessages } from './hooks/ipc-messages'
import { EndpointsProvider } from './hooks/endpoints'
import { ResponsesProvider } from './hooks/responses'
import { FlogProvider } from './hooks/flog'

import * as appContainer from './containers/app.container'
import * as endpointsContainer from './containers/endpoints.container'
import * as responsesContainer from './containers/responses.container'

const sendMessage = (topic = 'ipc-example', message = '') => {
  let payload = [topic, message]
  window.electron.ipcRenderer.sendMessage(topic, payload)
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <AppState containers={[
    appContainer,
    endpointsContainer,
    responsesContainer,
  ]}>
    <IpcMessages ipcrenderer={window.electron.ipcrenderer} defaultTopic={[
      'server-event',
      'server-error',
      'app-event',
      'user-event',
      'endpoint-updated',
      'endpoint-added',
      'endpoint-requested',
      'response-added',
      'response-sent',
      'response-updated',
    ]}>
      <FlogProvider verbose={true}>
        <ResponsesProvider sendMessage={(t='ipc-example', v='') => sendMessage(t,v)}>
          <EndpointsProvider sendMessage={(t='ipc-example', v='') => sendMessage(t,v)}>
            <App />
          </EndpointsProvider>
        </ResponsesProvider>
      </FlogProvider>
    </IpcMessages>
  </AppState>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
