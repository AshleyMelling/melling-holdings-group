"""Add raw_data column to KrakenLedger

Revision ID: a721f620442b
Revises: ef65eb64848b
Create Date: 2025-04-09 10:01:26.644337

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a721f620442b'
down_revision: Union[str, None] = 'ef65eb64848b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('kraken_ledgers', sa.Column('raw_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('kraken_ledgers', 'raw_data')
    # ### end Alembic commands ###
