import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface LoanNoticeOptions {
  recipientName: string;
  lenderName: string;
  startDate: string,
  date: string;
  originalAmount: number;
  previousBalance: number;
  interestRate: string;
  newBalance: number;
  fileName?: string; // optional file name for download
}

export async function generateLoanNotice({
  recipientName,
  lenderName,
  date,
  startDate,
  originalAmount,
  previousBalance,
  interestRate,
  newBalance,
  fileName = 'Loan_Notice.pdf',
}: LoanNoticeOptions): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;
  const titleSize = 20;
  const black = rgb(0, 0, 0);

  const drawText = (text: string, x: number, y: number, size = fontSize) => {
    page.drawText(text, { x, y, size, font: timesRomanFont, color: black });
  };

  let y = 800;

  // Calculate time difference
const start = new Date(startDate);
const now = new Date();
const diffInMs = now.getTime() - start.getTime();
const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
const diffInWeeks = Math.floor(diffInDays / 7);

// Format duration string
let duration = 'recently';
if (diffInWeeks >= 1) {
  duration = `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''}`;
} else if (diffInDays >= 1) {
  duration = `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
}


  drawText('Loan Interest Notice', 200, y, titleSize); y -= 40;
  drawText(`Date: ${date}`, 50, y); y -= 30;
  drawText(`To: ${recipientName}`, 50, y); y -= 30;
  drawText(`From: ${lenderName}`, 50, y); y -= 40;

  drawText(`Dear ${recipientName},`, 50, y); y -= 30;
  drawText(  `This notice serves as an official reminder regarding the loan agreement entered into ${duration} ago.`, 50, y); y -= 20;
  drawText('As outlined in our agreed-upon terms, interest is applied weekly to the outstanding loan balance.', 50, y); y -= 30;

  drawText('Please review the updated loan information below:', 50, y); y -= 40;

  drawText('Loan Summary', 50, y); y -= 20;
  drawText(`Original Loan Amount: $${originalAmount}`, 60, y); y -= 20;
  drawText(`Previous Balance: $${previousBalance}`, 60, y); y -= 20;
  drawText(`Interest Rate: ${interestRate}% per week`, 60, y); y -= 20;
  drawText(`New Balance Due: $${newBalance}`, 60, y); y -= 40;

  drawText('Failure to comply with the terms of this agreement may result in additional penalties or legal action.', 50, y); y -= 20;
  drawText('This agreement is considered legally binding and enforceable under applicable law.', 50, y); y -= 20;
  drawText('If you have any questions or believe there is an error in this notice, please contact me as soon as possible.', 50, y); y -= 30;

  drawText('Thank you for your attention to this matter.', 50, y); y -= 40;

  drawText('Sincerely,', 50, y); y -= 20;
  drawText(lenderName, 50, y); y -= 40;

  drawText('The loan agreement you signed is a legally binding contract. Continued non-compliance may lead to court', 50, y); y -= 20;
  drawText('enforcement. Please ensure that you honor all terms and conditions to avoid further consequences.', 50, y);

  const pdfBytes = await pdfDoc.save();

  // 👉 Trigger download in the browser
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
