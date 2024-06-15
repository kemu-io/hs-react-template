/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CustomWidgetProps, createWidgetUI, components } from '@kemu-io/hs-react';
import packageJson from '../package.json';

const { WidgetContainer } = components;

const WidgetUI = (props: CustomWidgetProps) => {
  console.log('Rendered: ', props);
  return (
    <WidgetContainer {...props}>
      <button>Click Me</button>
    </WidgetContainer>
  );
};

export default createWidgetUI(WidgetUI, packageJson.name, packageJson.version);
