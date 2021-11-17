
const schema = {
  type: "object",
  required: ["user_id", "friend_id"],
  properties: {
    user_id: {
      format: "numberOnly"
    },
    friend_id: {
      format: "numberOnly"
    }
  }
};

export default schema;