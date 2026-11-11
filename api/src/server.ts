import app from "./app.js";

const port = process.env.PORT ?? 4100;
app.listen(port, () => console.log(`api listening on :${port}`));
