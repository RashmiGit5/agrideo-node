
const schema = {
  type: "object",
  required: ["user_id", "search_key"],
  properties: {
    user_id: {
      format: "string"
    },
    search_key: {
      format: "string"
    }
  }
};

export default schema;