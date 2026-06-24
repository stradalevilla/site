'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const textoPadrao = {
  title: "Lorem Ipsum has been the industry's standard dummy text ever",
  text: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

const embaixadores = [
  { image: '/images/embaixadores/Carol Celico.png', name: 'Carol Celico', ...textoPadrao },
  { image: '/images/embaixadores/Gizela.png', name: 'Gizela', ...textoPadrao },
  { image: '/images/embaixadores/Eduardo_.png', name: 'Eduardo', ...textoPadrao },
];

export function EmbaixadoresSection() {
  const [current, setCurrent] = useState(0);
  const atual = embaixadores[current];

  const next = () => setCurrent((c) => (c + 1) % embaixadores.length);

  return (
    <section className="relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden">
          {/* Imagem de fundo laranja (fixa) */}
          <div className="absolute inset-0">
            <Image
              src="/images/bg-embaixadores.png"
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
          </div>

          {/* Conteúdo */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-8 md:px-12 lg:px-20 py-16 md:py-20 lg:py-24">
            {/* Texto */}
            <div className="text-white">
              {/* Emblema */}
              <div className="mb-6">
                <Image
                  src="/logos/Icone-VillaStradale claro.svg"
                  alt="Villa Stradale"
                  width={64}
                  height={40}
                  className="h-9 md:h-10 w-auto"
                />
              </div>

              {/* Overline */}
              <span className="block font-heading italic font-thin text-sm md:text-base uppercase tracking-[0.35em] mb-8">
                Primeiros Proprietários
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Título */}
                  <h2 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl italic uppercase leading-relaxed mb-6">
                    {atual.title}
                  </h2>

                  {/* Parágrafo */}
                  <p className="font-body text-sm md:text-base leading-relaxed max-w-md mb-8 text-white/90">
                    {atual.text}
                  </p>

                  {/* Nome */}
                  <p className="font-body italic font-semibold text-base md:text-lg mb-10">
                    {atual.name}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controles - seta + indicadores */}
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próximo embaixador"
                  className="group flex items-center justify-center w-16 h-10 rounded-full border border-white/70 text-white transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-navy"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 ease-out delay-150 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Indicadores */}
                <div className="flex items-center gap-2.5">
                  {embaixadores.map((emb, i) => (
                    <button
                      key={emb.name}
                      type="button"
                      onClick={() => setCurrent(i)}
                      aria-label={`Ir para ${emb.name}`}
                      aria-current={i === current}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Imagem do embaixador */}
            <div className="relative h-[420px] md:h-[500px] lg:h-[560px] w-full max-w-[440px] mx-auto lg:ml-auto lg:mr-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={atual.image}
                    alt={atual.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 440px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
