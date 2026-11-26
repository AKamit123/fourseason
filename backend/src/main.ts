import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('FourSeasonsBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers & Rate Limiting
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('x-powered-by');

  const rateStore = new Map<string, { count: number; resetAt: number }>();
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    const p = req.path || '';
    if (p.startsWith('/api/auth') || p.startsWith('/api/inquiries')) {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const key = `${ip}:${p.startsWith('/api/auth') ? 'auth' : 'inq'}`;
      const now = Date.now();
      const entry = rateStore.get(key);
      if (!entry || now > entry.resetAt) {
        rateStore.set(key, { count: 1, resetAt: now + 60_000 });
      } else {
        entry.count += 1;
        if (entry.count > 40) {
          res.status(429).json({ statusCode: 429, message: 'Too many requests. Please try again in a minute.' });
          return;
        }
      }
    }
    next();
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      /\.vercel\.app$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Serve static uploads
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  app.use('/uploads', express.static(uploadsDir));
  app.use('/reference_assets', express.static(path.join(uploadsDir, 'reference_assets')));
  app.use('/catalog', express.static(path.join(uploadsDir, 'catalog')));

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Four Seasons — API Documentation')
    .setDescription(
      'Enterprise-grade REST APIs for Four Seasons AI Inventory, Creative Generation & Invitation Management Platform',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Four Seasons API Explorer',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`  Four Seasons Backend Running on Port ${port}`);
  logger.log(`  REST APIs: http://localhost:${port}/api`);
  logger.log(`  Swagger API Docs: http://localhost:${port}/api/docs`);
  logger.log(`=======================================================`);
}

bootstrap();

