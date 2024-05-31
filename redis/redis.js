// /**
//  * @author yangqiqi
//  */
// const redis = require("redis");
// const logger = require("../logger/logger");
// const config = require("config");
// const moment = require("moment");
// // const { v4: uuidv4 } = require('uuid');

// let { host, port, password, db } = config.get("redis");
// class RedisCache {
//     constructor() {
//         this.client = null
//         this.init()
//     }

//     init() {
//         try {
//             const option = {
//                 host: host,
//                 port: port,
//                 password: password,
//                 db: db,
//             };
//             this.client = redis.createClient(option);
//             this.client.auth(option.password);
//             this.client.on("error", (err) => {
//                 if (err) {
//                     logger.error(err);
//                 }
//             });
//         } catch (error) {
//             logger.error(error);
//         }
//     }

//     get($key, callback) {
//         this.client.get($key, (err, data) => {
//             if (typeof callback === "function") callback(err, data);
//         });
//     }

//     getAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.get($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     replace($key, $value, $lifetime, callback) {
//         redisSet($key, $value, $lifetime, callback);
//     }

//     set($key, $value, $lifetime, callback) {
//         const redisClient = this.client;
//         if (typeof $value === "object") {
//             $value = JSON.stringify($value);
//         }
//         redisClient.set($key, $value, (err) => {
//             if (err) {
//                 if (typeof callback === "function") callback(err);
//             } else {
//                 if ($lifetime) redisClient.expire($key, $lifetime);
//                 if (typeof callback === "function") callback(null, true);
//             }
//         });
//     }
//     multiGetAsync(commands) {
//         const { client } = this;
//         const multi = client.multi();
//         if (commands.length > 0) {
//             for (const command of commands) {
//                 multi.get(command);
//             }
//         }
//         return new Promise((resolve, reject) => {
//             multi.exec((err, replies) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(replies);
//                 }
//             });
//         });
//     }
//     setAsync($key, $value, $lifetime) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             if (typeof $value !== "string") {
//                 $value = JSON.stringify($value);
//             }
//             redisClient.set($key, $value, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     if ($lifetime) redisClient.expire($key, $lifetime);
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     add($key, $value, $lifetime, callback) {
//         redisSet($key, $value, $lifetime, callback);
//     }

//     append($key, $value, callback) {
//         this.client.append($key, $value, (err) => {
//             if (err) {
//                 if (typeof callback === "function") callback(err);
//             } else if (typeof callback === "function") callback(null, true);
//         });
//     }

//     prepend($key, $value, callback) {
//         const redisClient = this.client;
//         redisClient.set($key, $value, (err) => {
//             if (err) {
//                 if (typeof callback === "function") callback(err);
//             } else if (typeof callback === "function") callback(null, true);
//         });
//     }

//     incr($key, $amount, callback) {
//         const redisClient = this.client;
//         const multi = redisClient.multi();
//         multi.incr($key);
//         multi.exec((err, replies) => {
//             if (err) {
//                 callback(err);
//             } else {
//                 const now = moment();
//                 const tomorrow = moment().format("YYYY-MM-DD 23:59:59");
//                 const expires = Math.abs(now.diff(moment(tomorrow), "second"));
//                 redisClient.expire($key, expires);
//                 callback(null, replies[0]);
//             }
//         });
//     }

//     decr($key, $amount, callback) {
//         const redisClient = this.client;
//         const multi = redisClient.multi();
//         multi.decr($key);
//         multi.exec((err, replies) => {
//             if (err) {
//                 callback(err);
//             } else {
//                 const now = moment();
//                 const tomorrow = moment().format("YYYY-MM-DD 23:59:59");
//                 const expires = Math.abs(now.diff(moment(tomorrow), "second"));
//                 redisClient.expire($key, expires);
//                 callback(null, replies[0]);
//             }
//         });
//     }

//     del($key, callback) {
//         this.client.del($key, (err) => {
//             if (err) {
//                 callback(err);
//             }
//         });
//     }

//     keys($key, callback) {
//         this.client.keys($key, (err, data) => {
//             if (typeof callback === "function") callback(err, data);
//         });
//     }

//     keysAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.keys($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     delAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.del($key, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     hgetAsync($key, $field) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hget($key, $field, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     hsetAsync($key, $field, $value) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hset($key, $field, $value, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     hdelAsync($key, $field) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hdel($key, $field, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     hlenAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hlen($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     hgetallAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hgetall($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     hkeysAsync($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.hkeys($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }

//     sadd($key, $field) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.sadd($key, $field, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     srem($key, $field) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.srem($key, $field, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(true);
//                 }
//             });
//         });
//     }

//     smembers($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.smembers($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//     sismember($key, value) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.sismember($key, value, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//     scard($key) {
//         const redisClient = this.client;
//         return new Promise((resolve, reject) => {
//             redisClient.scard($key, (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             });
//         });
//     }
//     flush(callback) {
//         this.client
//             .multi()
//             .flushdb()
//             .exec((err) => {
//                 if (typeof callback === "function") callback(err);
//             });
//     }

//     // 订阅绑消费者
//     async subscribe(channel, $receiver) {
//         try {
//             const redisClient = this.client;
//             // 开始订阅
//             redisClient.on("message", async function (channel, message) {
//                 const parsedMessage = JSON.parse(message);
//                 const messageId = parsedMessage.messageId;
//                 // const isProcessed = redisClient.zscore('processed_messages:' + channel, messageId);
//                 // if (isProcessed == null) {
//                     // ... ... 如果消息ID不存在，表示这是一条新消息，可以进行处理
//                     // 将消息ID添加到已处理消息的有序集合中
//                     redisClient.zadd('processed_messages:' + channel, Date.now(), messageId);
//                     await $receiver(message);
//                     logger.info(`redis subscribed handle ok:  ${channel}: ${message}`);
//                 // } else {
//                     // 如果消息ID已经存在，表示这是一条重复消息，直接丢弃
//                     logger.info(`Duplicate message detected and ignored: ${channel}: ${message}`);
//                 // }
//             });
//             await redisClient.subscribe(channel)
//             redisClient.on("ready", function() {
//                 logger.info(`channel ${channel} subscribed!!`)
//             });
//             // 监听error
//             redisClient.on("error", (err) => {
//                 logger.info("response err:" + err);
//             });
//         } catch (err) {
//             logger.error(`channel ${channel} subscribed error!! ${err.message}`)
//             throw(err)
//         }
//     }
//     // 发布
//     async publish(channel, msg) {
//         try{
//             const redisClient = this.client
//             // const messageId = generateMessageId(msg); // 生成消息的唯一标识符
//             // const parsedMsg = JSON.parse(msg)
//             // parsedMsg.messageId = messageId

//             // let newMsg = JSON.stringify(parsedMsg)
//             await redisClient.publish(channel, msg)
//             logger.info(`channel ${channel} publish success!!`)
//         } catch (err) {
//             logger.error(`channel ${channel} publish error!! ${err.message}`)
//             throw(err)
//         }
        
//     }

//     stats(callback) {
//         this.client.info((err, data) => {
//             if (typeof callback === "function") callback(err, data);
//         });
//     }

//     close() {
//         this.client.end();
//     }
// }

// function redisSet($key, $value, $lifetime, callback) {
//     const redisClient = this.client;
//     redisClient.set($key, $value, (err) => {
//         if (err) {
//             if (typeof callback === "function") callback(err);
//         } else {
//             if ($lifetime) redisClient.expire($key, $lifetime);
//             if (typeof callback === "function") callback(null, true);
//         }
//     });
// }


// // function generateMessageId(msg) {
// //     // 生成基于消息内容的唯一ID
// //     const messageId = uuidv4();
// //     return messageId;
// // }



// module.exports = RedisCache