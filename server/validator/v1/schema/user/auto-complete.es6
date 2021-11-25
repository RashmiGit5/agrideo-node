
const schema = {
  type: "object",
  required: ["search_key"],
  properties: {
    search_key: {
      format: "string"
    }
  }
};

export default schema;