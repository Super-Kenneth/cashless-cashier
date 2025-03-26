const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { printReceipt, testPrint } = require("./printer_function");

const app = express();
const PORT = 7890;

const corsSetting = {
  credentials: true,
  origin: "*",
};

app.use(cors(corsSetting));
app.use(bodyParser.json());

const printerRoute = express.Router();

printerRoute.post("/receipts", async (req, res) => {
  try {
    const response = await printReceipt(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("/printer Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

printerRoute.post("/test", async (req, res) => {
  try {
    const response = await testPrint(req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("/test-print Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.use("/printer", printerRoute);

app.listen(PORT, () => {
  console.log(`Printer server is running on http://localhost:${PORT}`);
});
