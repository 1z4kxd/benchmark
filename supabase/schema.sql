-- Users extend Supabase Auth
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- One row per game attempt
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  game_type TEXT NOT NULL,       -- 'reaction_time' | 'sequence_memory' | 'chimp'
  score INTEGER NOT NULL,        -- ms for reaction, level for memory/chimp
  attempts JSONB,                -- array of individual attempt values
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexed for fast percentile queries
CREATE INDEX idx_scores_game_type ON scores(game_type, score);