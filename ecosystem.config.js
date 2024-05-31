module.exports = {
  apps: [{
    name: 'minitest',
    script: 'app.js',
    pid_file: "/minitest/logs/api.pid",
    instances: 4, // "max"
    exec_mode: "cluster",
    max_memory_restart: '2G',
    instance_var: "INSTANCE_ID",
    env: {
      NODE_ENV: 'development'
    },
    env_dev: {
      NODE_ENV: 'dev'
    },
    env_test: {
      NODE_ENV: 'test'
    },
    env_prod: {
      NODE_ENV: 'prod'
    }
  }]
}
