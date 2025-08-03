# backend/app/database.py
import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from flask import current_app
import logging
import os

logger = logging.getLogger(__name__)

@contextmanager
def get_db_connection():
    """Create a database connection context manager that works with both SQLite and PostgreSQL."""
    database_url = current_app.config['DATABASE_URL']
    
    if database_url.startswith('sqlite'):
        # SQLite connection
        db_path = database_url.replace('sqlite:///', '')
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # This makes rows accessible by column name
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
    else:
        # PostgreSQL connection
        try:
            conn = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
            try:
                yield conn
                conn.commit()
            except Exception:
                conn.rollback()
                raise
            finally:
                conn.close()
        except psycopg2.OperationalError as e:
            logger.error(f"PostgreSQL connection failed: {e}")
            raise

def init_db():
    """Initialize the database with required tables."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if we're using SQLite or PostgreSQL
            database_url = current_app.config['DATABASE_URL']
            is_sqlite = database_url.startswith('sqlite')
            
            # Adjust SQL syntax based on database type
            if is_sqlite:
                # SQLite syntax
                auto_increment = "INTEGER PRIMARY KEY AUTOINCREMENT"
                timestamp_default = "DATETIME DEFAULT CURRENT_TIMESTAMP"
                boolean_type = "INTEGER DEFAULT 0"  # SQLite doesn't have native boolean
                json_type = "TEXT"
            else:
                # PostgreSQL syntax
                auto_increment = "SERIAL PRIMARY KEY"
                timestamp_default = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                boolean_type = "BOOLEAN DEFAULT FALSE"
                json_type = "JSONB DEFAULT '{}'"
            
            # Users table
            cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS users (
                id {auto_increment},
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                user_type VARCHAR(20) DEFAULT 'investor',
                language_preference VARCHAR(5) DEFAULT 'en',
                created_at {timestamp_default},
                updated_at {timestamp_default},
                is_active {boolean_type.replace('FALSE', '1' if is_sqlite else 'TRUE')},
                is_verified {boolean_type},
                verification_token VARCHAR(255),
                reset_token VARCHAR(255),
                reset_token_expires {timestamp_default.replace('DEFAULT CURRENT_TIMESTAMP', 'NULL')}
            );
            """)
            
            # Properties table (basic version for testing)
            cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS properties (
                id {auto_increment},
                property_id VARCHAR(50) UNIQUE NOT NULL,
                address TEXT NOT NULL,
                postcode VARCHAR(10) NOT NULL,
                city VARCHAR(100),
                property_type VARCHAR(50),
                bedrooms INTEGER,
                bathrooms INTEGER,
                square_feet INTEGER,
                asking_price DECIMAL(12,2),
                monthly_rent DECIMAL(10,2),
                bmv_score INTEGER,
                tier VARCHAR(10),
                status VARCHAR(20) DEFAULT 'pending',
                published {boolean_type},
                created_at {timestamp_default},
                updated_at {timestamp_default}
            );
            """)
            
            # Insert some test data for development
            try:
                cursor.execute("SELECT COUNT(*) as count FROM users")
                result = cursor.fetchone()
                user_count = result['count'] if not is_sqlite else result[0]
                
                if user_count == 0:
                    logger.info("Inserting test data...")
                    # Insert a test user (password is 'password123')
                    from werkzeug.security import generate_password_hash
                    test_password = generate_password_hash('password123')
                    
                    cursor.execute("""
                        INSERT INTO users (email, password_hash, full_name, user_type, is_active, is_verified)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """ if is_sqlite else """
                        INSERT INTO users (email, password_hash, full_name, user_type, is_active, is_verified)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, ('test@example.com', test_password, 'Test User', 'admin', True, True))
                    
                    # Insert test property
                    cursor.execute("""
                        INSERT INTO properties (property_id, address, postcode, city, property_type, bedrooms, bathrooms, asking_price, monthly_rent, published)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """ if is_sqlite else """
                        INSERT INTO properties (property_id, address, postcode, city, property_type, bedrooms, bathrooms, asking_price, monthly_rent, published)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, ('TEST001', '123 Test Street', 'M1 1AA', 'Manchester', 'apartment', 2, 1, 150000, 1200, True))
                    
                    logger.info("Test data inserted successfully")
                    
            except Exception as e:
                logger.warning(f"Could not insert test data: {e}")
            
            logger.info("Database initialization completed successfully")
            
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

def test_db_connection():
    """Test database connection."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False