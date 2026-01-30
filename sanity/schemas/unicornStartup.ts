export default {
  name: "unicornStartup",
  title: "Unicorn Startup",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Company Name",
      type: "string",
    },

    {
      name: "anchor",
      title: "Anchor ID",
      type: "string",
      description:
        "Used for sidebar scrolling (example: stripe, byju, razorpay). Must be unique.",
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: "rank",
      title: "Unicorn Rank (Order of becoming unicorn)",
      type: "number",
    },

    {
      name: "valuation",
      title: "Valuation",
      type: "number",
    },

    {
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: ["USD", "INR", "EUR", "GBP"],
      },
    },

    {
      name: "foundedYear",
      title: "Founded Year",
      type: "number",
    },

    {
      name: "country",
      title: "Country",
      type: "string",
    },

    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
    },

    {
      name: "content",
      title: "Detailed Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    },
  ],
};
