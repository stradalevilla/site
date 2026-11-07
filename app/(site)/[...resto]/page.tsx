import { notFound } from 'next/navigation';

/** Sem isto, endereço que não existe cairia fora do layout do site, sem a marca e sem o Tag Manager */
export default function RestoDoSite() {
  notFound();
}
