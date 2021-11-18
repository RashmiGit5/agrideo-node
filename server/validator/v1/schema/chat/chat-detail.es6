
const schema = {
  type: "object",
  required: ["chat_id"],
  properties: {
    chat_id: {
      format: "numberOnly"
    }
  }
};

export default schema;