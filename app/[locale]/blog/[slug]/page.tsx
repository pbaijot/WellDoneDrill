import type {Metadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import {getBlogPostBySlug} from '@/src/lib/blog'
import {type AppLocale} from '@/src/i18n/routes'
import {buildBlogAlternates} from '@/src/lib/seoAlternates'
import BlogArticle, {blogPostMetadata} from '../../components/BlogArticle'

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}): Promise<Metadata> {
  const {locale, slug} = await params
  const post = await getBlogPostBySlug(locale, slug).catch(() => null)
  const {canonical, languages} = buildBlogAlternates(locale as AppLocale, slug)
  return blogPostMetadata(post, canonical, languages)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}) {
  const {locale, slug} = await params
  const post = await getBlogPostBySlug(locale, slug)

  if (!post) {
    notFound()
  }

  // Restored WordPress articles live at their original URL
  if (post.legacyPath) {
    permanentRedirect(post.legacyPath)
  }

  return <BlogArticle locale={locale} post={post} />
}
