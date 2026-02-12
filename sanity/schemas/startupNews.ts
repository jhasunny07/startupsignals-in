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
      title: 'Executive Summary',
      type: 'array', 
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        }
      ],
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