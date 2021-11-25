
const schema = {
  type: "object",
  required: ["friend_id"],
  properties: {
    friend_id: {
      format: "numberOnly"
    }
  }
};

export default schema;