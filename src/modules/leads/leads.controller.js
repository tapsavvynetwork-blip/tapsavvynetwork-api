import Lead from './lead.model.js';

function extractEmail(text) {
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : null;
}

function extractPhone(text) {
  const m = text.match(/(\+?\d[\d \-().]{6,}\d)/);
  return m ? m[0].replace(/[^0-9+]/g, '') : null;
}

export async function createLead(req, res, next) {
  try {
    const data = req.body;
    if (req.user) data.createdBy = req.user._id;
    const lead = await Lead.create(data);
    res.status(201).json({ success: true, data: lead });
  } catch (err) { next(err); }
}

export async function listLeads(req, res, next) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: leads });
  } catch (err) { next(err); }
}

export async function scanImage(req, res, next) {
  try {
    // Accept either base64 in body.raw or a plain text in body.text for stub
    const { raw, text } = req.body;
    let rawText = text || '';
    if (raw) {
      // For now we don't run OCR; if raw contains base64 we can't decode meaningful text here.
      rawText = raw;
    }
    // simple extraction
    const email = extractEmail(rawText || '');
    const phone = extractPhone(rawText || '');
    const lead = await Lead.create({ rawText, email, phone, source: 'scanner', createdBy: req.user?._id });
    res.status(201).json({ success: true, data: lead });
  } catch (err) { next(err); }
}
