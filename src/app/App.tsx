import { Typography } from 'antd';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import styled from 'styled-components';
import { colors } from '../shared/SharedUtils';
import Logo from './logo.png';
import Taskboard from '../taskboard/Taskboard';

const StyledLayout = styled(Layout)`
  /* We can't use "height: 100vh; width: 100vw;" here.
  Otherwise, when there is a horizontal scrollbar etc, 
  because that we set a constant height, there will be a vertical one too.  */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  background-color: #fff;
  padding-top: 1em;
  padding-left: 0;
`;

const StyledContent = styled(Content)`
  background-color: ${colors.primary[6]};
`;

function App() {
  return (
    <StyledLayout>
      <StyledHeader>
        <img
          src={Logo}
          style={{ height: '50px', padding: '0 1em 1em 1em' }}
          alt="pearson logo"
        />
        <Typography.Title level={3} type="secondary">
          Prizm Retrospective Board
        </Typography.Title>
      </StyledHeader>
      <StyledContent>
        <Taskboard />
      </StyledContent>
    </StyledLayout>
  );
}

export default App;
