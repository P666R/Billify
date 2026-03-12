// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const AuthButtonAnimation = (
  { children } // NOSONAR
) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
      {children}
    </motion.div>
  );
};
