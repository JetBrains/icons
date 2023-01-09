module.exports = {
    plugins:[
        {
            name: 'cleanupIds',
            params: {
                force: true,
                minify: false
            }
        },
        {
            name: 'removeUnknownsAndDefaults',
            params: {
                keepDataAttrs: false
            }
        }
    ]
}
