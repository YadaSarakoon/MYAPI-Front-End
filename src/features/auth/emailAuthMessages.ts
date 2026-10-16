export const emailAuthHint = 'เคยใช้ Google? เข้าสู่ระบบด้วย Google แล้วไปที่ ตั้งค่า → ตั้งรหัสผ่าน เพื่อใช้อีเมลและรหัสผ่านกับบัญชีเดิม';
export const signupNotice = 'หากอีเมลนี้สมัครได้ กรุณาตรวจสอบอีเมลยืนยัน รวมถึงโฟลเดอร์สแปม หากมีบัญชีอยู่แล้วให้เข้าสู่ระบบด้วยวิธีเดิม';

export function emailAuthError(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? error.code : '';
  switch (code) {
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'ระบบจำกัดการส่งอีเมลหรือคำขอชั่วคราว กรุณารอก่อนลองใหม่ หากยังไม่ได้รับอีเมลให้ติดต่อผู้ดูแลระบบ';
    case 'email_address_invalid': return 'อีเมลนี้ไม่สามารถใช้งานได้ กรุณาตรวจสอบอีเมลอีกครั้ง';
    case 'email_address_not_authorized': return 'ระบบยังส่งอีเมลไปยังที่อยู่นี้ไม่ได้ กรุณาติดต่อผู้ดูแลระบบ';
    case 'email_not_confirmed': return 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ และตรวจสอบโฟลเดอร์สแปม';
    case 'weak_password': return 'รหัสผ่านไม่ผ่านเงื่อนไขความปลอดภัย กรุณาใช้รหัสผ่านที่คาดเดายากขึ้น';
    case 'same_password': return 'กรุณาใช้รหัสผ่านใหม่ที่ต่างจากรหัสผ่านเดิม';
    case 'reauthentication_needed':
    case 'session_not_found':
    case 'session_expired': return 'กรุณาเข้าสู่ระบบใหม่ แล้วลองตั้งรหัสผ่านอีกครั้ง';
    default: return 'ดำเนินการไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองอีกครั้ง หากเคยใช้ Google ให้เข้าสู่ระบบด้วย Google';
  }
}
