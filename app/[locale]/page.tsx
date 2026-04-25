Link from 'next/link'
import { getLocalizedPath } from '@/src/i18n/routes'
import { getTranslations } from 'next-intl/server'
import HomeTunnel from './components/HomeTunnel'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const loc = locale as any

  return (
    <div className="flex flex-col">

      {/* HERO fond jaune */}
      <section className="bg-wdd-yellow min-h-screen grid grid-cols-2 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-16 translate-y-16">
          <svg width="480" height="360" viewBox="0 0 44 32" fill="#1A1A1A">
            <polygon points="0,0 6,0 11,20 16,8 21,20 26,0 32,0 24,32 18,32 16,22 14,32 8,32"/>
            <polygon points="34,0 40,0 44,16 40,32 34,32 38,16"/>
          </svg>
        </div>
        <div className="px-16 py-20 flex flex-col justify-center relative z-10">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-7 h-0.5 bg-wdd-black" />
            <span className="text-xs font-light tracking-widest text-wdd-black/50 uppercase">Forage Innovation Expertise</span>
          </div>
          <h1 className="text-6xl font-bold text-wdd-black leading-none mb-6">
            Expert en<br />forage<br />geothermique
          </h1>
          <p className="text-sm font-light text-wdd-black/60 leading-relaxed max-w-md mb-10">
            Nous installons des <strong className="text-wdd-black font-normal">systemes de geothermie fermee et ouverte</strong> pour chauffer et climatiser efficacement votre batiment.
          </p>
          <div className="flex items-center gap-5 mb-14">
            <Link href={getLocalizedPath(loc, 'devis')} className="bg-wdd-black text-wdd-yellow px-7 py-3.5 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors">
              Demandez un devis gratuit
            </Link>
            <Link href={getLocalizedPath(loc, 'geo_fermee')} className="text-sm font-light text-wdd-black/55 border-b border-wdd-black/25 hover:text-wdd-black transition-colors pb-0.5">
              Decouvrir nos services
            </Link>
          </div>
          <div className="flex gap-10 pt-9 border-t border-wdd-black/12">
            {[['5','Ateliers de forage'],['500+','Chantiers realises'],['11','Provinces belges']].map(([n,l]) => (
              <div key={l}>
                <div className="text-4xl font-bold text-wdd-black">{n}</div>
                <div className="text-xs font-light text-wdd-black/45 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-wdd-black flex items-center justify-center px-12 py-16 relative z-10 min-h-screen">  
          <HomeTunnel />
        </div>
      </section>


      {/* AVANTAGES fond clay */}
      <section className="bg-wdd-clay py-24 px-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Pourquoi la geothermie</span>
        </div>
        <h2 className="text-4xl font-bold mb-16">Passez a <span className="text-wdd-mud">la geothermie</span></h2>
        <div className="grid gap-0.5" style={{gridTemplateColumns:'1fr 1.4fr 1fr'}}>
          <div className="flex flex-col gap-0.5">
            {[
              { n:'01', bg:'bg-wdd-yellow text-wdd-black', icon:'EUR', title:'Reduisez vos factures', desc:'Captez une source de chaleur gratuite et inepuisable. Couts de chauffage drastiquement reduits toute l annee.' },
              { n:'02', bg:'bg-wdd-grass text-white', icon:'CO2', title:'Diminuez votre empreinte', desc:'Energie propre et renouvelable. Reduisez vos emissions de CO2 grace a cette solution ecologique.' },
            ].map(card => (
              <div key={card.n} className="bg-white p-9 relative overflow-hidden group hover:bg-wdd-black transition-colors duration-200 flex-1">
                <span className="absolute top-3 right-4 text-5xl font-bold text-black/5 group-hover:text-white/5 transition-colors">{card.n}</span>
                <div className={"w-10 h-10 flex items-center justify-center text-xs font-bold mb-4 " + card.bg}>{card.icon}</div>
                <h3 className="text-sm font-semibold mb-2 group-hover:text-white transition-colors">{card.title}</h3>
                <p className="text-xs font-light leading-relaxed text-black/55 group-hover:text-white/45 transition-colors">{card.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden min-h-80 flex flex-col items-center justify-end p-6 bg-wdd-ground">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-light text-white/30 tracking-widest uppercase text-center px-6">Photo forage machine en action chantier WDD</span>
            </div>
            <span className="absolute top-3 left-3 bg-wdd-yellow text-wdd-black text-xs font-bold px-2 py-0.5 z-10">Photo chantier</span>
            <span className="relative z-10 text-xs font-light text-white/50 tracking-widest uppercase">Forage Innovation Expertise</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="bg-white p-9 relative overflow-hidden group hover:bg-wdd-black transition-colors duration-200 flex-1">
              <span className="absolute top-3 right-4 text-5xl font-bold text-black/5 group-hover:text-white/5 transition-colors">03</span>
              <div className="w-10 h-10 flex items-center justify-center text-xs font-bold mb-4 bg-wdd-mud text-white">C</div>
              <h3 className="text-sm font-semibold mb-2 group-hover:text-white transition-colors">Ameliorez votre confort</h3>
              <p className="text-xs font-light leading-relaxed text-black/55 group-hover:text-white/45 transition-colors">Confort constant hiver comme ete. Sondes garanties 25 ans. Rentabilise en 7 a 10 ans.</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-wdd-yellow scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
            <Link href={getLocalizedPath(loc, 'calculateur')} className="bg-wdd-yellow p-9 flex flex-col justify-between group hover:bg-wdd-black transition-colors duration-200 cursor-pointer flex-1">
              <div className="text-3xl font-bold text-wdd-black group-hover:text-white transition-colors leading-tight">Calculez<br />votre<br />avantage</div>
              <span className="text-xs font-light text-wdd-black/55 group-hover:text-white/45 transition-colors mt-3">Simulateur gratuit +</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES fond blanc */}
      <section className="bg-white py-24 px-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Nos solutions de forage</span>
        </div>
        <h2 className="text-4xl font-bold mb-16">Deux technologies, <span className="text-wdd-mud">une expertise</span></h2>
        <div className="grid grid-cols-2 gap-0.5">
          {[
            { badge:'Geothermie fermee', badgeCls:'bg-wdd-yellow text-wdd-black', title:'Forage de sondes geothermiques verticales', desc:'Des sondes installees verticalement dans le sol, reliees a une pompe a chaleur. Ideale pour tous types de projets.', specs:['Maisons, batiments commerciaux, infrastructures publiques','S adapte a la plupart des terrains et projets'], href:getLocalizedPath(loc,'geo_fermee'), dot:'bg-wdd-yellow', imgBg:'bg-wdd-ground/50' },
            { badge:'Geothermie ouverte', badgeCls:'bg-wdd-mud text-white', title:'Forage pour geothermie sur nappe phreatique', desc:'Captage de l energie des nappes phreatiques. Eau pompee, chaleur extraite puis reinjection. Pour grandes installations.', specs:['Ecoles, hopitaux, centres commerciaux, industrie','Grande capacite thermique requise'], href:getLocalizedPath(loc,'geo_ouverte'), dot:'bg-wdd-mud', imgBg:'bg-wdd-mud/40' },
          ].map(svc => (
            <div key={svc.badge} className="overflow-hidden group cursor-pointer">
              <div className={"h-56 relative flex items-center justify-center " + svc.imgBg}>
                <span className="text-xs font-light text-white/30 uppercase tracking-wider">Photo {svc.badge}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-wdd-black/80 to-transparent" />
                <span className={"absolute bottom-4 left-4 text-xs font-bold tracking-wider uppercase px-3 py-1.5 " + svc.badgeCls}>{svc.badge}</span>
              </div>
              <div className="bg-wdd-clay p-10 group-hover:bg-wdd-black transition-colors duration-200">
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{svc.title}</h3>
                <p className="text-xs font-light text-black/60 leading-relaxed mb-5 group-hover:text-white/40 transition-colors">{svc.desc}</p>
                <div className="flex flex-col gap-2 mb-6">
                  {svc.specs.map(s => (
                    <div key={s} className="flex items-center gap-2 text-xs font-light text-black/45 group-hover:text-white/35 transition-colors">
                      <span className={"w-1 h-1 flex-shrink-0 " + svc.dot} />{s}
                    </div>
                  ))}
                </div>
                <Link href={svc.href} className="text-xs font-bold text-wdd-black group-hover:text-wdd-yellow transition-colors">Decouvrir +</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIE fond noir */}
      <section className="bg-wdd-black py-24 px-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase">Nos chantiers en images</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-3">Sous terre, <span className="text-wdd-yellow">une energie inepuisable</span></h2>
        <p className="text-sm font-light text-white/35 mb-10 max-w-lg">Decouvrez nos equipes a l oeuvre sur nos chantiers.</p>
        <div className="grid gap-0.5" style={{gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'260px 260px'}}>
          <div className="row-span-2 bg-wdd-mud/30 flex flex-col items-center justify-center relative group cursor-pointer">
            <span className="text-xs font-light text-white/20 uppercase tracking-wider text-center px-6">Video principale machine de forage en action</span>
            <div className="absolute inset-0 bg-wdd-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 border-2 border-wdd-yellow rounded-full flex items-center justify-center text-wdd-yellow font-bold text-lg">V</div>
            </div>
            <span className="absolute top-3 right-3 text-xs font-bold bg-wdd-yellow text-wdd-black px-2 py-0.5">Video</span>
          </div>
          {[['bg-wdd-ground/20','Photo equipe','Namur'],['bg-wdd-grass/10','Photo sondes','Brabant'],['bg-wdd-clay/10','Photo chantier','Bruxelles'],['bg-wdd-mud/20','Photo machine','Liege']].map(([bg,label,city]) => (
            <div key={label} className={"flex items-center justify-center relative group cursor-pointer " + bg}>
              <span className="text-xs font-light text-white/20 uppercase tracking-wider text-center px-3">{label}</span>
              <div className="absolute inset-0 bg-wdd-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-3 left-3 text-xs font-light text-white/25">{city}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PARTICULIERS PRO */}
      <section className="grid grid-cols-2">
        <div className="grid grid-cols-2">
          <div className="bg-wdd-yellow p-14 flex flex-col justify-between min-h-96">
            <div>
              <div className="text-xs font-light tracking-widest text-wdd-black/40 uppercase mb-3">Pour les particuliers</div>
              <h3 className="text-2xl font-bold mb-3">Profitez d un confort optimal</h3>
              <p className="text-xs font-light text-wdd-black/60 leading-relaxed">Geothermie fermee pour votre maison. Confort constant, investissement rentabilise en 7 a 10 ans.</p>
            </div>
            <Link href={getLocalizedPath(loc,'devis')} className="inline-block bg-wdd-black text-wdd-yellow px-5 py-3 text-xs font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors self-start mt-6">Obtenir mon devis +</Link>
          </div>
          <div className="bg-wdd-clay flex items-center justify-center min-h-96">
            <span className="text-xs font-light text-wdd-black/25 uppercase tracking-wider text-center px-6">Photo maison installation geothermique</span>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="bg-wdd-ground/30 flex items-center justify-center min-h-96">
            <span className="text-xs font-light text-wdd-black/25 uppercase tracking-wider text-center px-6">Photo chantier professionnel</span>
          </div>
          <div className="bg-wdd-black p-14 flex flex-col justify-between min-h-96">
            <div>
              <div className="text-xs font-light tracking-widest text-wdd-yellow/40 uppercase mb-3">Pour les entreprises</div>
              <h3 className="text-2xl font-bold text-white mb-3">Solutions sur mesure grandes installations</h3>
              <p className="text-xs font-light text-white/45 leading-relaxed">Batiments tertiaires, industries, institutions. Offre detaillee sous 48h.</p>
            </div>
            <Link href={getLocalizedPath(loc,'pro_soumission')} className="inline-block bg-wdd-yellow text-wdd-black px-5 py-3 text-xs font-bold border-2 border-wdd-yellow hover:bg-transparent hover:text-wdd-yellow transition-colors self-start mt-6">Soumettre mon projet +</Link>
          </div>
        </div>
      </section>

      {/* MACHINE fond clay */}
      <section className="grid grid-cols-2 min-h-96">
        <div className="bg-wdd-ground/40 flex items-center justify-center min-h-96">
          <span className="text-xs font-light text-wdd-black/25 uppercase tracking-wider text-center px-8">Photo machine de forage Hutte 205 GT</span>
        </div>
        <div className="bg-wdd-clay px-14 py-16 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-0.5 bg-wdd-yellow" />
            <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Notre parc materiel</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Nous forons partout en <span className="text-wdd-mud">Belgique</span></h2>
          <p className="text-sm font-light text-wdd-black/55 leading-relaxed mb-8 max-w-sm">Avec nos 5 ateliers de forage, nous intervenons rapidement partout en Belgique.</p>
          <ul className="flex flex-col gap-3 mb-8">
            {['5 ateliers de forage disponibles','11 provinces belges couvertes','Machines specialisees geothermie','Equipes certifiees et experimentees'].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-light text-wdd-black/70">
                <span className="w-2 h-2 bg-wdd-yellow flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
          <Link href={"/" + locale + "/a-propos"} className="inline-block bg-wdd-black text-wdd-yellow px-6 py-3 text-xs font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors self-start">En savoir plus +</Link>
        </div>
      </section>

      {/* CLIENTS fond blanc */}
      <section className="bg-white py-16 px-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Ils nous font confiance</span>
        </div>
        <h2 className="text-3xl font-bold mb-10">Nos <span className="text-wdd-mud">references</span></h2>
        <div className="flex flex-wrap gap-0.5">
          {['Trafic BE','Defense Belge','BW Invest','Karno','Thomas et Piron','SOWAER','2lements','Igretec','RDB','Matexi'].map(c => (
            <div key={c} className="bg-wdd-clay px-7 py-4 text-xs font-light text-wdd-black/50 hover:bg-wdd-black hover:text-wdd-yellow transition-all cursor-default flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-wdd-yellow flex-shrink-0" />{c}
            </div>
          ))}
        </div>
      </section>

      {/* BLOG fond clay */}
      <section className="bg-wdd-clay py-24 px-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-0.5 bg-wdd-yellow" />
          <span className="text-xs font-light tracking-widest text-wdd-ground uppercase">Actualites geothermie</span>
        </div>
        <h2 className="text-4xl font-bold mb-16">Nos dernieres actus <span className="text-wdd-mud">sur la geothermie</span></h2>
        <div className="grid grid-cols-3 gap-0.5">
          {[
            { bg:'bg-wdd-ground/50', title:"L apres-forage : Pourquoi le dossier As-Built est essentiel ?", date:'Mars 2026', excerpt:"Une fois que les machines ont quitte votre propriete, le travail n est pas termine..." },
            { bg:'bg-wdd-grass/40', title:"La Hutte 205 GT, l excellence du forage geothermique vertical", date:'Janvier 2026', excerpt:"La realisation d un forage destine aux sondes exige une rigueur mecanique..." },
            { bg:'bg-wdd-mud/50', title:"Independence energetique : Se couper du gaz d ici 2027", date:'Janvier 2026', excerpt:"En 2026, l independance n est plus un luxe, c est une strategie de patrimoine..." },
          ].map(post => (
            <div key={post.title} className="overflow-hidden group cursor-pointer">
              <div className={"h-48 flex items-center justify-center " + post.bg}>
                <span className="text-xs font-light text-white/30 uppercase tracking-wider">Photo article</span>
              </div>
              <div className="bg-white p-6 group-hover:bg-wdd-yellow transition-colors">
                <div className="text-xs font-light text-wdd-ground tracking-wider uppercase mb-2 group-hover:text-wdd-black/50 transition-colors">{post.date}</div>
                <h3 className="text-sm font-semibold mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs font-light text-wdd-black/50 leading-relaxed">{post.excerpt}</p>
                <span className="text-xs font-bold mt-3 block">Lire plus +</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA fond jaune */}
      <section className="bg-wdd-yellow grid grid-cols-2 min-h-72">
        <div className="bg-wdd-mud/60 flex items-center justify-center min-h-72 relative">
          <span className="text-xs font-light text-white/30 uppercase tracking-wider text-center px-8 relative z-10">Photo equipe WDD ou chantier emblematique</span>
          <div className="absolute inset-0 bg-wdd-yellow/15" />
        </div>
        <div className="px-14 py-16 flex flex-col justify-center">
          <div className="text-xs font-light tracking-widest text-wdd-black/40 uppercase mb-4">Rue de Libut, 5310 Eghezee</div>
          <h2 className="text-4xl font-bold text-wdd-black mb-8 leading-tight">Votre projet<br />commence ici</h2>
          <div className="flex flex-col items-start gap-4">
            <Link href={getLocalizedPath(loc,'devis')} className="bg-wdd-black text-wdd-yellow px-8 py-4 text-sm font-bold border-2 border-wdd-black hover:bg-transparent hover:text-wdd-black transition-colors">Demandez un devis gratuit</Link>
            <div className="text-sm font-light text-wdd-black/55">
              <strong className="font-bold text-wdd-black text-base">+32 478 75 36 79</strong><br />
              <span className="text-xs">info@welldonedrill.energy</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
