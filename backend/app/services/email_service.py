# backend/app/services/email_service.py
from flask import current_app
from flask_mail import Message
from app.database import get_db_connection
import os

def send_verification_email(email, token, language='en'):
    """Send email verification link."""
    try:
        from flask_mail import Mail
        mail = Mail(current_app)
        
        verification_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/auth/verify-email/{token}"
        
        if language == 'ar':
            subject = "تأكيد عنوان البريد الإلكتروني - PropTech"
            body = f"""
            مرحباً بك في PropTech!
            
            يرجى النقر على الرابط التالي لتأكيد عنوان بريدك الإلكتروني:
            {verification_url}
            
            إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد الإلكتروني.
            
            شكراً لك،
            فريق PropTech
            """
        else:
            subject = "Verify Your Email Address - PropTech"
            body = f"""
            Welcome to PropTech!
            
            Please click the following link to verify your email address:
            {verification_url}
            
            If you didn't create this account, you can safely ignore this email.
            
            Thank you,
            The PropTech Team
            """
        
        msg = Message(subject, recipients=[email], body=body)
        mail.send(msg)
        
        # Log email
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status)
                VALUES (%s, %s, %s)
            """, ('verification', subject, 'sent'))
        
        return True
    except Exception as e:
        # Log error
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status, error_message)
                VALUES (%s, %s, %s, %s)
            """, ('verification', 'Email Verification', 'failed', str(e)))
        
        return False

def send_password_reset_email(email, token, language='en'):
    """Send password reset link."""
    try:
        from flask_mail import Mail
        mail = Mail(current_app)
        
        reset_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/auth/reset-password/{token}"
        
        if language == 'ar':
            subject = "إعادة تعيين كلمة المرور - PropTech"
            body = f"""
            طلب إعادة تعيين كلمة المرور
            
            لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.
            يرجى النقر على الرابط التالي لإعادة تعيين كلمة المرور:
            {reset_url}
            
            إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
            
            شكراً لك،
            فريق PropTech
            """
        else:
            subject = "Password Reset Request - PropTech"
            body = f"""
            Password Reset Request
            
            We received a request to reset your password.
            Please click the following link to reset your password:
            {reset_url}
            
            If you didn't request a password reset, you can safely ignore this email.
            
            Thank you,
            The PropTech Team
            """
        
        msg = Message(subject, recipients=[email], body=body)
        mail.send(msg)
        
        # Log email
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status)
                VALUES (%s, %s, %s)
            """, ('password_reset', subject, 'sent'))
        
        return True
    except Exception as e:
        # Log error
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status, error_message)
                VALUES (%s, %s, %s, %s)
            """, ('password_reset', 'Password Reset', 'failed', str(e)))
        
        return False

def send_welcome_email(email, full_name, language='en'):
    """Send welcome email to new users."""
    try:
        from flask_mail import Mail
        mail = Mail(current_app)
        
        if language == 'ar':
            subject = "مرحباً بك في PropTech!"
            body = f"""
            مرحباً {full_name}!
            
            شكراً لك على الانضمام إلى PropTech. نحن متحمسون لمساعدتك في رحلة الاستثمار العقاري.
            
            يمكنك الآن:
            - تصفح العقارات المتاحة
            - تحديث ملفك الشخصي
            - رفع مستندات التحقق من الهوية
            
            إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.
            
            شكراً لك،
            فريق PropTech
            """
        else:
            subject = "Welcome to PropTech!"
            body = f"""
            Hello {full_name}!
            
            Thank you for joining PropTech. We're excited to help you on your property investment journey.
            
            You can now:
            - Browse available properties
            - Update your profile
            - Upload KYC documents
            
            If you have any questions, don't hesitate to reach out to us.
            
            Thank you,
            The PropTech Team
            """
        
        msg = Message(subject, recipients=[email], body=body)
        mail.send(msg)
        
        # Log email
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status)
                VALUES (%s, %s, %s)
            """, ('welcome', subject, 'sent'))
        
        return True
    except Exception as e:
        # Log error
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO email_logs (email_type, subject, status, error_message)
                VALUES (%s, %s, %s, %s)
            """, ('welcome', 'Welcome Email', 'failed', str(e)))
        
        return False