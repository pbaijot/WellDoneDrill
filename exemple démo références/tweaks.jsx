/* Tweaks panel — variations on top of the refined Particuliers page */
const { useEffect } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "paper",
  "heroLayout": "editorial",
  "heroAccent": "yellow-highlight",
  "schemeLayout": "horizontal",
  "whyLayout": "spread",
  "calcStyle": "receipt",
  "devisStyle": "ledger",
  "showSlugLine": true,
  "showFigureBig": true,
  "tickerFooter": false
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement.style;

  // Palette
  if (t.palette === 'paper') {
    root.setProperty('--paper', '#F5F2EB');
  } else if (t.palette === 'clay') {
    root.setProperty('--paper', '#E8E5DE');
  } else if (t.palette === 'pure-white') {
    root.setProperty('--paper', '#FFFFFF');
  } else if (t.palette === 'warm-dark') {
    root.setProperty('--paper', '#1A1A1A');
  }

  // Hero layout — toggles class on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.toggle('hero--centered', t.heroLayout === 'centered');
    hero.classList.toggle('hero--massive', t.heroLayout === 'massive');
  }

  // Hero accent
  const yhi = document.querySelector('.hero h1 .yhi');
  if (yhi) {
    if (t.heroAccent === 'yellow-highlight') {
      yhi.style.background = 'linear-gradient(transparent 64%, var(--yellow) 64% 92%, transparent 92%)';
      yhi.style.color = 'var(--black)';
    } else if (t.heroAccent === 'mud-color') {
      yhi.style.background = 'transparent';
      yhi.style.color = 'var(--mud)';
    } else if (t.heroAccent === 'underline') {
      yhi.style.background = 'transparent';
      yhi.style.color = 'var(--black)';
      yhi.style.borderBottom = '4px solid var(--yellow)';
    } else {
      yhi.style.background = 'transparent';
      yhi.style.color = 'var(--black)';
      yhi.style.borderBottom = 'none';
    }
  }

  // Slug line visibility
  const slug = document.querySelector('.hero .slug');
  if (slug) slug.style.display = t.showSlugLine ? '' : 'none';

  // Cardinal figure visibility
  const fig = document.getElementById('cardinal-figure');
  const figsub = document.getElementById('cardinal-figsub');
  if (fig) fig.style.display = t.showFigureBig ? '' : 'none';
  if (figsub) figsub.style.display = t.showFigureBig ? '' : 'none';

  // Scheme layout
  const sch = document.getElementById('scheme-stage');
  if (sch) {
    sch.style.gridTemplateColumns = t.schemeLayout === 'vertical' ? '1fr' : 'repeat(3, 1fr)';
  }
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(DEFAULTS);

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  const T = window.TweaksPanel;
  const Sec = window.TweakSection;
  const Sel = window.TweakSelect;
  const Tog = window.TweakToggle;

  return (
    <T title="Tweaks">
      <Sec title="Palette">
        <Sel label="Fond principal" value={tweaks.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { value: 'paper', label: 'Paper (chaud, recommandé)' },
            { value: 'clay', label: 'Soft Clay (brandbook)' },
            { value: 'pure-white', label: 'Blanc pur' },
          ]} />
      </Sec>

      <Sec title="Hero">
        <Tog label="Slug éditorial en tête" value={tweaks.showSlugLine}
          onChange={(v) => setTweak('showSlugLine', v)} />
        <Sel label="Accent du titre" value={tweaks.heroAccent}
          onChange={(v) => setTweak('heroAccent', v)}
          options={[
            { value: 'yellow-highlight', label: 'Surligneur jaune' },
            { value: 'mud-color', label: 'Couleur Shiny Mud' },
            { value: 'underline', label: 'Souligné jaune' },
            { value: 'none', label: 'Aucun' },
          ]} />
      </Sec>

      <Sec title="Pourquoi">
        <Tog label="Grand chiffre cardinal" value={tweaks.showFigureBig}
          onChange={(v) => setTweak('showFigureBig', v)} />
      </Sec>

      <Sec title="Schéma géothermie">
        <Sel label="Disposition" value={tweaks.schemeLayout}
          onChange={(v) => setTweak('schemeLayout', v)}
          options={[
            { value: 'horizontal', label: 'Horizontal (3 cellules)' },
            { value: 'vertical', label: 'Vertical (empilé)' },
          ]} />
      </Sec>
    </T>
  );
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
root.render(<App />);
