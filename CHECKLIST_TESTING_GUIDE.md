# Checklist Generation Testing Guide

## What Was Improved

### 1. Fixed Critical Bug ✅
- **Issue**: `lib/ai.ts` was referencing undefined `openai` variable
- **Fix**: Now properly calls `getOpenAIClient()` to get the OpenAI client instance
- **Impact**: Document parsing will now work correctly with GPT-4o

### 2. Enhanced Messaging with Clear Value Prop ✅

The value proposition is now crystal clear throughout the app:

**"Give us last year's tax return → Get a personalized checklist for this year"**

#### Updated Pages:

1. **Empty State (`/components/dashboard/empty-state.tsx`)**
   - Clear headline: "Upload Last Year's Return, Get This Year's Checklist"
   - Specific years: "Upload 2024 return → Get 2025 checklist"
   - Emphasizes the 30-second process

2. **Checklist Page (`/app/dashboard/checklist/page.tsx`)**
   - **When empty**: Prominent 3-step explainer:
     - 📄 Upload your 2024 tax return
     - 🤖 We analyze it with AI
     - ✅ Get your 2025 checklist
   - **When populated**: "About Your Personalized Checklist" section explains:
     - Based on 2024 return analysis
     - Personalized to your employers, banks, etc.
     - Distinguishes required vs. optional items

## How Checklist Generation Works

### The Process

1. **User uploads last year's tax return** (2024 PDF)
2. **AI extracts entities**:
   - W-2s → Extracts employer names
   - 1099s → Extracts payer names
   - 1098s → Extracts lender names
   - K-1s → Extracts partnership names
   - Receipts → Identifies deduction categories
3. **Backend generates personalized checklist** for current year (2025):
   - "Request W-2 from [Employer Name]"
   - "Collect 1099 from [Payer Name]"
   - "Obtain 1098 from [Lender Name]"
   - Plus standard items everyone needs

### Example Flow

**User uploads 2024 return showing:**
- W-2 from Acme Corp
- 1099-NEC from Upwork
- 1098 from Wells Fargo Bank
- Charitable donations

**Generated 2025 checklist includes:**
- ✅ Request W-2 from Acme Corp
- ✅ Collect 1099 from Upwork
- ✅ Obtain 1098 from Wells Fargo Bank
- ✅ Charitable donation receipts
- ✅ HSA contribution statements
- ✅ Student loan interest statement (1098-E)
- ✅ Health insurance forms (1095-A, B, or C)
- ... and more

## Testing the Feature

### Prerequisites

1. **OpenAI API Key**: Ensure `OPENAI_API_KEY` is set in `.env.local`
2. **Test Documents**: Get a sample tax return PDF (can use a fake/redacted one)
3. **Database**: Supabase database must be running with migrations applied

### Test Scenario 1: End-to-End Happy Path

1. **Sign in to dashboard**
   ```
   http://localhost:3000/dashboard
   ```

2. **Verify empty state messaging**
   - Should see: "Upload Last Year's Return, Get This Year's Checklist"
   - Button should say: "Upload 2024 Tax Return"
   - Description explains the value prop clearly

3. **Go to Documents page**
   ```
   http://localhost:3000/dashboard/documents
   ```

4. **Upload a tax return PDF**
   - Use any PDF with tax forms (W-2, 1099, etc.)
   - Wait for upload to complete
   - Document should appear in list

5. **Trigger AI parsing**
   - The upload automatically triggers parsing
   - Check console logs for: `[AI] Parsing document...`
   - Should see: `entityType: "W2"` (or relevant type)

6. **Generate checklist**
   - Go to Checklist page: `http://localhost:3000/dashboard/checklist`
   - If no checklist yet, you'll see the improved empty state with 3-step explainer
   - Click "Generate Checklist" (or use API directly)

7. **Verify checklist items**
   - Should see personalized items based on parsed documents
   - Employer names, payer names should be extracted
   - Standard items should also be included

### Test Scenario 2: Check API Directly

```bash
# 1. Upload a document (get document_id from response)
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -F "file=@sample_w2.pdf"

# 2. Wait for parsing to complete (check database)
# documents table: parsed = true

# 3. Generate checklist
curl -X POST http://localhost:3000/api/checklist/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"taxYearId": "YOUR_TAX_YEAR_ID"}'

# Response should include:
# {
#   "success": true,
#   "itemsCreated": 12,
#   "message": "Generated personalized checklist"
# }
```

### Test Scenario 3: Verify Messaging

**Check these pages for consistent value prop:**

1. **Dashboard** (`/dashboard`)
   - Empty state uses new messaging
   - Quick actions emphasize "Upload 2024 return"

2. **Checklist Page** (`/dashboard/checklist`)
   - Empty state has 3-step explainer
   - Help section explains personalization

3. **Documents Page** (`/dashboard/documents`)
   - Tips mention checklist generation

### Expected AI Extraction Results

**For a W-2 document:**
```json
{
  "entityType": "W2",
  "fields": [
    { "key": "employer_name", "value": "Acme Corporation", "confidence": 95 },
    { "key": "employer_ein", "value": "12-3456789", "confidence": 90 },
    { "key": "employee_name", "value": "John Doe", "confidence": 95 },
    { "key": "wages_tips_compensation", "value": "75000", "confidence": 92 },
    { "key": "federal_income_tax_withheld", "value": "12000", "confidence": 90 },
    { "key": "tax_year", "value": "2024", "confidence": 100 }
  ]
}
```

**For a 1099-NEC document:**
```json
{
  "entityType": "1099-NEC",
  "fields": [
    { "key": "payer_name", "value": "Upwork Inc", "confidence": 95 },
    { "key": "payer_ein", "value": "98-7654321", "confidence": 88 },
    { "key": "recipient_name", "value": "Jane Smith", "confidence": 93 },
    { "key": "nonemployee_compensation", "value": "25000", "confidence": 94 },
    { "key": "tax_year", "value": "2024", "confidence": 100 }
  ]
}
```

### What to Check

1. **Console Logs**
   ```
   [AI] Parsing document: sample_w2.pdf
   [AI] Extracted text: 4582 characters
   [AI] Detected entity type: W2
   [AI] Extracted 6 fields with avg confidence: 92%
   ```

2. **Database Verification**
   ```sql
   -- Check documents were parsed
   SELECT id, filename, parsed, parse_error 
   FROM documents 
   WHERE parsed = true;

   -- Check entities were extracted
   SELECT entity_type, key, value, confidence 
   FROM document_entities 
   WHERE document_id = 'YOUR_DOC_ID';

   -- Check checklist was generated
   SELECT title, description, status, category 
   FROM checklist_items 
   WHERE tax_year_id = 'YOUR_TAX_YEAR_ID';
   ```

3. **UI Verification**
   - Checklist items show employer/payer names
   - Items are categorized correctly (income, deductions, credits)
   - Required vs. optional marked correctly
   - Help text explains the personalization

## Common Issues & Fixes

### Issue: OpenAI API returns error
**Fix**: Check API key is valid and has GPT-4o access
```bash
echo $OPENAI_API_KEY
# Should start with sk-proj-...
```

### Issue: No entities extracted
**Fix**: 
- Check PDF has actual text (not just image)
- Try a clearer/higher quality PDF
- Check OpenAI API logs for errors

### Issue: Checklist generation says "no previous data"
**Fix**:
- Ensure documents are in the PREVIOUS year's tax_year record
- If testing for 2025, upload documents to 2024 tax year
- Check `tax_years` table has correct year values

### Issue: Empty checklist generated
**Fix**:
- Check `document_entities` table has data
- Verify `parsed = true` on documents
- Look for parse errors in `documents.parse_error` column

## Testing with Real Documents

### Best Test Documents

1. **Real redacted tax return**: Black out SSNs/addresses but keep form structure
2. **Sample forms from IRS**: Download official blank forms
3. **Previous year's documents**: Use your own (with sensitive info redacted)

### What Makes a Good Test Case

- Clear employer/payer names
- Multiple income sources (W-2 + 1099)
- Mix of required and optional items
- Readable text (not blurry scan)

## Deployment Checklist

Before deploying to production:

- [ ] OpenAI API key configured in Vercel
- [ ] Test with at least 3 different tax document types
- [ ] Verify checklist generation with real tax returns
- [ ] Check all messaging displays correct years (2024 → 2025)
- [ ] Test empty states on fresh accounts
- [ ] Verify help text is helpful and accurate

## Success Metrics

When testing, look for:

1. **Accuracy**: AI correctly identifies document types (W-2, 1099, etc.)
2. **Extraction**: Names of employers/payers are captured correctly
3. **Personalization**: Checklist items reference specific entities
4. **Clarity**: Users understand what to do and why
5. **Speed**: Parsing completes in < 10 seconds

## Value Prop Validation

Users should clearly understand:

✅ "If I upload last year's return..."
✅ "...I'll get a checklist for this year"
✅ "It tells me exactly which employers, banks, etc. to contact"
✅ "No more guessing what I need"

---

**Questions or issues?** Check console logs for detailed error messages and AI extraction results.

