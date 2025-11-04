import OpenAI from "openai";
import { z } from "zod";

// Dynamic import for pdf-parse to handle ESM/CJS compatibility
const getPdfParse = async () => {
  const pdfParse = await import("pdf-parse");
  return pdfParse.default || pdfParse;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schemas for validation
const ExtractedEntitySchema = z.object({
  key: z.string(),
  value: z.string(),
  confidence: z.number().min(0).max(100),
});

const DocumentAnalysisSchema = z.object({
  entityType: z.enum([
    "W2",
    "1099-NEC",
    "1099-MISC",
    "1099-INT",
    "1099-DIV",
    "1098",
    "K1",
    "RECEIPT",
    "OTHER",
  ]),
  fields: z.array(ExtractedEntitySchema),
});

type ExtractedEntity = z.infer<typeof ExtractedEntitySchema>;
type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdf = await getPdfParse();
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Detect document type and extract structured data using OpenAI
 */
export async function detectAndExtract(
  text: string,
  filename: string
): Promise<DocumentAnalysis> {
  const prompt = `You are a tax document analyzer. Analyze the following document text and extract structured information.

Document Filename: ${filename}
Document Text:
${text.substring(0, 4000)} // Limit text to avoid token limits

IMPORTANT: Respond with a valid JSON object only, no additional text.

Your response must follow this exact format:
{
  "entityType": "W2" | "1099-NEC" | "1099-MISC" | "1099-INT" | "1099-DIV" | "1098" | "K1" | "RECEIPT" | "OTHER",
  "fields": [
    {
      "key": "field_name",
      "value": "field_value",
      "confidence": 95
    }
  ]
}

Document Type Detection Rules:
- W2: Look for "Wage and Tax Statement", "Form W-2", boxes 1-20
- 1099-NEC: Look for "Nonemployee Compensation", "Form 1099-NEC"
- 1099-MISC: Look for "Miscellaneous Information", "Form 1099-MISC"
- 1099-INT: Look for "Interest Income", "Form 1099-INT"
- 1099-DIV: Look for "Dividends and Distributions", "Form 1099-DIV"
- 1098: Look for "Mortgage Interest Statement", "Form 1098"
- K1: Look for "Schedule K-1", "Partner's Share"
- RECEIPT: Look for receipt indicators (store names, transaction IDs, totals)
- OTHER: If none of the above match

Field Extraction Guidelines by Type:

W2 Fields:
- employer_name
- employer_ein
- employee_name
- employee_ssn (mask as ***-**-XXXX)
- wages_tips_compensation (box 1)
- federal_income_tax_withheld (box 2)
- social_security_wages (box 3)
- social_security_tax_withheld (box 4)
- medicare_wages (box 5)
- medicare_tax_withheld (box 6)
- state
- state_wages
- state_income_tax
- tax_year

1099-NEC Fields:
- payer_name
- payer_ein
- payer_address
- recipient_name
- recipient_tin (mask as ***-**-XXXX)
- nonemployee_compensation (box 1)
- federal_income_tax_withheld (box 4)
- state_tax_withheld
- tax_year

1099-MISC Fields:
- payer_name
- payer_ein
- recipient_name
- recipient_tin
- rents (box 1)
- royalties (box 2)
- other_income (box 3)
- federal_income_tax_withheld (box 4)
- tax_year

1099-INT Fields:
- payer_name
- payer_ein
- recipient_name
- recipient_tin
- interest_income (box 1)
- early_withdrawal_penalty (box 2)
- federal_income_tax_withheld (box 4)
- tax_year

1099-DIV Fields:
- payer_name
- payer_ein
- recipient_name
- recipient_tin
- total_ordinary_dividends (box 1a)
- qualified_dividends (box 1b)
- total_capital_gain (box 2a)
- federal_income_tax_withheld (box 4)
- tax_year

1098 Fields:
- lender_name
- lender_ein
- lender_address
- borrower_name
- borrower_tin
- mortgage_interest_received (box 1)
- outstanding_mortgage_principal (box 2)
- mortgage_origination_date (box 3)
- property_address
- tax_year

K1 Fields:
- entity_name
- entity_ein
- partner_name
- partner_ssn
- entity_type (partnership/s_corp)
- ordinary_business_income
- rental_income
- interest_income
- tax_year

RECEIPT Fields:
- vendor_name
- transaction_date
- total_amount
- category (meals, office, supplies, travel, etc.)
- payment_method
- description

Confidence scores (0-100):
- 90-100: Very clear and explicit in document
- 70-89: Clearly visible but requires some interpretation
- 50-69: Partially visible or inferred
- Below 50: Uncertain or guessed

Extract all relevant fields you can identify with confidence > 50.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a precise tax document analyzer. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse and validate response
    const parsed = JSON.parse(responseText);
    const validated = DocumentAnalysisSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error("OpenAI extraction error:", error);
    
    // Return a fallback response for OTHER type
    return {
      entityType: "OTHER",
      fields: [
        {
          key: "filename",
          value: filename,
          confidence: 100,
        },
        {
          key: "extraction_error",
          value: error instanceof Error ? error.message : "Unknown error",
          confidence: 100,
        },
      ],
    };
  }
}

/**
 * Complete document parsing pipeline
 */
export async function parseDocument(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<DocumentAnalysis> {
  // For PDFs, extract text first
  if (mimeType === "application/pdf") {
    const text = await extractTextFromPDF(buffer);
    return await detectAndExtract(text, filename);
  }

  // For images, we could use OCR here (future enhancement)
  // For now, return a placeholder
  return {
    entityType: "OTHER",
    fields: [
      {
        key: "filename",
        value: filename,
        confidence: 100,
      },
      {
        key: "note",
        value: "Image parsing not yet implemented. Upload PDFs for best results.",
        confidence: 100,
      },
    ],
  };
}

