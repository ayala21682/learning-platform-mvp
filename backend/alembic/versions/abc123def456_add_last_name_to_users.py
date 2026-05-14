"""add last_name to users - DEPRECATED, use cdef567ghi890 instead

Revision ID: abc123def456
Revises: 68da09df7fa0
Create Date: 2026-05-13 12:00:00.000000

This migration is deprecated. The last_name column is now added in the initial migration.
Keeping this file for backward compatibility with existing databases.
"""
from alembic import op
import sqlalchemy as sa


revision = 'abc123def456'
down_revision = '68da09df7fa0'
branch_labels = None
depends_on = None


def upgrade():
    # No-op migration for backward compatibility
    # last_name column already added in initial migration
    pass


def downgrade():
    # No-op migration for backward compatibility
    pass