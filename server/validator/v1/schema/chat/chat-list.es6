
const schema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: {
      format: "numberOnly"
    },
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