// Round-trip the restored blog articles through Markdown for translation.
//
//   node scripts/blog-legacy-md.mjs export            be-fr JSON → sanity-seed/blog-legacy/_md/be-fr/*.md
//   node scripts/blog-legacy-md.mjs build <locale>    _md/<locale>/*.md → sanity-seed/blog-legacy/<locale>/*.json
//
// A translated .md keeps the be-fr file name (the join key) and carries its
// own title / slug / excerpt / seo fields in the front matter. Supported
// Markdown: ## / ### headings, "- " and "1. " list items, **bold**, *italic*,
// [text](href) and ![alt](wp file) images, blank line between blocks.

import {readFileSync, writeFileSync, readdirSync, mkdirSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createHash} from 'node:crypto'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'sanity-seed', 'blog-legacy')
const FIELDS = ['title', 'slug', 'excerpt', 'seoTitle', 'seoDescription', 'mainImageAlt']

/* ─── Portable Text → Markdown ──────────────────────────────── */

function spansToMd(block) {
  const links = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d.href]))
  return block.children
    .map((c) => {
      let t = c.text
      const lead = t.match(/^\s*/)[0]
      const trail = t.match(/\s*$/)[0]
      t = t.trim()
      if (!t) return c.text
      if (c.marks.includes('em')) t = `*${t}*`
      if (c.marks.includes('strong') && block.style === 'normal') t = `**${t}**`
      const link = c.marks.find((m) => links[m])
      if (link) t = `[${t}](${links[link]})`
      return lead + t + trail
    })
    .join('')
    .replace(/\n/g, ' ')
}

function toMd(doc) {
  const fm = {
    title: doc.title,
    slug: doc.slug.current,
    excerpt: doc.excerpt,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    mainImageAlt: doc._mainImageAlt,
  }
  const head = '---\n' + FIELDS.map((k) => `${k}: ${JSON.stringify(fm[k] ?? '')}`).join('\n') + '\n---\n'
  const body = doc.body.map((b) => {
    if (b._type === 'image') return `![${b.alt || ''}](${b._file})`
    const text = spansToMd(b)
    if (b.listItem) return (b.listItem === 'number' ? '1. ' : '- ') + text
    if (b.style === 'h2') return '## ' + text
    if (b.style === 'h3') return '### ' + text
    return text
  })
  // list items of the same list stay on consecutive lines
  let out = ''
  doc.body.forEach((b, i) => {
    const prevList = i > 0 && doc.body[i - 1].listItem
    out += (i === 0 ? '' : b.listItem && prevList ? '\n' : '\n\n') + body[i]
  })
  return head + '\n' + out + '\n'
}

/* ─── Markdown → Portable Text ──────────────────────────────── */

const k = (...a) => createHash('md5').update(a.join('|')).digest('hex').slice(0, 12)

function inline(text, seed) {
  const children = []
  const markDefs = []
  // tokens: [text](href), **bold**, *em*
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let n = 0
  const push = (t, marks) => t && children.push({_type: 'span', _key: k(seed, n++), text: t, marks})
  for (const m of text.matchAll(re)) {
    push(text.slice(last, m.index), [])
    if (m[1]) {
      const key = k(seed, 'l', n)
      markDefs.push({_type: 'link', _key: key, href: m[2]})
      const inner = m[1].replace(/^\*\*(.*)\*\*$/, '$1')
      push(inner, inner !== m[1] ? ['strong', key] : [key])
    } else if (m[3]) push(m[3], ['strong'])
    else push(m[4], ['em'])
    last = m.index + m[0].length
  }
  push(text.slice(last), [])
  return {children, markDefs}
}

function fromMd(src, seed) {
  const [, fmRaw, bodyRaw] = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const fm = Object.fromEntries(
    fmRaw.split('\n').map((l) => {
      const i = l.indexOf(':')
      return [l.slice(0, i).trim(), JSON.parse(l.slice(i + 1).trim())]
    }),
  )
  const body = []
  bodyRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line, i) => {
      const key = k(seed, i)
      const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (img) return body.push({_type: 'image', _key: key, _file: img[2], alt: img[1]})
      let style = 'normal'
      let listItem
      let text = line
      if (line.startsWith('### ')) [style, text] = ['h3', line.slice(4)]
      else if (line.startsWith('## ')) [style, text] = ['h2', line.slice(3)]
      else if (line.startsWith('- ')) [listItem, text] = ['bullet', line.slice(2)]
      else if (/^\d+\. /.test(line)) [listItem, text] = ['number', line.replace(/^\d+\. /, '')]
      const block = {_type: 'block', _key: key, style, ...inline(text, key)}
      if (listItem) Object.assign(block, {listItem, level: 1})
      body.push(block)
    })
  return {fm, body}
}

/* ─── Commands ──────────────────────────────────────────────── */

const [cmd, locale] = process.argv.slice(2)

if (cmd === 'export') {
  const out = join(root, '_md', 'be-fr')
  mkdirSync(out, {recursive: true})
  for (const f of readdirSync(join(root, 'be-fr'))) {
    const doc = JSON.parse(readFileSync(join(root, 'be-fr', f), 'utf8'))
    writeFileSync(join(out, f.replace(/\.json$/, '.md')), toMd(doc))
  }
  console.log('exported to', out)
} else if (cmd === 'build' && locale) {
  const out = join(root, locale)
  mkdirSync(out, {recursive: true})
  const files = readdirSync(join(root, '_md', locale)).filter((f) => f.endsWith('.md'))
  for (const f of files) {
    const fr = JSON.parse(readFileSync(join(root, 'be-fr', f.replace(/\.md$/, '.json')), 'utf8'))
    const {fm, body} = fromMd(readFileSync(join(root, '_md', locale, f), 'utf8'), `${locale}/${f}`)
    const wpId = fr._id.replace('blog-legacy-be-fr-', '')
    const doc = {
      ...fr,
      _id: `blog-legacy-${locale}-${wpId}`,
      locale,
      title: fm.title,
      slug: {_type: 'slug', current: fm.slug},
      excerpt: fm.excerpt,
      seoTitle: fm.seoTitle,
      seoDescription: fm.seoDescription,
      _mainImageAlt: fm.mainImageAlt,
      body,
    }
    delete doc.legacyPath // translations live under /<locale>/blog/<slug>
    writeFileSync(join(out, f.replace(/\.md$/, '.json')), JSON.stringify(doc, null, 1))
  }
  console.log(`built ${files.length} ${locale} articles`)
} else {
  console.error('Usage: node scripts/blog-legacy-md.mjs export | build <locale>')
  process.exit(1)
}
