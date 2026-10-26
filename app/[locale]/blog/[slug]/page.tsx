import type {Metadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import {getBlogPostBySlug, getBlogTranslations} from '@/src/lib/blog'
import {type AppLocale} from '@/src/i18n/routes'
import {buildBlogAlternates, buildBlogLanguages} from '@/src/lib/seoAlternates'
import BlogArticle, {blogPostMetadata} from '../../components/BlogArticle'

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>
}): Promise<Metadata> {
  const {locale, slug} = await params
  const post = await getBlogPostBySlug(locale, slug).catch(() => null)
  const {canonical} = buildBlogAlternates(locale as AppLocale, slug)
  const versions = await getBlogTranslations(post?.translationKey).catch(() => [])
  return blogPostMetadata(post, canonical, buildBlogLanguages(versions))
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
