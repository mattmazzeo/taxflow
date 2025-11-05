/**
 * MCP (Model Context Protocol) Integration Layer
 * 
 * This module provides integration with Gmail and Google Drive APIs
 * using OAuth tokens from Supabase's Google authentication provider.
 */

import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

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
 * Get Google OAuth2 client with tokens from Supabase session
 */
async function getGoogleAuth() {
  const supabase = await createClient();
  
  // Get the current session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error("No active session found. Please sign in with Google.");
  }

  // Check if user signed in with Google OAuth
  const providerToken = session.provider_token;
  const providerRefreshToken = session.provider_refresh_token;

  if (!providerToken) {
    throw new Error(
      "No Google OAuth tokens found. Please sign in with Google to access Gmail and Drive."
    );
  }

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2();
  
  // Set credentials
  oauth2Client.setCredentials({
    access_token: providerToken,
    refresh_token: providerRefreshToken,
  });

  return oauth2Client;
}

/**
 * Search Gmail for tax-related messages
 * Uses real Gmail API with OAuth tokens from Supabase session
 */
export async function searchGmailForTaxDocs(
  query?: string,
  year?: number
): Promise<GmailMessage[]> {
  try {
    const auth = await getGoogleAuth();
    const gmail = google.gmail({ version: "v1", auth });

    // Build search query for tax-related emails
    let searchQuery = query || "";
    
    // Add common tax document keywords if no specific query provided
    if (!searchQuery) {
      const taxKeywords = [
        "W-2",
        "W2",
        "1099",
        "1098",
        "tax form",
        "tax document",
        "tax statement",
        "K-1",
      ];
      searchQuery = taxKeywords.map((kw) => `"${kw}"`).join(" OR ");
    }

    // Add year filter if provided
    if (year) {
      searchQuery += ` after:${year}/01/01 before:${year}/12/31`;
    }

    // Add has:attachment filter to only get emails with attachments
    searchQuery += " has:attachment";

    console.log("[Gmail API] Searching with query:", searchQuery);

    // Search for messages
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: searchQuery,
      maxResults: 50, // Limit to 50 most recent
    });

    const messages = listResponse.data.messages || [];
    
    if (messages.length === 0) {
      console.log("[Gmail API] No messages found");
      return [];
    }

    console.log(`[Gmail API] Found ${messages.length} messages`);

    // Fetch full details for each message
    const gmailMessages: GmailMessage[] = [];

    for (const message of messages) {
      if (!message.id) continue;

      const detailResponse = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      const msgData = detailResponse.data;
      const headers = msgData.payload?.headers || [];

      // Extract headers
      const subject =
        headers.find((h) => h.name?.toLowerCase() === "subject")?.value || "(No Subject)";
      const from =
        headers.find((h) => h.name?.toLowerCase() === "from")?.value || "Unknown";
      const date =
        headers.find((h) => h.name?.toLowerCase() === "date")?.value ||
        new Date().toISOString();

      // Parse attachments
      const attachments: GmailMessage["attachments"] = [];
      
      const parts = msgData.payload?.parts || [];
      for (const part of parts) {
        if (part.filename && part.body?.attachmentId) {
          attachments.push({
            id: part.body.attachmentId,
            filename: part.filename,
            mimeType: part.mimeType || "application/octet-stream",
            size: part.body.size || 0,
          });
        }
      }

      // Also check nested parts (multipart messages)
      const checkNestedParts = (parts: any[]): void => {
        for (const part of parts) {
          if (part.filename && part.body?.attachmentId) {
            attachments.push({
              id: part.body.attachmentId,
              filename: part.filename,
              mimeType: part.mimeType || "application/octet-stream",
              size: part.body.size || 0,
            });
          }
          if (part.parts) {
            checkNestedParts(part.parts);
          }
        }
      };

      if (msgData.payload?.parts) {
        checkNestedParts(msgData.payload.parts);
      }

      gmailMessages.push({
        id: msgData.id!,
        subject,
        from,
        date: new Date(date).toISOString(),
        snippet: msgData.snippet || "",
        attachments,
      });
    }

    console.log(`[Gmail API] Parsed ${gmailMessages.length} messages with attachments`);
    return gmailMessages;
  } catch (error) {
    console.error("[Gmail API] Error searching messages:", error);
    throw new Error(
      `Failed to search Gmail: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Fetch Gmail attachment
 * Downloads attachment from Gmail using real Gmail API
 */
export async function fetchGmailAttachment(
  messageId: string,
  attachmentId: string
): Promise<Buffer | null> {
  try {
    const auth = await getGoogleAuth();
    const gmail = google.gmail({ version: "v1", auth });

    console.log(
      `[Gmail API] Fetching attachment ${attachmentId} from message ${messageId}`
    );

    const attachment = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId,
      id: attachmentId,
    });

    if (!attachment.data.data) {
      console.error("[Gmail API] No attachment data returned");
      return null;
    }

    // Gmail returns base64url encoded data, convert to Buffer
    // base64url uses - and _ instead of + and /
    const base64Data = attachment.data.data
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const buffer = Buffer.from(base64Data, "base64");

    console.log(
      `[Gmail API] Successfully fetched attachment (${buffer.length} bytes)`
    );

    return buffer;
  } catch (error) {
    console.error("[Gmail API] Error fetching attachment:", error);
    throw new Error(
      `Failed to fetch Gmail attachment: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * List files in Google Drive folder
 * Uses real Google Drive API with OAuth tokens from Supabase session
 */
export async function listDriveFiles(
  folderId?: string,
  query?: string
): Promise<DriveFile[]> {
  try {
    const auth = await getGoogleAuth();
    const drive = google.drive({ version: "v3", auth });

    // Build search query
    let searchQuery = "";

    // Filter by folder if specified
    if (folderId) {
      searchQuery += `'${folderId}' in parents`;
    }

    // Add custom query if provided
    if (query) {
      if (searchQuery) searchQuery += " and ";
      searchQuery += `(name contains '${query}' or fullText contains '${query}')`;
    } else {
      // Default: search for tax-related files
      const taxKeywords = [
        "W-2",
        "W2",
        "1099",
        "1098",
        "tax",
        "receipt",
        "invoice",
        "K-1",
      ];
      const nameQueries = taxKeywords
        .map((kw) => `name contains '${kw}'`)
        .join(" or ");
      
      if (searchQuery) searchQuery += " and ";
      searchQuery += `(${nameQueries})`;
    }

    // Exclude trashed files
    searchQuery += " and trashed = false";

    console.log("[Drive API] Searching with query:", searchQuery);

    // List files
    const response = await drive.files.list({
      q: searchQuery,
      fields:
        "files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink)",
      pageSize: 100, // Max 100 files
      orderBy: "modifiedTime desc",
    });

    const files = response.data.files || [];

    console.log(`[Drive API] Found ${files.length} files`);

    const driveFiles: DriveFile[] = files.map((file) => ({
      id: file.id!,
      name: file.name || "Untitled",
      mimeType: file.mimeType || "application/octet-stream",
      size: parseInt(file.size || "0", 10),
      modifiedTime: file.modifiedTime || new Date().toISOString(),
      webViewLink: file.webViewLink || undefined,
    }));

    return driveFiles;
  } catch (error) {
    console.error("[Drive API] Error listing files:", error);
    throw new Error(
      `Failed to list Drive files: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Download file from Google Drive
 * Uses real Google Drive API to download file content
 */
export async function downloadDriveFile(
  fileId: string
): Promise<Buffer | null> {
  try {
    const auth = await getGoogleAuth();
    const drive = google.drive({ version: "v3", auth });

    console.log(`[Drive API] Downloading file ${fileId}`);

    // First, get file metadata to determine if it's a Google Workspace file
    const metadata = await drive.files.get({
      fileId,
      fields: "mimeType, name",
    });

    const mimeType = metadata.data.mimeType;
    const fileName = metadata.data.name;

    console.log(
      `[Drive API] File: ${fileName}, MIME type: ${mimeType}`
    );

    // Handle Google Workspace files (Docs, Sheets, Slides) - export as PDF
    if (mimeType?.startsWith("application/vnd.google-apps.")) {
      console.log("[Drive API] Exporting Google Workspace file as PDF");
      
      const response = await drive.files.export(
        {
          fileId,
          mimeType: "application/pdf",
        },
        {
          responseType: "arraybuffer",
        }
      );

      const buffer = Buffer.from(response.data as ArrayBuffer);
      console.log(
        `[Drive API] Successfully exported file (${buffer.length} bytes)`
      );
      return buffer;
    } else {
      // Regular file - download directly
      const response = await drive.files.get(
        {
          fileId,
          alt: "media",
        },
        {
          responseType: "arraybuffer",
        }
      );

      const buffer = Buffer.from(response.data as ArrayBuffer);
      console.log(
        `[Drive API] Successfully downloaded file (${buffer.length} bytes)`
      );
      return buffer;
    }
  } catch (error) {
    console.error("[Drive API] Error downloading file:", error);
    throw new Error(
      `Failed to download Drive file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Check if MCP integrations are configured
 * Checks if user has authenticated with Google OAuth
 */
export async function isMCPConfigured(): Promise<{
  gmail: boolean;
  drive: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Check if user has Google OAuth provider tokens
    const hasGoogleAuth = !!(session?.provider_token);

    return {
      gmail: hasGoogleAuth,
      drive: hasGoogleAuth,
    };
  } catch (error) {
    console.error("[MCP] Error checking configuration:", error);
    return {
      gmail: false,
      drive: false,
    };
  }
}

