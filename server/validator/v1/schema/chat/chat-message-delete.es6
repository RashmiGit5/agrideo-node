
const schema = {
  type: "object",
  required: ["messages_id", "status"],
  properties: {
    messages_id: {
      format: "array"
    },
    status: {
      format: "numberOnly",
      enum: [1, 2]
    }
  }
};

export default schema;