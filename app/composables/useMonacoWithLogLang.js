export const useMonacoWithLongLang = () => {
    const monaco = useMonaco();

    const extendDefaults = () => {
        for (let i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }
            for (const key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }
    
    const typeCustomTokenizer = [
        // {name: 'orange-alert', regex: 'WARN', style: {foreground: '#FFA500', fontStyle: 'bold'}},
        // {name: 'red-alert', regex: 'ERROR', style: {foreground: '#FF0000', fontStyle: 'bold'}}
    ];
    
    monaco.languages.register({id: 'log'});
    
    const logCustomRules = [];
    const themeRules = [];
    for (let i = 0; i < typeCustomTokenizer.length; i++) {
        try {
            logCustomRules.push([new RegExp(typeCustomTokenizer[i].regex), typeCustomTokenizer[i].name]);
            themeRules.push(extendDefaults({token: typeCustomTokenizer[i].name + '.log'}, typeCustomTokenizer[i].style));
        } catch (e) {
            console.error("error", e);
        }
    }
    
    monaco.languages.setMonarchTokensProvider('log', {
        defaultToken: "",
        tokenPostfix: ".log",
        tokenizer: {
            root: [
                // Custom rules
                ...logCustomRules,
                // Trace/Verbose
                [/\b(Trace)\b:/, "verbose"],
                // DEBUG
                [/\b(DEBUG|Debug)\b|\b([dD][eE][bB][uU][gG])/, "debug"],
                // INFO
                [
                    /\b(HINT|INFO|INFORMATION|Info|NOTICE|II)\b|\b([iI][nN][fF][oO]|[iI][nN][fF][oO][rR][mM][aA][tT][iI][oO][nN])/,
                    "info"
                ],
                // Android logcat Info
                [/\bI\//, "info"],
                // WARN
                [
                    /\b(WARNING|WARN|Warn|WW)\b|\b([wW][aA][rR][nN][iI][nN][gG])/,
                    "warning"
                ],
                // ERROR
                [
                    /\b(ALERT|CRITICAL|EMERGENCY|ERROR|FAILURE|FAIL|Fatal|FATAL|Error|EE)\b|\b([eE][rR][rR][oO][rR])/,
                    "error"
                ],
                // Serilog ERROR
                [/\[(error|eror|err|er|e|fatal|fatl|ftl|fa|f)\]/i, "error"],
                // Android logcat Error
                [/\bE\//, "error"],
                // ISO dates ("2020-01-01")
                [/\b\d{4}-\d{2}-\d{2}(T|\b)/, "date"],
                // Culture specific dates ("01/01/2020", "01.01.2020")
                [/\b\d{2}[^\w\s]\d{2}[^\w\s]\d{4}\b/, "date"],
                // Clock times with optional timezone ("01:01:01", "01:01:01.001", "01:01:01+01:01")
                [
                    /\d{1,2}:\d{2}(:\d{2}([.,]\d{1,})?)?(Z| ?[+-]\d{1,2}:\d{2})?\b/,
                    "date"
                ],
                // Git commit hashes of length 40, 10, or 7
                [
                    /\b([0-9a-fA-F]{40}|[0-9a-fA-F]{10}|[0-9a-fA-F]{7})\b/,
                    "constant"
                ],
                // Guids
                [
                    /[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}/,
                    "constant"
                ],
                // Constants
                [/\b([0-9]+|true|false|null)\b/, "constant"],
                // String constants
                [/"[^"]*"/, "string"],
                [/(?<![\w])'[^']*'/, "string"],
                // Exception type names
                [/\b([a-zA-Z.]*Exception)\b/, "exceptiontype"],
                // Colorize rows of exception call stacks
                [/^[\t ]*at.*$/, "exception"],
                // Match Urls
                [/\b(http|https|ftp|file):\/\/\S+\b\/?/, "constant"],
                // Match character and . sequences (such as namespaces) as well as file names and extensions (e.g. bar.txt)
                [/(?<![\w/\\])([\w-]+\.)+([\w-])+(?![\w/\\])/, "constant"],
            ]
        }
    });
    
    monaco.editor.defineTheme('william278', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            {token: 'info.log', foreground: '#4b71ca'},
            {token: 'error.log', foreground: '#ff0000', fontStyle: 'bold'},
            {token: 'warning.log', foreground: '#FFA500'},
            {token: 'date.log', foreground: '#008800'},
            {token: 'exceptiontype.log', foreground: '#808080'},
            ...themeRules
        ],
        colors: {
        },
    });
}