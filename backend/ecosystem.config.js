module.exports = {
    apps: [
        {
            name: 'app',
            script: './dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
