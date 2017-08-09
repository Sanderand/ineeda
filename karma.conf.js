module.exports = function (config) {
    config.set({
        files: [
            './src/**/*.ts',
            './test/**/*.ts',
            './node_modules/@types/**/*.ts'
        ],

        frameworks: ['jasmine', 'chai', 'karma-typescript'],
        preprocessors: {
            '**/*.ts': ['karma-typescript'],
        },
        reporters: ['progress', 'karma-typescript'],

        browsers: ['Chrome', 'Firefox', 'Safari'],

        karmaTypescriptConfig: {
            reports: { },
            tsconfig: './tsconfig.json'
        },

        singleRun: true
    });
}
