import { DATATABLE } from "../../../../config/datatable";

const schema = {
  type: "object",
  required: ["chat_id"],
  properties: {
    chat_id: {
      format: "numberOnly"
    },
    page_index: {
      format: "numberOnly"
    },
    page_size: {
      format: "numberOnly"
    }
  }
};

export default schema;