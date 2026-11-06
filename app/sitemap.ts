import type { MetadataRoute } from 'next';
import { lotesDisponiveis } from '@/lib/lotes';
import { SITE } from '@/lib/seo';

/**
 * Sem lastModified: a data do deploy em todas as URLs não diz nada ao Google.
 * /villa-stradale fica de fora de propósito, o conteúdo dela foi para a home.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/quem-somos`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/lotes`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE}/localizacao`, changeFrequency: 'monthly', priority: 0.9 },
    ...lotesDisponiveis.map((n) => ({
      url: `${SITE}/lotes/${String(n).padStart(2, '0')}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
