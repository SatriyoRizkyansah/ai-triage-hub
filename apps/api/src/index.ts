import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.post("/tickets", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({ status: "created" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
