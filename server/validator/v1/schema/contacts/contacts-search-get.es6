
const schema = {
  type: "object",
  required: ["username"],
  properties: {
    username: {
      format: "string"
    }
  }
};

export default schema;