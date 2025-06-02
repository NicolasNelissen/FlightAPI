declare const _default: (
  | {
      readonly rules: Readonly<import('eslint').Linter.RulesRecord>;
    }
  | import('@typescript-eslint/utils/dist/ts-eslint').FlatConfig.Config
  | {
      files: string[];
      languageOptions: {
        globals: {
          describe: string;
          test: string;
          expect: string;
          it: string;
          beforeEach: string;
          afterEach: string;
          jest: string;
          process?: undefined;
          Buffer?: undefined;
          __dirname?: undefined;
          __filename?: undefined;
          global?: undefined;
          module?: undefined;
          require?: undefined;
        };
        parser?: undefined;
        parserOptions?: undefined;
      };
      plugins: {
        jest: {
          meta: {
            name: string;
            version: string;
          };
          environments: {
            globals: {
              globals: {
                [key: string]: boolean;
              };
            };
          };
          configs: {
            all: import('eslint').Linter.LegacyConfig;
            recommended: import('eslint').Linter.LegacyConfig;
            style: import('eslint').Linter.LegacyConfig;
            'flat/all': import('eslint').Linter.FlatConfig;
            'flat/recommended': import('eslint').Linter.FlatConfig;
            'flat/style': import('eslint').Linter.FlatConfig;
          };
          rules: {
            [key: string]: import('eslint').Rule.RuleModule;
          };
        };
      };
      rules: {
        'jest/no-disabled-tests': string;
        'jest/no-focused-tests': string;
        'jest/no-identical-title': string;
      };
    }
  | {
      files: string[];
      languageOptions: {
        parser: import('@typescript-eslint/utils/dist/ts-eslint').Parser.LooseParserModule;
        parserOptions: {
          project: string;
          sourceType: string;
          ecmaVersion: string;
        };
        globals: {
          process: string;
          Buffer: string;
          __dirname: string;
          __filename: string;
          global: string;
          module: string;
          require: string;
          describe?: undefined;
          test?: undefined;
          expect?: undefined;
          it?: undefined;
          beforeEach?: undefined;
          afterEach?: undefined;
          jest?: undefined;
        };
      };
      rules: {
        [x: string]: 0 | 'off';
        'jest/no-disabled-tests'?: undefined;
        'jest/no-focused-tests'?: undefined;
        'jest/no-identical-title'?: undefined;
      };
      plugins?: undefined;
    }
)[];
export default _default;
