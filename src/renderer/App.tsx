import { useState, forwardRef } from 'react'
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useIpcMessages } from './hooks/ipc-messages'
import { useEndpoints } from './hooks/endpoints'
import './App.scss';

import EndpointsView from './views/endpoints.view'

import { Tile, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction, HeaderPanel, Button, InlineNotification, Stack, Content, HeaderMenuButton, HeaderNavigation, HeaderMenuItem } from '@carbon/react'
import { Activity, Notification, Search, Branch, ConnectTarget, Upload, Switcher as SwitcherIcon, ApplicationWeb } from '@carbon/react/icons'

import dottedBG from './assets/dotted-background.svg'

const Hello = () => (
  <div rol='group' aria-label='Status Tiles' style={{ display: 'grid', gridTemplateArea: 'a a', gap: '1rem', gridAutoColumns: '12rem', backgroundImage: `url("${dottedBG}")` }}>
    <Tile name='server-status'>
      <h3>Server Status</h3>
    </Tile>
  </div>
)

const EndpointsList = () => {
  const navigate = useNavigate()
  const { endpoints } = useEndpoints()

  const navigateToEndpointsWithEndpoint = (ep) => navigate(`/endpoints/${ep}`)

  return (
    <>
      <Stack gap={4}>
        {Object.entries(endpoints).length === 0 && (<span>No endpoints</span>)}
        {Object.entries(endpoints).map((endpoint, i) => (
          <div key={`${i}--${endpoint[1].name}`} style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Button
              size='sm'
              kind='ghost'
              onClick={()=>navigateToEndpointsWithEndpoint()}
              style={{
                flexGrow: '1',
                marginRight: '.2rem',
                justifyContent: 'flex-start',
              }}>
              <ConnectTarget size={12} style={{ color: '#0f62fe !important', marginRight: '.4rem' }} />{endpoint[1].name}
            </Button>
            {!endpoint.published && (
              <Button size='sm' renderIcon={Upload} iconDescription='Upload' style={{ flexShrink: '1' }}>Publish</Button>
            )}
          </div>
        ))}
      </Stack>
      <hr style={{ border: '0.0625rem solid #0f62fe', marginTop: '2em', marginBottom: '2rem' }} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <Button kind='secondary' onClick={()=>navigate('/endpoints')}>
          Add New Endpoint
        </Button>
      </div>
    </>
  )
}

const Notifications = () => {
  const { logs } = useIpcMessages()
  console.log('(app) Logs: ', logs)
  return (
    <>
      {logs.length > 0 && logs.map((log, i) => (
        <InlineNotification
          key={`${i}-${Math.floor(log.timestamp / 1000)}`}
          title={log.title}
          subtitle={log.message}
          kind='info'
          hideCloseButton={true}
          style={{ marginBottom: '0.2rem' }}
        />
      ))}
      {logs.length === 0 && (
        <InlineNotification
          title='No Logs'
          subtitle='No logs available'
          kind='info'
          hideCloseButton={true} />
      )}
    </>
  )
}

const AppWrapper = () => {}

const AppNav = () => {
  const [selected, setSelected] = useState(null)
  let navigate = useNavigate()

  const selectHeaderAction = (opt) => {
    const validActions = [ 'search', 'endpoints', 'notifications', 'server-status' ]

    if (selected === opt) {
      setSelected(null)
    } else if (validActions.includes(opt)) {
      setSelected(opt)
    }
  }

  const navigateTo = (r = '/') => navigate(r)

  const expandNavAction = () => {}

  let isNavExpanded = false

  return (
    <Header aria-label="Plum - Mock Manager">
      <HeaderMenuButton
        aria-label='Open menu'
        onClick={expandNavAction}
        isActive={isNavExpanded}
      />
      <HeaderName href="#" prefix="Plum" onClick={() => navigateTo('/')}>PLUM</HeaderName>
      <HeaderNavigation aria-label='Plum'>
        <HeaderMenuItem href='#' onClick={() => navigateTo('/endpoints')}>Endpoints</HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label='Search'
          isActive={selected === 'search'}
          onClick={() => selectHeaderAction('search')}>
          <Search size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label='Endpoints'
          isActive={selected === 'endpoints'}
          onClick={() => selectHeaderAction('endpoints')}>
          <Branch size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label='Notifications'
          isActive={selected === 'notifications'}
          onClick={() => selectHeaderAction('notifications')}>
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          className={`server_status__green${selected === 'server-status' ? '__selected' : ''}`}
          aria-label='Server Status'
          isActive={selected === 'server-status'}
          tooltipAlignment='start'
          onClick={() => selectHeaderAction('server-status')}>
          <Activity size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
      <HeaderPanel aria-label='Header Panel' expanded={selected !== null}>
        <div style={{ padding: '1rem .6rem', }}>
          {selected === 'notifications' && (<Notifications />)}
          {selected === 'endpoints' && (<EndpointsList />)}
        </div>
      </HeaderPanel>
    </Header>
  )
}

export default function App() {
  return (
    <Router>
      <AppNav />
      <Content>
        <Routes>
          <Route path='/' element={<Hello />} />
          <Route path='/endpoints' element={<EndpointsView />} />
          <Route path='/endpoints/:selectedEndpoint' element={<EndpointsView />} />
        </Routes>
      </Content>
    </Router>
  );
}
