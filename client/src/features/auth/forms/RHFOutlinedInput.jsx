import { Controller } from 'react-hook-form';
import { Box, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { fluidType } from '../../../customTheme';

export const RHFOutlinedInput = (
  { name, control, label, ...rest } // NOSONAR
) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <Box
        sx={{
          display: 'grid',
          gap: '0.1rem',
          mb: error ? '0.2rem' : '0.1rem',
          transition: 'margin 0.2s ease',
        }}
      >
        <InputLabel
          htmlFor={`${name}-signup`}
          error={!!error}
          sx={{ fontSize: fluidType(10, 12), fontWeight: 500 }}
        >
          {label}
        </InputLabel>

        <OutlinedInput
          id={`${name}-signup`}
          {...field}
          {...rest}
          error={!!error}
          size="small"
          sx={{ fontSize: fluidType(10, 12), borderRadius: '8px' }}
        />

        <Box
          sx={{
            height: error ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'height 0.2s ease-out',
          }}
        >
          {error && (
            <FormHelperText error sx={{ m: 0, fontSize: fluidType(8, 9) }}>
              {error.message}
            </FormHelperText>
          )}
        </Box>
      </Box>
    )}
  />
);
