const logger = require('../logger/logger')

const shouldThrow404 = (status, body) => {
	return !status || (status === 404 && body == null)
}

const shouldRecordError = (err, status) => {
	return !err.expose && status >= 500
}

const formatError = ({ message }, status) => {
	return { message }
}

async function logHttpInfo(ctx, next) {
	// 这里的error.js 并不只是记录error 应该是http的logger
	// TODO 这里先暂时加上全部http的log 后面在具体代码里需要具体加logger
	let ctxInfo = {
		status: ctx.response._header ? ctx.status || ctx.statusCode : undefined,
		// responseTime: '' TODO 暂时先不加
		method: ctx.method,
		url: ctx.originalUrl,
		body: JSON.stringify(ctx.request.body),
		query: JSON.stringify(ctx.query),
		headers: JSON.stringify(ctx.headers)
	}
	try {
		logger.info(ctxInfo)
		await next()
		if (ctx.status >= 400) {
			if (shouldThrow404(ctx.status, ctx.body)) {
				ctx.throw(404, '请求不存在')
			} else {
				ctx.throw(ctx.status)
			}
		}
	} catch (err) {
		logger.info(ctxInfo)
		if (ctx.xsy) {
			ctx.status = 200
			ctx.body = {
				messageId: ctx.headers['messageid'] || ctx.headers['message-id'],
				code: 0,
				msg: err.message,
				error: err.message,
			}
		} else {
			// 平台请求
			ctx.status = err.status || err.statusCode || 500
			ctx.body = formatError(err, ctx.status) || {}
			if (shouldRecordError(err, ctx.status)) {
				const app_error = {
					message: err.message,
					name: err.name,
					stack: err.stack,
				}
				if (ctx.user) {
					app_error.user = ctx.user.id
				}
				if (ctx.phone) {
					app_error.phone = ctx.phone
				}
				logger.error(app_error)
			}
		}
	}
}

module.exports = (app) => {
	app.on('error', (err, ctx) => {
		logger.error(err)
	})
	return logHttpInfo
}