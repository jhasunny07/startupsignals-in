import { defineType, defineField } from "sanity";

export const sharkTankSeason = defineType({
  name: "sharkTankSeason",
  title: "Shark Tank Season",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Season Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seasonNumber",
      title: "Season Number",
      type: "number",
      validation: (Rule) => Rule.required().integer(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Season Description",
      type: "text",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),
  ],
});
