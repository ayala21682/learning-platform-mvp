"""add last_name to users

Revision ID: abc123def456
Revises: 68da09df7fa0
Create Date: 2026-05-13 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'abc123def456'
down_revision = '68da09df7fa0'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('last_name', sa.String(), nullable=False))


def downgrade():
    op.drop_column('users', 'last_name')