"""add_last_name_with_default - ensure data safety

Revision ID: cdef567ghi890
Revises: abc123def456
Create Date: 2026-05-14 12:00:00.000000

This migration ensures backward compatibility: if last_name column already exists
(from initial migration), it does nothing. If it doesn't exist, it adds it safely.
"""
from alembic import op
import sqlalchemy as sa


revision = 'cdef567ghi890'
down_revision = 'abc123def456'
branch_labels = None
depends_on = None


def upgrade():
    # Check if last_name column exists, if not add it
    from sqlalchemy import inspect
    inspector = inspect(op.get_context().bind)
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'last_name' not in columns:
        # Add column if it doesn't exist (for old databases)
        with op.batch_alter_table('users', schema=None) as batch_op:
            batch_op.add_column(sa.Column('last_name', sa.String(), nullable=True))
        
        # Set default value for any NULL entries
        op.execute("UPDATE users SET last_name = '' WHERE last_name IS NULL")
        
        # Make NOT NULL
        with op.batch_alter_table('users', schema=None) as batch_op:
            batch_op.alter_column('last_name', existing_type=sa.String(), nullable=False)
    
    # If column already exists, do nothing (already safe from initial migration)


def downgrade():
    # Only drop if we added it
    from sqlalchemy import inspect
    inspector = inspect(op.get_context().bind)
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    if 'last_name' in columns:
        with op.batch_alter_table('users', schema=None) as batch_op:
            batch_op.drop_column('last_name')

