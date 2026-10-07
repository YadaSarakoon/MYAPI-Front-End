export class ContactError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

export function validateSubmission(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new ContactError('invalid-argument', 'Invalid form');
  const limits = { fullName: 120, phone: 30, email: 254, company: 200, website: 500, courier: 200 };
  if (Object.keys(data).some(key => ![...Object.keys(limits), 'submissionId', 'trap'].includes(key))) throw new ContactError('invalid-argument', 'Unexpected field');
  if (typeof data.submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) throw new ContactError('invalid-argument', 'Invalid submission ID');
  if (data.trap !== '') throw new ContactError('invalid-argument', 'Invalid form');
  const result = { submissionId: data.submissionId };
  for (const [key, max] of Object.entries(limits)) {
    if (typeof data[key] !== 'string' || data[key].length > max || [...data[key]].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) throw new ContactError('invalid-argument', `Invalid ${key}`);
    result[key] = data[key].trim();
  }
  if (!result.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email) || !/^[+\d\s().-]{7,30}$/.test(result.phone) || result.phone.replace(/\D/g, '').length < 7) throw new ContactError('invalid-argument', 'Check name, phone and email');
  if (result.website) {
    let url;
    try { url = new URL(result.website); } catch { throw new ContactError('invalid-argument', 'Invalid website'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new ContactError('invalid-argument', 'Invalid website');
  }
  return result;
}

