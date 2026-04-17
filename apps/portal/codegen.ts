import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './schema.graphql',
    documents: [
        'src/**/*.tsx',
        '!src/codegen/gql/**/*' // Ignore the output folder
    ],
    generates: {
        './src/codegen/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;