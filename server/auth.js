const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { addMinutes, addDays, isAfter, subHours } = require('date-fns');
const { randomUUID } = require('crypto');

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'ucarx.sid';
const ACCESS_TOKEN_TTL_MINUTES = 15;
const REFRESH_TOKEN_TTL_DAYS = 30;
const OTP_EXPIRY_MINUTES = 5;
const OTP_RATE_LIMIT_PER_HOUR = 5;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(6, 'Phone must be at least 6 characters'),
  email: z.string().email().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
});

const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6)
});

const otpSendSchema = z.object({
  phone: z.string().min(6)
});

const otpVerifySchema = z.object({
  phone: z.string().min(6),
  code: z.string().min(4).max(6)
});

function sanitizeUser(user) {
  if (!user) return null;
  const {
    passwordHash,
    otpSecret,
    sessions,
    payments,
    otpLogs,
    ...rest
  } = user;
  return rest;
}

function createSessionCookieValue(sessionId, refreshToken) {
  return `${sessionId}.${refreshToken}`;
}

function parseSessionCookie(value) {
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 2) return null;
  const [sessionId, refreshToken] = parts;
  if (!sessionId || !refreshToken) return null;
  return { sessionId, refreshToken };
}

function issueAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET env variable is required');
  }
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    secret,
    {
      expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`
    }
  );
}

function createAuthModule({ prisma }) {
  const router = express.Router();

  async function createSession({ user, req, res }) {
    const sessionId = randomUUID();
    const refreshToken = randomUUID();
    const refreshHash = await argon2.hash(refreshToken);
    const expiresAt = addDays(new Date(), REFRESH_TOKEN_TTL_DAYS);

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshTokenHash: refreshHash,
        expiresAt,
        ip: req.ip,
        userAgent: req.get('user-agent') || undefined
      }
    });

    res.cookie(SESSION_COOKIE_NAME, createSessionCookieValue(sessionId, refreshToken), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    });

    const accessToken = issueAccessToken(user);
    return {
      accessToken,
      accessTokenExpiresIn: ACCESS_TOKEN_TTL_MINUTES * 60,
      sessionId
    };
  }

  async function generateOtp(userId, channel = 'SMS', meta = {}) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await argon2.hash(code);
    const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

    await prisma.oTPLog.create({
      data: {
        userId,
        channel,
        codeHash,
        expiresAt,
        meta
      }
    });

    return code;
  }

  async function verifySessionFromRequest(req) {
    const cookieValue = req.cookies?.[SESSION_COOKIE_NAME];
    const parsed = parseSessionCookie(cookieValue);
    if (!parsed) return null;

    const session = await prisma.session.findUnique({
      where: { id: parsed.sessionId },
      include: { user: true }
    });

    if (!session || session.revokedAt) return null;
    if (isAfter(new Date(), session.expiresAt)) return null;
    const valid = await argon2.verify(session.refreshTokenHash, parsed.refreshToken);
    if (!valid) return null;

    return { session, refreshToken: parsed.refreshToken };
  }

  async function requireAuth(req, res, next) {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      const authHeader = req.get('authorization');
      if (jwtSecret && authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
          const payload = jwt.verify(token, jwtSecret);
          const user = await prisma.user.findUnique({
            where: { id: payload.sub }
          });
          if (user) {
            req.context = { user: sanitizeUser(user) };
            return next();
          }
        } catch (error) {
          // fall through to session validation
        }
      }

      const sessionData = await verifySessionFromRequest(req);
      if (!sessionData) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.context = {
        user: sanitizeUser(sessionData.session.user),
        session: sessionData.session
      };
      return next();
    } catch (error) {
      console.error('Auth middleware error', error);
      return res.status(500).json({ message: 'Authentication check failed' });
    }
  }

  router.post('/register', async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().formErrors.join(', ') });
      }
      const data = parsed.data;

      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ phone: data.phone }, { email: data.email ?? '' }]
        }
      });
      if (existing) {
        return res.status(409).json({ message: 'User with this phone or email already exists' });
      }

      const passwordHash = data.password ? await argon2.hash(data.password) : null;
      const user = await prisma.user.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email ?? null,
          passwordHash,
          notificationsEnabled: true,
          darkMode: false
        }
      });

      const otpCode = await generateOtp(user.id, 'SMS', { reason: 'register' });

      return res.status(201).json({
        message: 'Registration successful. Please verify the OTP sent to your phone.',
        user: sanitizeUser(user),
        otpPreview: process.env.NODE_ENV === 'production' ? undefined : otpCode
      });
    } catch (error) {
      console.error('Register error', error);
      return res.status(500).json({ message: 'Unable to register user' });
    }
  });

  router.post('/otp/send', async (req, res) => {
    try {
      const parsed = otpSendSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().formErrors.join(', ') });
      }
      const { phone } = parsed.data;
      const user = await prisma.user.findFirst({ where: { phone } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const since = subHours(new Date(), 1);
      const count = await prisma.oTPLog.count({
        where: {
          userId: user.id,
          createdAt: { gte: since }
        }
      });
      if (count >= OTP_RATE_LIMIT_PER_HOUR) {
        return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
      }

      const otpCode = await generateOtp(user.id, 'SMS', { reason: 'login' });
      return res.json({
        message: 'OTP sent successfully.',
        otpPreview: process.env.NODE_ENV === 'production' ? undefined : otpCode
      });
    } catch (error) {
      console.error('OTP send error', error);
      return res.status(500).json({ message: 'Unable to send OTP' });
    }
  });

  router.post('/otp/verify', async (req, res) => {
    try {
      const parsed = otpVerifySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().formErrors.join(', ') });
      }
      const { phone, code } = parsed.data;
      const user = await prisma.user.findFirst({ where: { phone } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const otpLog = await prisma.oTPLog.findFirst({
        where: {
          userId: user.id,
          consumedAt: null,
          expiresAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!otpLog) {
        return res.status(400).json({ message: 'OTP expired or not found' });
      }

      const valid = await argon2.verify(otpLog.codeHash, code);
      if (!valid) {
        return res.status(400).json({ message: 'Invalid OTP code' });
      }

      await prisma.$transaction([
        prisma.oTPLog.update({
          where: { id: otpLog.id },
          data: { consumedAt: new Date() }
        }),
        prisma.user.update({
          where: { id: user.id },
          data: {
            phoneVerifiedAt: user.phoneVerifiedAt ?? new Date(),
            lastLoginAt: new Date()
          }
        })
      ]);

      const authUser = await prisma.user.findUnique({ where: { id: user.id } });
      const sessionInfo = await createSession({ user: authUser, req, res });

      return res.json({
        message: 'OTP verified successfully.',
        user: sanitizeUser(authUser),
        accessToken: sessionInfo.accessToken,
        expiresIn: sessionInfo.accessTokenExpiresIn
      });
    } catch (error) {
      console.error('OTP verify error', error);
      return res.status(500).json({ message: 'Unable to verify OTP' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.flatten().formErrors.join(', ') });
      }
      const { phone, password } = parsed.data;
      const user = await prisma.user.findFirst({ where: { phone } });
      if (!user || !user.passwordHash) {
        return res.status(400).json({ message: 'Invalid credentials or password login not enabled' });
      }

      const valid = await argon2.verify(user.passwordHash, password);
      if (!valid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date()
        }
      });

      const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
      const sessionInfo = await createSession({ user: freshUser, req, res });

      return res.json({
        message: 'Login successful.',
        user: sanitizeUser(freshUser),
        accessToken: sessionInfo.accessToken,
        expiresIn: sessionInfo.accessTokenExpiresIn
      });
    } catch (error) {
      console.error('Login error', error);
      return res.status(500).json({ message: 'Unable to login' });
    }
  });

  router.post('/logout', requireAuth, async (req, res) => {
    try {
      const cookieValue = req.cookies?.[SESSION_COOKIE_NAME];
      const parsed = parseSessionCookie(cookieValue);
      if (parsed) {
        await prisma.session.updateMany({
          where: { id: parsed.sessionId },
          data: { revokedAt: new Date() }
        });
      }
      res.clearCookie(SESSION_COOKIE_NAME);
      return res.json({ success: true });
    } catch (error) {
      console.error('Logout error', error);
      return res.status(500).json({ message: 'Unable to logout' });
    }
  });

  router.post('/refresh', async (req, res) => {
    try {
      const sessionData = await verifySessionFromRequest(req);
      if (!sessionData) {
        return res.status(401).json({ message: 'Invalid session' });
      }

      const user = await prisma.user.findUnique({ where: { id: sessionData.session.userId } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid session' });
      }

      const accessToken = issueAccessToken(user);
      return res.json({
        accessToken,
        expiresIn: ACCESS_TOKEN_TTL_MINUTES * 60
      });
    } catch (error) {
      console.error('Refresh error', error);
      return res.status(500).json({ message: 'Unable to refresh session' });
    }
  });

  router.get('/me', requireAuth, async (req, res) => {
    try {
      return res.json({ user: req.context.user });
    } catch (error) {
      console.error('Me error', error);
      return res.status(500).json({ message: 'Unable to load profile' });
    }
  });

  return {
    router,
    requireAuth
  };
}

module.exports = {
  createAuthModule,
  SESSION_COOKIE_NAME,
  sanitizeUser
};
