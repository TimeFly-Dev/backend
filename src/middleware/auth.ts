import type { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { CONFIG } from '../config'

declare module 'hono' {
	interface ContextVariableMap {
		userId: number
	}
}

export async function authMiddleware(c: Context, next: Next) {
	const authHeader = c.req.header('Authorization')
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	const token = authHeader.split(' ')[1]
	try {
		const payload = await verify(token, CONFIG.JWT_ACCESS_SECRET)
		c.set('userId', payload.userId as number)
		await next()
	} catch (_error) {
		return c.json({ error: 'Invalid token' }, 401)
	}
}
