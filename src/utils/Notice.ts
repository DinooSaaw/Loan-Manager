import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface LoanOptions {
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

export async function generateLoanReminder({
  recipientName,
  lenderName,
  date,
  startDate,
  originalAmount,
  previousBalance,
  interestRate,
  newBalance,
  fileName = 'Loan_Reminder.pdf',
}: LoanOptions): Promise<void> {
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
drawText('Loan Reminder', 200, y, titleSize); y -= 40;
drawText(`Date: ${date}`, 50, y); y -= 30;
drawText(`To: ${recipientName}`, 50, y); y -= 30;
drawText(`From: ${lenderName}`, 50, y); y -= 40;

drawText(`Dear ${recipientName},`, 50, y); y -= 30;
drawText(`This notice serves as a reminder regarding your loan balance and its associated terms.`, 50, y); y -= 20;
drawText('As per the agreed terms, interest is applied weekly to the outstanding loan balance.', 50, y); y -= 30;

drawText(`Your loan has been active for ${duration}.`, 50, y); y -= 30;

drawText('Please find the updated loan details below:', 50, y); y -= 40;

drawText('Loan Summary', 50, y); y -= 20;
drawText(`Original Loan Amount: $${originalAmount}`, 60, y); y -= 20;
drawText(`Current Balance: $${previousBalance}`, 60, y); y -= 20;
drawText(`Interest Rate: ${interestRate}% per week`, 60, y); y -= 20;
drawText(`Updated Balance Due: $${newBalance}`, 60, y); y -= 40;

drawText('We kindly remind you to review the terms of your loan agreement and ensure timely payments.', 50, y); y -= 20;
drawText('This agreement is legally binding and enforceable under applicable law.', 50, y); y -= 20;
drawText('If you have any questions or believe there is an error in this notice, please contact us promptly.', 50, y); y -= 30;

drawText('Thank you for your attention to this matter.', 50, y); y -= 40;

drawText('Sincerely,', 50, y); y -= 20;
drawText(lenderName, 50, y); y -= 40;

drawText('The loan agreement you entered is a legally binding contract. Continued non-compliance may result in court', 50, y); y -= 20;
drawText('enforcement. Please ensure that you fulfill all terms and conditions to avoid further consequences.', 50, y);
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
}: LoanOptions): Promise<void> {
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

  // Header
  drawText('Loan Notice', 200, y, titleSize); y -= 40;
  drawText(`Date: ${date}`, 50, y); y -= 30;
  drawText(`To: ${recipientName}`, 50, y); y -= 30;
  drawText(`From: ${lenderName}`, 50, y); y -= 40;

  // Body
  drawText(`Dear ${recipientName},`, 50, y); y -= 30;
  drawText(
    `This notice is to inform you that interest has been applied to your loan balance as per the agreed terms.`,
    50,
    y
  ); y -= 20;
  drawText(
    `The updated loan terms are outlined below. Please review them carefully.`,
    50,
    y
  ); y -= 30;

  drawText(`Your loan has been active for ${duration}.`, 50, y); y -= 30;

  drawText('Updated Loan Terms:', 50, y); y -= 40;

  // Loan Summary
  drawText('Loan Summary', 50, y); y -= 20;
  drawText(`Original Loan Amount: $${originalAmount}`, 60, y); y -= 20;
  drawText(`Previous Balance: $${previousBalance}`, 60, y); y -= 20;
  drawText(`Interest Rate: ${interestRate}% per week`, 60, y); y -= 20;
  drawText(`New Balance Due: $${newBalance}`, 60, y); y -= 40;

  drawText(
    'Please ensure timely payments to avoid additional interest or penalties.',
    50,
    y
  ); y -= 20;
  drawText(
    'If you have any questions or believe there is an error in this notice, please contact us promptly.',
    50,
    y
  ); y -= 30;

  drawText('Thank you for your attention to this matter.', 50, y); y -= 40;

  // Footer
  drawText('Sincerely,', 50, y); y -= 20;
  drawText(lenderName, 50, y); y -= 40;

  drawText(
    'This notice serves as a legally binding document. Continued non-compliance may result in further action.',
    50,
    y
  );

  // Save PDF
  const pdfBytes = await pdfDoc.save();

  // Trigger download in the browser
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

export async function generatePauseNotice({
  recipientName,
  lenderName,
  date,
  cyclesPaused,
  interestType,
  fileName = 'Loan_Pause_Notice.pdf',
}: {
  recipientName: string;
  lenderName: string;
  date: string;
  cyclesPaused: number;
  interestType: 'daily' | 'weekly';
  fileName?: string;
}): Promise<void> {
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

  // Convert interestType to singular form for better readability
  const cycleType = interestType === 'daily' ? 'day' : 'week';

  drawText('Loan Pause Notice', 200, y, titleSize); y -= 40;
  drawText(`Date: ${date}`, 50, y); y -= 30;
  drawText(`To: ${recipientName}`, 50, y); y -= 30;
  drawText(`From: ${lenderName}`, 50, y); y -= 40;

  drawText(
    `This notice is to inform you that your loan has been paused for ${cyclesPaused} ${cycleType}${cyclesPaused > 1 ? 's' : ''}.`,
    50,
    y
  );
  y -= 30;

  drawText(
    'During this period, no interest will be applied to your loan balance.',
    50,
    y
  );
  y -= 30;

  drawText('Thank you for your cooperation.', 50, y);

  const pdfBytes = await pdfDoc.save();
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

export async function generateResumeNotice({
  recipientName,
  lenderName,
  date,
  originalAmount,
  interestRate,
  startDate,
  fileName = 'Loan_Resume_Notice.pdf',
}: {
  recipientName: string;
  lenderName: string;
  date: string;
  originalAmount: number;
  interestRate: string;
  startDate: string;
  fileName?: string;
}): Promise<void> {
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

  drawText('Loan Resume Notice', 200, y, titleSize); y -= 40;
  drawText(`Date: ${date}`, 50, y); y -= 30;
  drawText(`To: ${recipientName}`, 50, y); y -= 30;
  drawText(`From: ${lenderName}`, 50, y); y -= 40;

  drawText(
    'This notice is to inform you that your loan has been resumed.',
    50,
    y
  ); 
  y -= 20;
  drawText(
    'Interest will now be applied as per the original terms.',
    50,
    y
  );
  y -= 30;

  drawText('Original Loan Terms:', 50, y); y -= 40;

  // Display original loan details
  drawText(`Original Loan Amount: $${originalAmount.toFixed(2)}`, 60, y); y -= 20;
  drawText(`Interest Rate: ${interestRate}%`, 60, y); y -= 20;
  drawText(`Start Date: ${new Date(startDate).toLocaleDateString()}`, 60, y); y -= 30;

  drawText('Thank you for your cooperation.', 50, y);

  const pdfBytes = await pdfDoc.save();
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