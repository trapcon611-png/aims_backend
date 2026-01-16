import { defineMigrateConfig } from '@prisma/migrate';

export default defineMigrateConfig({
  datasources: {
    db: {
      url: {
        fromEnvVar: 'DATABASE_URL',
        value: 'postgresql://postgres:Sameer@localhost:5432/aims_db?schema=public',
      },
    },
  },
});
