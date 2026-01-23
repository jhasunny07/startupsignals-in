export default {
  name: 'post',
  title: 'Post',
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
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Sunny Jha',
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      description: '150–160 characters for meta description',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
        { type: 'code' },
        { type: 'object', name: 'embed', title: 'Embed (YouTube/Vimeo)', fields: [{ name: 'url', type: 'url' }] },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      date: 'date',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.subtitle || 'Uncategorized'} • ${new Date(selection.date).toLocaleDateString()}`,
      }
    },
  },
}