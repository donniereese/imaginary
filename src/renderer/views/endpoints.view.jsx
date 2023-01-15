import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextArea, TextInput, Dropdown, ButtonSet, Button, Checkbox } from '@carbon/react'
import { ProgressBarRound } from '@carbon/react/icons'
import { useResponses } from '../hooks/responses'
import { useEndpoints } from '../hooks/endpoints'
import { useFlog } from '../hooks/flog'
import { useContainer as useEndpointsContainer } from '../containers/endpoints.container'

const EndpointsView = () => {
  const navigate = useNavigate()
  const { containerState: responseState, resolveEffect } = useEndpointsContainer()
  const { responses, makeResponseObject } = useResponses()
  const { addEndpoint } = useEndpoints()
  const { log, level } = useFlog()

  const [selectedResponse, setSelectedResponse] = useState({ ...makeResponseObject(), name: 'None' })
  const [selectedResponseType, setSelectedResponseType] = useState({ type: selectedResponse.type })
  const [endpointValue, setEndpointValue] = useState('')
  const [shouldPublish, setShouldPublish] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [saving, setSaving] = useState(false)

  const responseTypes = ['Plain Text', 'json', 'xml']

  const onEndpointChange = (event) => setEndpoiontValue(event.target.value);

  const onNameChange = (event) => setNameValue(event.target.value);

  const onResponseSelection = (res) => {
    setSelectedResponse(res.selectedItem)
    setSelectedResponseType({ type: res.selectedItem.type })
  }

  const onResponseTypeSelection = (res) => {
    if (selectedResponse.type === 'Custom')
      setSelectedResponseType(res.selectedItem)
  }

  const isEditableResponse = () => (selectedResponse.name === 'Custom') ? false : true;

  const isSaveDisabled = () => {
    if (!endpointValue) return true;
    if (endpointValue.length <= 0) return true;
    if (saving) return true;

    return false;
  }

  const changePublishOption = (e) => setShouldPublish(!!e.target.checked)

  const onSaveAction = () => {
    console.log('(views) endpoints > onSaveAction')

    const tempEndpoint = {
      ...makeResponseObject(),
      endpoint: endpointValue,
      name: nameValue,
      published: false,
      enabled: false
    }

    console.log('(views) endpoints tempEndpoint = ', tempEndpoint)
    console.log('(views) endpoints selectedResponse = ', selectedResponse)

    if (selectedResponse.name === 'None') {
      tempEndpoint.customResponse = ''
    } else if (selectedResponse.name === 'Custom') {
      tempEndpoint.customResponse = selectedresponse.response
    } else {
      tempEndpoint.responseIdent = selectedResponse.name
    }

    addEndpoint(tempEndpoint, setShouldPublish)
    navigate('/')
  }

  return (
    <div className={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TextInput
        id="endpoints-name"
        type="text"
        labelText="User Friendly Name"
        helperText="A name for reference"
        placeholder="Example Endpoint..."
        onChange={(v) => onNameChange(v)}
        value={nameValue}
      />
      <TextInput
        id="endpoints-endpoint"
        type="text"
        labelText="Endpoint"
        helperText="Required endpoint to mock"
        placeholder="/example..."
        onChange={(v) => onEndpointChange(v)}
        value={endpointValue}
      />
      <hr style={{ border: '0.0625rem solid #0f62fe', marginTop: '2em', marginBottom: '2em' }} />
      <Dropdown
        id="default"
        titletext="Response"
        helperText="Optional Response"
        label="Dropdown menu options"
        onChange={(v) => onResponseSelection(v)}
        selectedItem={selectedResponse}
        items={[
          { ...makeResponseObject(), name: 'None' },
          ...Object.values(responses),
          { ...makeResponseObject(), name: 'Custom' },
        ]}
      />
      <TextArea
        labelText="Response Body"
        helperText="Response Body to return for endpoint"
        cols={50}
        rows={8}
        id="text-area-1"
        disabled={isEditableResponse()}
        value={selectedResponse.response}
        className={'fullwidth-stretch'}
      />
      <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'rows' }}>
        <div style={{ marginRight: '2rem', width: '25%', minWidth: '16rem' }}>
          <Dropdown
            id="default"
            titleText="Response Type"
            helperText="Type of response"
            label="Response Type"
            size="sm"
            onChange={(v) => onResponseTypeSelection(v)}
            selectedItem={selectedResponseType}
            items={responseTypes}
            itemToString={(rt) => {
              if (!rt) return 'Invalid Type'
              return (rt.type ? rt.type : rt)
            }}
            disabled={isEditableResponse()}
          />
        </div>
        <div>
          <legend style={{
            fontSize: '0.75rem',
            letterSpacing: '0.32px',
            marginBottom: '0.5rem',
            color: '#525252',
            fontWeight: '400',
            lineHeight: '1rem',
            verticalAlign: 'baseline',
          }}>Automatically Publish</legend>
          <Checkbox labelText={'Publish'} id="checkbox-label-2" checked={shouldPublish} onChange={(e) => changePublishOption(e)} />
        </div>
      </div>
      <ButtonSet style={{ marginTop: '1rem' }}>
        <Button disabled={saving} kind='secondary'>Cancel</Button>
        <Button
          kind='primary'
          iconDescription='Saving'
          renderIcon={saving ? ProgressBarRound : null}
          disabled={isSaveDisabled()}
          onClick={() => onSaveAction()}>Save</Button>
      </ButtonSet>
    </div>
  )
}

export default EndpointsView;
