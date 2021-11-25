
const schema = {
  type: "object",
  required: [],
  properties: {
    page_index: {
      format: "numberOnly"
    },
    page_size: {
      format: "numberOnly"
    },
    sort_order: {
      enum: ["asc", "desc"]
    },
    sort_by: {
      type: 'string',
    }
  }
};

export default schema;