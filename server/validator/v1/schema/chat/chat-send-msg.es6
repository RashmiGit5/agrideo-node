
const schema = {
  type: "object",
  required: ["chat_id", "sender_id"],
  properties: {
    chat_id: {
      format: "numberOnly"
    },
    sender_id: {
      format: "numberOnly"
    },
    msg: {
      format: "string"
    },
    attachment_url: {
      format: "string"
    },
    attachment_type: {
      format: "string"
    }
  }
};

export default schema;