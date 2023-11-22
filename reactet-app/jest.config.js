module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  resolver: 'jest-pnp-resolver',
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}'
  ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(tsx|ts)?$': 'ts-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.js'
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    '<rootDir>/node_modules/(?!(lodash-es))'
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(scss|less|css)$': 'identity-obj-proxy',
    '^containers(.*)$': '<rootDir>/src/containers$1',
    '^store(.*)$': '<rootDir>/src/store$1',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^pages(.*)$': '<rootDir>/src/pages$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^style(.*)$': '<rootDir>/src/style$1',
    '^assets(.*)$': '<rootDir>/src/assets$1',
    '^hooks(.*)$': '<rootDir>/src/hooks$1',
    '^server(.*)$': '<rootDir>/src/server$1',
    '^locales(.*)$': '<rootDir>/src/locales$1',
    '^native(.*)$': '<rootDir>/src/native$1',
    '^static-extend$': '<rootDir>/node_modules/static-extend/index.js',
    '^static(.*)$': '<rootDir>/src/static$1'
  },
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node'
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
