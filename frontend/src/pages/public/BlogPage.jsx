// frontend/src/pages/public/BlogPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation();

  const posts = [
    {
      id: 1,
      title: t('blog.posts.post1.title'),
      excerpt: t('blog.posts.post1.excerpt'),
      author: 'David Thompson',
      date: '2024-01-15',
      category: t('blog.categories.market'),
      image: '/images/blog/post1.jpg'
    },
    {
      id: 2,
      title: t('blog.posts.post2.title'),
      excerpt: t('blog.posts.post2.excerpt'),
      author: 'Sarah Al-Zahra',
      date: '2024-01-10',
      category: t('blog.categories.technology'),
      image: '/images/blog/post2.jpg'
    },
    {
      id: 3,
      title: t('blog.posts.post3.title'),
      excerpt: t('blog.posts.post3.excerpt'),
      author: 'Ahmed Hassan',
      date: '2024-01-05',
      category: t('blog.categories.gulf'),
      image: '/images/blog/post3.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            {t('blog.hero.title')}
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto">
            {t('blog.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {t('blog.byAuthor', { author: post.author })}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {t('blog.readMore')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default { BlogPage };