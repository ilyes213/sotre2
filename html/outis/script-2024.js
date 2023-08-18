function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('AutoFill Docs');
  menu.addItem('Create New Docs', 'createNewGoogleDocs')
  menu.addToUi();

}

function createNewGoogleDocs() {
  //This value should be the id of your document template that we created in the last step
  const googleDocTemplate = DriveApp.getFileById('1xYbJw1905PUdjuumaRH35Ia0O-2P3bdYteqWwv_mhVw');
  
  //This value should be the id of the folder where you want your completed documents stored
  const destinationFolder = DriveApp.getFolderById('1nyPe3veacLK9f4QkOuzfFwWRXrvwaEsj')
  //Here we store the sheet as a variable
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('sheet1')
  
  //Now we get all of the values as a 2D array
  const rows = sheet.getDataRange().getValues();
  
  //Start processing each spreadsheet row
  rows.forEach(function(row, index){
    //Here we check if this row is the headers, if so we skip it
    if (index === 1) return;
    //Here we check if a document has already been generated by looking at 'Document Link', if so we skip it
    if (row[6]) return;
    //Using the row data in a template literal, we make a copy of our template document in our destinationFolder
    const copy = googleDocTemplate.makeCopy(`${row[1]}, ${row[0]} Employee Details` , destinationFolder)
    //Once we have the copy, we then open it using the DocumentApp
    const doc = DocumentApp.openById(copy.getId())
    //All of the content lives in the body, so we get that for editing
    const body = doc.getBody();
    //In this line we do some friendly date formatting, that may or may not work for you locale
    const friendlyDate = new Date(row[0]).toLocaleDateString();
    
    //In these lines, we replace our replacement tokens with values from our spreadsheet row
     body.replaceText('{{Full Name}}', row[1]);
    body.replaceText('{{Your Address}}', row[2]);
    body.replaceText('{{Your City}}', row[3]);
    body.replaceText('{{Your City2}}', row[4]);
    body.replaceText('{{Your Email}}', row[5]);
    
    //We make our changes permanent by saving and closing the document
    doc.saveAndClose();
    //Store the url of our new document in a variable
    const url = doc.getUrl();
    //Write that value back to the 'Document Link' column in the spreadsheet. 
    sheet.getRange(index + 1, 7).setValue(url)
    
  })
  
}





