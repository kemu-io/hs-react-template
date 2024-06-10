import React from 'react'
import { CustomWidgetProps, createWidgetUI } from '@kemu-io/hs-react'
import packageJson from '../package.json';

interface Props extends CustomWidgetProps {

}

const WidgetUI = (props: Props) => {
  console.log("Props: ", props)

  return (
    <div>
      <h1>WidgetUI</h1>
    </div>
  )
}

export default createWidgetUI(WidgetUI, packageJson.name, packageJson.version);
