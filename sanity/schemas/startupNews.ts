export default {
  name: 'startupNews',
  title: 'Startup News',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'summary',
      type: 'text',
    },
    {
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'publishedAt',
      type: 'datetime',
    },
    {
      name: 'source',
      type: 'url',
    },
  ],
}
