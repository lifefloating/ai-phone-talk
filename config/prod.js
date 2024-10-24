const db = 'test'
module.exports = {
    port: 3083,
    debug: false,
    mongodb: ``,
    openai: {
        openai_api_key: '',
    },
    twilio: {
        twilio_account_sid: '',
        twilio_auth_token: '',
        twilio_phone_number: '',
    },
    logger: {
        pm2: true,
        pm2InstanceVar: "INSTANCE_ID",
        appenders: {
            out: {
                type: "stdout",
                layout: {
                type: "pattern",
                pattern: "%[%d %h %p %z %f %l - %m%]",
                tokens: "stdout"
                }
            },
            task: {
                type: "file",
                pattern: "-yyyy-MM-dd.log",
                layout: {
                type: "pattern",
                pattern: "%[%d %h %p %z %f %l - %m%]",
                tokens: "printout"
                },
                maxLogSize: 1073741824,
                backups: 80
            }
        },
        categories: {
            default: {
                appenders: [
                "out"
                ],
                level: "debug",
                enableCallStack: true
            },
            file: {
                "appenders": [
                "task"
                ],
                level: "info"
            }
        }
    },
    // 固定日志位置
    logpath: '/data/minitest/logs',
    env: 'prod'
}
