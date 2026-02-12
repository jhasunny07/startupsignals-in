import { defineType, defineField } from "sanity";

export const sharkTankStartup = defineType({
  name: "sharkTankStartup",
  title: "Shark Tank Startup",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Startup Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "companyName",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "industry",
      title: "Industry / Category",
      type: "string",
    }),

    // Shark Tank Info
    defineField({
      name: "season",
      title: "Season",
      type: "reference",
      to: [{ type: "sharkTankSeason" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "episodeNumber",
      title: "Episode Number",
      type: "number",
    }),

    defineField({
      name: "pitchAmount",
      title: "Pitch Amount (₹)",
      type: "number",
    }),

    defineField({
      name: "equityAsked",
      title: "Equity Asked (%)",
      type: "number",
    }),

    defineField({
      name: "dealStatus",
      title: "Deal Status",
      type: "string",
      options: {
        list: [
          { title: "Deal", value: "deal" },
          { title: "No Deal", value: "no-deal" },
          { title: "Deal Cancelled", value: "cancelled" },
        ],
      },
    }),

    defineField({
      name: "currentStatus",
      title: "Current Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Shut Down", value: "shut-down" },
          { title: "Acquired", value: "acquired" },
        ],
      },
    }),

    defineField({
      name: "fundingRaisedPostShow",
      title: "Funding Raised After Show",
      type: "string",
    }),

    defineField({
      name: "shortSummary",
      title: "Short Summary",
      type: "text",
    }),

    defineField({
      name: "detailedJourney",
      title: "Detailed Journey",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    }),

    // SEO
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
