# backend/app/services/storage_service.py
import os
import secrets
from werkzeug.utils import secure_filename
from flask import send_file, current_app
from datetime import datetime

class StorageService:
    """Handle file uploads and storage."""
    
    def __init__(self):
        self.upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        self.allowed_extensions = current_app.config.get('ALLOWED_EXTENSIONS', 
                                                       {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'})
        
        # Ensure upload directories exist
        self._ensure_directories()
    
    def _ensure_directories(self):
        """Create upload directories if they don't exist."""
        directories = [
            self.upload_folder,
            os.path.join(self.upload_folder, 'kyc'),
            os.path.join(self.upload_folder, 'properties'),
            os.path.join(self.upload_folder, 'temp')
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def _allowed_file(self, filename):
        """Check if file extension is allowed."""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.allowed_extensions
    
    def save_file(self, file, user_id, document_type='general'):
        """Save uploaded file with secure filename."""
        if not self._allowed_file(file.filename):
            raise ValueError('Invalid file type')
        
        # Generate secure filename
        original_filename = secure_filename(file.filename)
        file_ext = original_filename.rsplit('.', 1)[1].lower()
        
        # Create unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        random_str = secrets.token_urlsafe(8)
        new_filename = f"{user_id}_{document_type}_{timestamp}_{random_str}.{file_ext}"
        
        # Determine subdirectory based on document type
        if document_type in ['identity', 'proof_of_address', 'source_of_funds']:
            subdirectory = 'kyc'
        else:
            subdirectory = 'general'
        
        # Create full file path
        file_path = os.path.join(self.upload_folder, subdirectory, new_filename)
        
        # Save file
        file.save(file_path)
        
        # Return relative path and display filename
        relative_path = os.path.join(subdirectory, new_filename)
        return relative_path, original_filename
    
    def serve_file(self, file_path, filename):
        """Serve a file for download."""
        full_path = os.path.join(self.upload_folder, file_path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError('File not found')
        
        return send_file(full_path, as_attachment=True, download_name=filename)
    
    def delete_file(self, file_path):
        """Delete a file from storage."""
        full_path = os.path.join(self.upload_folder, file_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        
        return False
    
    def get_file_info(self, file_path):
        """Get information about a stored file."""
        full_path = os.path.join(self.upload_folder, file_path)
        
        if not os.path.exists(full_path):
            return None
        
        stat = os.stat(full_path)
        return {
            'size': stat.st_size,
            'created': datetime.fromtimestamp(stat.st_ctime),
            'modified': datetime.fromtimestamp(stat.st_mtime)
        }