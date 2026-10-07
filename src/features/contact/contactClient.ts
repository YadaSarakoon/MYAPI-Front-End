import { getSupabaseConfig } from '../../config/supabase';
export type ContactSubmission = {
  submissionId: string; company: string; fullName: string; phone: string;
  email: string; website: string; courier: string; trap: string;
};
export async function submitContact(data: ContactSubmission): Promise<{ accepted: true }> {
  const { url, key } = getSupabaseConfig();
  // Public intake deliberately uses the project's anon JWT, independent of the user's session.
  const response = await fetch(`${url}/functions/v1/myapi-submit-contact`, {
    method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data), signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw Object.assign(new Error('Unable to save contact request'), {
    code: response.status === 429 ? 'resource-exhausted' : response.status === 400 ? 'invalid-argument' : 'unavailable',
  });
  const result = await response.json();
  if (result?.accepted !== true) throw new Error('Request was not accepted');
  return { accepted: true };
}
