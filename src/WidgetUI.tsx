import React from 'react';
import { CustomWidgetProps, createWidgetUI } from '@kemu-io/hs-react';
import styled from '@emotion/styled';
import packageJson from '../package.json';

interface Props extends CustomWidgetProps {

}

const WidgetWrapper = styled.div`
  width: 62px;
  height: 54px;
  background-color: #68bb6c;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  border-radius: 8px;
`;

const WidgetUI = (props: Props) => {
  console.log('Props: ', props);

  return (
    <WidgetWrapper>
      <button>Click Me</button>
    </WidgetWrapper>
  );
};

export default createWidgetUI(WidgetUI, packageJson.name, packageJson.version);
