import { createContext, useContext, useState } from 'react'

export const FlogContext = createContext()

export const useFlog = () => useContext(FlogContext)

export const FlogProvider = ({ children, verbose = true }) => {
  let [logs, setLogs] = useState([])
  let [currentLevel, setCurrentLevel] = useState('App')
  let [isVerbose, setIsVerbose] = useState(verbose)
  let underfindCount = 0

  const makeLogObj = (message = '', type = 'message') => {
    const logObj = {
      type: type,
      level: currentLevel,
      message: message,
    }
  }

  const output = (logObj) => {
    let log = ''
    console.log('(hooks) flog > Verbose: ', isVerbose)
    if (isVerbose) {
      switch (logObj.type) {
        case 'message':
          log = `& Flog: `
          break;
        case 'warning':
          log = `& Flog: `
          break;
        case 'error':
          log = '& Flog: '
          break;
        case 'level':
          log = '^ '
          break;
        default:
          log = '& Flog: '
      }

      log = log + `${logObj.message}`
      console.log(log)
    }
  }

  const handleLog = (logObj) => {
    if (!logObj) return;
    setLogs([...logs, logObj])
    output(logObj)
  }

  const log = (message, type = 'message') => {
    handleLog(makeLogObj(message, type))
  }

  const level = (leveName) => {
    if (!levelName) levelName = `Undefined Level ${undefinedCount}`
    undefinedCount++

    const logObj = makeLogObj(message, 'level')

    handleLog(logObj)
  }

  const message = (levelMessage = 'Undefined Message') => {
    const logObj = { type: 'message', log: message ? message : `${levelMessage}` }
    handleLog(logObj)
  }

  const warning = (levelMessage = 'Undefined Warning') => {
    const logObj = { type: 'warning', log: message ? message : `${levelMessage}` }
    handleLog(logObj)
  }

  const error = (levelMessage = 'Undefined Error') => {
    const logObj = { type: 'error', log: message ? message : `${levelMessage}` }
    handleLog(logObj)
  }

  const ctx = { level, message, warning, error, log }

  return (
    <FlogContext.Provider value={ctx}>
      {children}
    </FlogContext.Provider>
  )
}
