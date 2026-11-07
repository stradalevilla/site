import { notFound } from 'next/navigation';

/** Endereço que não existe no app fica dentro do app */
export default function RestoDoApp() {
  notFound();
}
