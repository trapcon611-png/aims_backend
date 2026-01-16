import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // We are pasting the link directly here to fix the error
    url: "postgresql://postgres:Sameer@localhost:5432/aims_db?schema=public"
  }
});