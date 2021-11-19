
const schema = {
  type: "object",
  required: ["messages_id", "deleted_for_everyone"],
  properties: {
    messages_id: {
      format: "array"
    },
    deleted_for_everyone: {
      format: "boolean",
      enum: [true, false]
    },
    user_id: {
      format: "numberOnly"
    }
  }
};

export default schema;