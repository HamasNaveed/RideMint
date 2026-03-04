export const APPS_SCRIPT_CODE = `
// ==========================================
// INDRIVE APP - GOOGLE APPS SCRIPT
// ==========================================
// 1. Open Google Sheets -> Extensions -> Apps Script
// 2. Paste this code.
// 3. Click "Deploy" -> "New deployment"
// 4. Select type "Web app"
// 5. Execute as "Me", Who has access "Anyone"
// 6. Click Deploy and copy the "Web app URL"

const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
        .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  // Ensure we have headers
  if (data.length === 0) {
    sheet.appendRow(["Date", "Type", "Description", "Amount (PKR)"]);
    return ContentService.createTextOutput(JSON.stringify({ data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1);
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({ data: result }))
      .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const body = JSON.parse(e.postData.contents);
    
    // Add new row based on body data
    // Expect body: { "Date": "04-Mar", "Type": "Earning", "Description": "Ride Income", "Amount (PKR)": 320 }
    
    const rowData = [
      body["Date"] || "",
      body["Type"] || "",
      body["Description"] || "",
      body["Amount (PKR)"] || 0
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// Support CORS Preflight
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
`;
