module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs'
      }
    }]
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.ts'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
