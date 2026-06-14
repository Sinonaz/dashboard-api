import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest/presets/default-esm',
	testPathIgnorePatterns: ['/dist/'],
	moduleNameMapper: {
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					allowJs: true,
					module: 'esnext',
					moduleResolution: 'bundler',
					verbatimModuleSyntax: false,
				},
				diagnostics: {
					ignoreCodes: [151001],
				},
			},
		],
	},
};

export default config;
