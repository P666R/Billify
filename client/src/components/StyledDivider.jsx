import { Divider, styled } from '@mui/material';

const DividerStyle = styled(Divider)({
  width: '50%',
  marginTop: '10px',
  marginBottom: '15px',
  marginLeft: 'auto',
  marginRight: 'auto',
  height: '3px',
  backgroundImage:
    'linear-gradient(to right,rgba(0,0,0,0), rgba(9,84,132,0), rgba(0,0,0,0))',
});

export const StyledDivider = () => {
  return <DividerStyle />;
};
