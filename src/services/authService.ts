import { sign, verify } from 'hono/jwt'
import { CONFIG } from '../config'

export async function generateTokens(dbUser: {
	id: number
	email: string
	fullName: string
	avatarUrl: string
})
	: Promise<{
		accessToken: string
		refreshToken: string
	}> {
	const accessToken = await sign({
		userId: dbUser.id,
		email: dbUser.email,
		fullName: dbUser.fullName,
		avatarUrl: dbUser.avatarUrl
	}, CONFIG.JWT_ACCESS_SECRET, 'HS256')

	const refreshToken = await sign({ userId: dbUser.id }, CONFIG.JWT_REFRESH_SECRET, 'HS256')

	return { accessToken, refreshToken }
}

export async function verifyRefreshToken(token: string): Promise<number> {
	try {
		const payload = await verify(token, CONFIG.JWT_REFRESH_SECRET, 'HS256')
		return payload.userId as number
	} catch (_error) {
		throw new Error('Invalid refresh token')
	}
}
