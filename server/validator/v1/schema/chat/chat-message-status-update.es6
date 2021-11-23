
const schema = {
  type: "object",
  required: ["messages_id", "is_read"],
  properties: {
    messages_id: {
      format: "array"
    },
    is_read: {
      format: "boolean",
      enum: [true, false]
    }
  }
};

export default schema;