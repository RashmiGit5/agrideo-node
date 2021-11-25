
const schema = {
  type: "object",
  required: ["status"],
  properties: {
    status: {
      format: "numberOnly",
      enum: [0, 1, 2, 3]
    }
  }
};

export default schema;