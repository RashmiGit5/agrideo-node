
const schema = {
  type: "object",
  required: ["user_id", "status"],
  properties: {
    user_id: {
      format: "numberOnly"
    },
    status: {
      format: "numberOnly",
      enum: [0, 1, 2, 3]
    }
  }
};

export default schema;