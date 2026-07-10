import type { MetadataRoute } from 'next';
import { lotesDisponiveis } from '@/lib/lotes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://villastradale.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/lotes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...lotesDisponiveis.map((n) => ({
      url: `${baseUrl}/lotes/${String(n).padStart(2, '0')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
