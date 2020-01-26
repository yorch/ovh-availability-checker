module.exports = {
    arrowParens: 'always',
    bracketSpacing: true,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 4,
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2
            }
        }
    ]
};
