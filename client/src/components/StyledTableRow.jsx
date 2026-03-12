import { styled, TableRow } from '@mui/material';

const TableRowStyled = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StyledTableRow = (
  { children } // NOSONAR
) => {
  return <TableRowStyled>{children}</TableRowStyled>;
};
