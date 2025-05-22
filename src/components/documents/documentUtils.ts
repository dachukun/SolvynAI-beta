
/**
 * Download document as HTML
 */
export const downloadDocumentAsHTML = (content: string, title: string): void => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        table td, table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        a {
          color: #0066cc;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download document as PDF
 * Note: This is a basic implementation that will prompt the browser's print dialog
 */
export const downloadDocumentAsPDF = (content: string, title: string): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          table td, table th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          a {
            color: #0066cc;
          }
          @media print {
            body { margin: 0; }
            a { color: black; text-decoration: none; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    alert("Please allow popups for PDF generation");
  }
};

/**
 * Download document as Word (.doc) format
 * Note: This creates a basic .doc file by setting the MIME type
 */
export const downloadDocumentAsWord = (content: string, title: string): void => {
  // Create a Word-compatible HTML document
  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        p { margin: 0; padding: 0; }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        table td, table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  const blob = new Blob([wordContent], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Helper function to convert HTML to plain text (for word count etc.)
 */
export const htmlToPlainText = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Helper function to generate placeholder text
 */
export const generatePlaceholderText = (paragraphs = 3): string => {
  const loremTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
  ];
  
  let result = '';
  for (let i = 0; i < paragraphs; i++) {
    result += `<p>${loremTexts[i % loremTexts.length]}</p>`;
  }
  return result;
};
