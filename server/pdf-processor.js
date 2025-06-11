import fs from "fs";
import { sendEmail } from "./email-sender.js";
import { generatePDF } from "./pdf-generator.js";

export const processPDF = (data, email, callback) => {
  const fileName = `${data.car}-${data.model}-${data.id}.pdf`;
  const filePath = `../static/${fileName}`;
  console.log("pdf start generation");

  generatePDF(data, filePath, async () => {
    if (email) {
      const result = await sendEmail(
        email,
        data.car,
        `Car selected: ${data.car} ${data.model} (${data.year}) with ${data.hp} HP.`,
        {
          name: fileName,
          path: filePath,
          content: fs.readFileSync(filePath),
        }
      );
      console.log("Email sent successfully:", result);
    }
    console.log("PDF processing completed");
    callback(null, {
      status: "success",
      message: "PDF generated and email sent successfully",
      filePath: filePath,
      fileName: fileName,
    });
  });
  console.log("pdf generated");
};
