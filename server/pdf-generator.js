import PDFDocument from "pdfkit";
import fs from "fs";

export const generatePDF = (data, filePath, callback) => {
  const writeStream = fs.createWriteStream(filePath);
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  try {
    doc.pipe(writeStream);
    doc
      .image(data.imageUrl, 170, 20, { width: 250, align: "center" })
      .moveDown()
      .fontSize(25)
      .text(`Car Details for ${data.car} ${data.model}`, 70, 230, {
        align: "center",
      })
      .fontSize(16)
      .moveDown()
      .text(`Car Model: ${data.model}`, { align: "center" })
      .moveDown()
      .text(`Year: ${data.year}`, { align: "center" })
      .moveDown()
      .text(`Horsepower: ${data.hp}`, { align: "center" })
      .moveDown()
      .text("Description:", { align: "center" })
      .moveDown()
      .fillColor("green")
      .text(data.description, {
        columns: 3,
        columnGap: 15,
        height: 100,
        width: 465,
        align: "justify",
      })
      .moveDown()
      .fillColor("red")
      .text("Mods:", { align: "center" })
      .moveDown()
      .fillColor("blue")
      .list(data.mods, {
        align: "left",
        width: 465,
        indent: 20,
        itemMarginTop: 5,
      });

    doc.end();
    writeStream.on("finish", () => {
      callback();
    });
  } catch (error) {
    console.error("Error creating PDF document:", error);
  }
};
