/**
 * MCP (Model Context Protocol) Integration Layer
 * 
 * This module provides a thin adapter layer for Gmail and Google Drive MCP servers.
 * For MVP, these are functional stubs that return mock data structures.
 * The architecture allows swapping in real MCP calls with OAuth tokens later.
 */

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  attachments: Array<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
  }>;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink?: string;
}

/**
 * Search Gmail for tax-related messages
 * STUB: Returns mock data. Real implementation would use Gmail MCP server.
 */
export async function searchGmailForTaxDocs(
  query?: string,
  year?: number
): Promise<GmailMessage[]> {
  // Mock data for development
  const mockMessages: GmailMessage[] = [
    {
      id: "gmail_mock_1",
      subject: "Your W-2 Form is Ready",
      from: "payroll@acmecorp.com",
      date: new Date("2024-01-25").toISOString(),
      snippet: "Your W-2 form for tax year 2023 is now available...",
      attachments: [
        {
          id: "att_1",
          filename: "W2_2023_JohnDoe.pdf",
          mimeType: "application/pdf",
          size: 45230,
        },
      ],
    },
    {
      id: "gmail_mock_2",
      subject: "1099-NEC Form Available",
      from: "noreply@freelanceplatform.com",
      date: new Date("2024-01-30").toISOString(),
      snippet: "Your 1099-NEC form is ready to download...",
      attachments: [
        {
          id: "att_2",
          filename: "1099-NEC_2023.pdf",
          mimeType: "application/pdf",
          size: 38912,
        },
      ],
    },
    {
      id: "gmail_mock_3",
      subject: "Mortgage Interest Statement (1098)",
      from: "statements@bigbankmortgage.com",
      date: new Date("2024-02-01").toISOString(),
      snippet: "Your 2023 mortgage interest statement is attached...",
      attachments: [
        {
          id: "att_3",
          filename: "1098_MortgageInterest_2023.pdf",
          mimeType: "application/pdf",
          size: 52100,
        },
      ],
    },
  ];

  console.log(
    "[MCP STUB] searchGmailForTaxDocs called with query:",
    query,
    "year:",
    year
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockMessages;
}

/**
 * Fetch Gmail attachment
 * STUB: Returns null. Real implementation would download attachment.
 */
export async function fetchGmailAttachment(
  messageId: string,
  attachmentId: string
): Promise<Buffer | null> {
  console.log(
    "[MCP STUB] fetchGmailAttachment called for message:",
    messageId,
    "attachment:",
    attachmentId
  );

  // In real implementation, this would:
  // 1. Call Gmail MCP server to download attachment
  // 2. Return the file buffer
  
  // For now, return null
  return null;
}

/**
 * List files in Google Drive folder
 * STUB: Returns mock data. Real implementation would use Drive MCP server.
 */
export async function listDriveFiles(
  folderId?: string,
  query?: string
): Promise<DriveFile[]> {
  // Mock data for development
  const mockFiles: DriveFile[] = [
    {
      id: "drive_mock_1",
      name: "Tax Documents 2023",
      mimeType: "application/vnd.google-apps.folder",
      size: 0,
      modifiedTime: new Date("2023-12-15").toISOString(),
    },
    {
      id: "drive_mock_2",
      name: "W2_Acme_2023.pdf",
      mimeType: "application/pdf",
      size: 47850,
      modifiedTime: new Date("2024-01-20").toISOString(),
      webViewLink: "https://drive.google.com/file/d/mock_2/view",
    },
    {
      id: "drive_mock_3",
      name: "Receipts_Q4_2023.pdf",
      mimeType: "application/pdf",
      size: 125600,
      modifiedTime: new Date("2024-01-05").toISOString(),
      webViewLink: "https://drive.google.com/file/d/mock_3/view",
    },
    {
      id: "drive_mock_4",
      name: "Charitable_Donations_2023.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 23400,
      modifiedTime: new Date("2023-12-31").toISOString(),
      webViewLink: "https://drive.google.com/file/d/mock_4/view",
    },
  ];

  console.log(
    "[MCP STUB] listDriveFiles called with folderId:",
    folderId,
    "query:",
    query
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockFiles;
}

/**
 * Download file from Google Drive
 * STUB: Returns null. Real implementation would download file.
 */
export async function downloadDriveFile(
  fileId: string
): Promise<Buffer | null> {
  console.log("[MCP STUB] downloadDriveFile called for file:", fileId);

  // In real implementation, this would:
  // 1. Call Drive MCP server to download file
  // 2. Return the file buffer
  
  // For now, return null
  return null;
}

/**
 * Check if MCP integrations are configured
 */
export function isMCPConfigured(): {
  gmail: boolean;
  drive: boolean;
} {
  return {
    gmail: false, // Would check for MCP_GMAIL_CREDENTIALS_JSON_BASE64
    drive: false, // Would check for MCP_GOOGLE_DRIVE_CREDENTIALS_JSON_BASE64
  };
}

