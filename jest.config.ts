// import type { Config } from 'jest';

// const config: Config = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };

// export default config;

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // 🔍 Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/modules/**/services/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // 👮 Limites mínimos (opcional, mas educativo)
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};

export default config;
