'use client'

import Image from 'next/image'

type PartnerLogo = {
  _key: string
  name?: string
  url?: string
  logo?: { asset?: { url?: string } }
}

export default function PartnersCarousel({
  logos,
  title,
}: {
  logos: PartnerLogo[]
  title?: string
}) {
  if (!logos.length) return null

  // Duplicate track for seamless infinite loop (-50% = one full set)
  const track = [...logos, ...logos]

  return (
    <section className="bg-white pt-4 pb-14 px-8 md:px-16">
      <div className="max-w-screen-2xl mx-auto w-full">
        {title && (
          <p className="text-xs font-light tracking-widest text-black/35 uppercase mb-8">
            {title}
          </p>
        )}
      </div>
      {/* overflow-hidden crops the track; mask fades edges */}
      <div
        className="overflow-hidden"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
      >
        <div
          className="flex items-center gap-14"
          style={{ animation: 'ticker 32s linear infinite', width: 'max-content' }}
        >
          {track.map((p, i) => {
            const src = p.logo?.asset?.url
            if (!src) return null
            const key = `${p._key}-${i}`

            /*
             * Each logo lives in a fixed 140×56 px bounding box.
             * object-contain ensures both square and wide logos
             * fit uniformly without distortion.
             */
            const inner = (
              <div className="relative w-[154px] h-[62px] shrink-0">
                <Image
                  src={src}
                  alt={p.name ?? 'Partenaire'}
                  fill
                  className="object-contain"
                />
              </div>
            )

            return p.url ? (
              <a
                key={key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 grayscale opacity-35 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                {inner}
              </a>
            ) : (
              <div
                key={key}
                className="shrink-0 grayscale opacity-35 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
