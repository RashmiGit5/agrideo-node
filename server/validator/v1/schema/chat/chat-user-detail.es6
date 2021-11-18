
const schema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: {
      format: "numberOnly"
    }
  }
};

export default schema;