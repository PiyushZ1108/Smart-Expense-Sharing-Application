import { MONGODB_CONNECTION_URL } from "@/config";

export const dbConnection = {
  url: `${MONGODB_CONNECTION_URL}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
