import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import apiV1 from "./apis/v1";

const port = 5001;

const app = express();

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: ["Link"],
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json({ limit: "50MB" }));
app.use(express.static(path.join(__dirname, "public")));


const server = app.listen(port, () => {
  console.log('\x1b[33m%s\x1b[0m', `Port listen on :  ${port}`);
});

// for prod build
app.use('/api/v1', apiV1());

export default app;
