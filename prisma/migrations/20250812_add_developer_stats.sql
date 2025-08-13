-- Create developer_stats table
CREATE TABLE IF NOT EXISTS developer_stats (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user" TEXT NOT NULL,
    workspace_id TEXT NOT NULL,
    pr_number INTEGER NOT NULL,
    merged_date TIMESTAMP(3) NOT NULL,
    estimated_time DOUBLE PRECISION,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS developer_stats_user_idx ON developer_stats("user");
CREATE INDEX IF NOT EXISTS developer_stats_workspace_id_idx ON developer_stats(workspace_id);
CREATE INDEX IF NOT EXISTS developer_stats_merged_date_idx ON developer_stats(merged_date);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_developer_stats_updated_at BEFORE UPDATE ON developer_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();