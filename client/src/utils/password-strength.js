import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  useLevenshteinDistance: true,
  translations: zxcvbnEnPackage.translations,
};

zxcvbnOptions.setOptions(options);

export const getPasswordResult = (password) => {
  return zxcvbn(password);
};

export const passwordStrength = (password) => {
  const result = zxcvbn(password);
  return result.score >= 3;
};

export const getStrengthUI = (score) => {
  const mapping = {
    0: { label: 'Risky', color: '#D32F2F' },
    1: { label: 'Weak', color: '#EF6C00' },
    2: { label: 'Fair', color: '#F9A825' },
    3: { label: 'Good', color: '#4fbc54' },
    4: { label: 'Strong', color: '#1B5E20' },
  };

  return mapping[score] || { label: 'None', color: '#757575' };
};
