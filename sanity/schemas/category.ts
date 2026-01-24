export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description (SEO intro)',
      type: 'text',
      description: '150–300 words for category landing page',
    },
  ],

  preview: {
    select: { title: 'title' },
  },
}