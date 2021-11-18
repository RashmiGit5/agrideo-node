
const schema = {
  type: "object",
  required: ['chat_id', "friend_id", "is_block"],
  properties: {
    chat_id: {
      format: "numberOnly"
    },
    friend_id: {
      format: "numberOnly"
    },
    status: {
      format: "boolean"
    }
  }
};

export default schema;