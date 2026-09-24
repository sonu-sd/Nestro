import "./config/env.js";
import app from "./app.js";
import connectDb from "./config/db.js";
import { validateEnvironment } from "./config/env.js";

validateEnvironment();
await connectDb();

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Nestro API listening on port ${port}`));
