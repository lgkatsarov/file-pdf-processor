import express from "express";
import { processPDF } from "./pdf-processor.js";
import fs from "fs";

import { CARS_DATA } from "./data.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/cars", (req, res) => {
  if (!req.body || !req.body.ownerName) {
    return res.status(400).json({ error: "Owner name is required" });
  }
  const ownerName = req.body.ownerName.toLowerCase();
  const carData = CARS_DATA[ownerName];

  if (!carData) {
    return res.json([]);
  }

  res.status(200).json(carData);
});

app.post("/api/pdf", (req, res) => {
  const { ownerName, carId } = req.body;
  if (!ownerName || !carId) {
    return res
      .status(400)
      .json({ error: "Owner name and car ID are required" });
  }
  const carData = CARS_DATA[ownerName.toLowerCase()].find(
    (car) => car.id === parseInt(carId)
  );
  if (!carData) {
    return res.status(404).json({ error: "Car not found" });
  }

  processPDF(carData, req.body.email, (err, result) => {
    res.json(result);
  });
});

app.get("/api/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `../static/${fileName}`;

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      return res.status(500).json({ error: "Error downloading file" });
    }
  });
});

app.post("/api/upload", (req, res) => {
  const fileName = req.headers["x-filename"];
  const filePath = "./uploads/" + fileName;
  const writeStream = fs.createWriteStream(filePath);

  req.pipe(writeStream);
  req.on("end", () => {
    res.json({
      status: "success",
      message: "File uploaded successfully",
      filePath: filePath,
    });
  });
});

app.get("/api/files", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Error reading directory" });
    }
    res.json(files);
  });
});

app.get("/api/files/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `./uploads/${fileName}`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.setHeader("Content-Type", "application/octet-stream");

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on("error", (err) => {
    console.error("Read error:", err);
    res.status(500).send("Error reading file");
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
