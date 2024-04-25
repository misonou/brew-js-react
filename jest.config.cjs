const config = {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
        "@misonou/test-utils/mock/console",
        "@misonou/test-utils/mock/performance"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/build/"
    ],
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^react$": "<rootDir>/node_modules/react",
        "^react-dom$": "<rootDir>/node_modules/react-dom"
    },
    "clearMocks": true,
    "extensionsToTreatAsEsm": [
        ".jsx"
    ],
    "collectCoverageFrom": [
        "src/**/*.js",
        "!src/{index,entry}.js",
        "!src/include/**/*"
    ]
}

if (process.env.CI !== 'true' && require('fs').existsSync('../zeta-dom')) {
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "^brew-js/(.*)$": "<rootDir>/../brew-js/src/$1",
        "^zeta-dom/(.*)$": "<rootDir>/../zeta-dom/src/$1",
        "^zeta-dom-react$": "<rootDir>/../zeta-dom-react/src/index",
        "^zeta-dom-react/(.*)$": "<rootDir>/../zeta-dom-react/src/$1"
    };
}
if (process.env.REACT_VERSION) {
    const runtimeDir = `<rootDir>/tests/runtime/react${process.env.REACT_VERSION}`;
    config.cacheDirectory = `${runtimeDir}/.cache`;
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "^react$": `${runtimeDir}/node_modules/react`,
        "^react-dom$": `${runtimeDir}/node_modules/react-dom`
    };
    config.moduleDirectories = [
        `${runtimeDir}/node_modules`,
        "node_modules"
    ];
}
if (process.env.REACT_VERSION === '18') {
    config.moduleNameMapper = {
        ...config.moduleNameMapper,
        "@testing-library/react-hooks": "@misonou/test-utils/polyfill/react18/renderHook"
    };
}

module.exports = config;
