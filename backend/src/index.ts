import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('--- Successfully connected to MySQL database ---');

    app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`Interactive API Documentation: http://localhost:${env.PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Fatal error during startup:', error);
    process.exit(1);
  }
}

bootstrap();
