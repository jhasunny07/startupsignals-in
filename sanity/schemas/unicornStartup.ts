export default {
  name: "unicornStartup",
  title: "Unicorn Startup",
  type: "document",
  fields: [
    { name: "name", title: "Company Name", type: "string" },
    { name: "rank", title: "Rank", type: "number" },
    { name: "valuation", title: "Valuation (Number)", type: "number" }, 
    {
      name: "currency",
      title: "Currency",
      type: "string",
      options: { list: ["USD", "INR", "EUR", "GBP"] }, // dropdown
    },
    { name: "foundedYear", title: "Founded Year", type: "number" },
    { name: "country", title: "Country", type: "string" },
    { name: "description", title: "Description", type: "text" },
    {
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    },
  ],
};
