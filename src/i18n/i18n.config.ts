import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('i18n', () => ({
  fallbackLanguage: 'en',
  fallbacks: {
    'en-*': 'en',
  },
  loaderOptions: {
    path: join(process.cwd(), 'i18n'),
    watch: true,
  },
}));
