module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': '<rootDir>/test-utils/lucide-react-mock.js',
    '^lucide-react/(.*)$': '<rootDir>/test-utils/lucide-react-mock.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
