
/**
 * SGC PRO - SAAS DATABASE ENGINE v2.0
 * Backend para persistência de sites baseados em DNA JSON.
 */

const DB_NAME = "SGC_DATABASE_PRO";
const TABLES = {
  SITES: "SITES_ATIVOS",
  LOGS: "AUDITORIA_SITES"
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = getOrCreateDatabase();
    const sheet = ss.getSheetByName(TABLES.SITES);
    
    // Logica de Slug e ID
    const siteId = "SGC-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    const brandName = data.brandName || "Site Sem Nome";
    const slug = generateSlug(brandName);
    const timestamp = new Date();

    // Persistência: [ID, DATA, SLUG, NOME, DNA_JSON]
    sheet.appendRow([
      siteId, 
      timestamp, 
      slug, 
      brandName, 
      JSON.stringify(data.dna)
    ]);

    // Registro de Auditoria
    ss.getSheetByName(TABLES.LOGS).appendRow([timestamp, "DEPLOY_SUCCESS", siteId, slug]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      siteId: siteId,
      url: slug,
      deployAt: timestamp.toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateDatabase() {
  const files = DriveApp.getFilesByName(DB_NAME);
  let ss;
  
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Instalação inicial do Banco de Dados
    ss = SpreadsheetApp.create(DB_NAME);
    
    // Aba de Sites
    const siteSheet = ss.getActiveSheet();
    siteSheet.setName(TABLES.SITES);
    siteSheet.appendRow(["ID_SITE", "DATA_CRIACAO", "SLUG", "MARCA", "DNA_JSON"]);
    siteSheet.getRange("1:1").setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
    
    // Aba de Logs
    const logSheet = ss.insertSheet(TABLES.LOGS);
    logSheet.appendRow(["TIMESTAMP", "EVENTO", "SITE_ID", "SLUG"]);
    logSheet.getRange("1:1").setFontWeight("bold").setBackground("#334155").setFontColor("#ffffff");
    
    ss.setSpreadsheetLocale('pt_BR');
  }
  return ss;
}

function generateSlug(text) {
  return text.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
