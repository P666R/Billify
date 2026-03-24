import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { fluidType } from '../../../customTheme';
import { getStrengthUI } from '../../../utils/password-strength';
import { usePasswordStrength } from '../../../hooks/usePasswordStrength';

export const PasswordStrengthIndicator = (
  { password } // NOSONAR
) => {
  const passwordResult = usePasswordStrength(password);
  const level = passwordResult ? getStrengthUI(passwordResult.score) : null;

  if (!passwordResult || !level) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        mt: '0.4rem',
        borderRadius: '8px',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={(passwordResult.score + 1) * 20}
        sx={{
          height: '.4rem',
          borderRadius: '10px',
          bgcolor: 'grey.300',
          '& .MuiLinearProgress-bar': { bgcolor: level.color },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          fontSize: fluidType(9, 10),
          color: level.color,
          fontWeight: 700,
        }}
      >
        Strength: {level.label}
      </Typography>

      {passwordResult.feedback?.suggestions?.length > 0 && (
        <Stack spacing={0.25} component="ul" sx={{ pl: '1.2rem', m: 0 }}>
          {passwordResult.feedback.suggestions.map((suggestion, idx) => (
            <Typography
              key={idx + 1}
              variant="caption"
              component="li"
              color="text.secondary"
              sx={{ fontSize: fluidType(8, 9) }}
            >
              {suggestion}
            </Typography>
          ))}
        </Stack>
      )}
    </Box>
  );
};
