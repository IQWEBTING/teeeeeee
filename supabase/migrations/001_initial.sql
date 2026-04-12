-- Create girl_game_scores table
CREATE TABLE girl_game_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    selections_used INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create balloon_game_scores table
CREATE TABLE balloon_game_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    rows_used INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create announcements table
CREATE TABLE announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    winners_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Set up Row Level Security (RLS)
ALTER TABLE girl_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE balloon_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for girl_game_scores" ON girl_game_scores FOR SELECT USING (true);
CREATE POLICY "Public read access for balloon_game_scores" ON balloon_game_scores FOR SELECT USING (true);
CREATE POLICY "Public read access for announcements" ON announcements FOR SELECT USING (true);

-- Create policies for public insert access (since the game is public, players can insert their scores)
CREATE POLICY "Public insert access for girl_game_scores" ON girl_game_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access for balloon_game_scores" ON balloon_game_scores FOR INSERT WITH CHECK (true);

-- Note: announcements shouldn't be publicly insertable in a real app without admin auth, 
-- but doing it based on instructions (public read, insert for all)
CREATE POLICY "Public insert access for announcements" ON announcements FOR INSERT WITH CHECK (true);

-- Create indexes on created_at and player_name for fast leaderboard queries
CREATE INDEX idx_girl_game_scores_created_at ON girl_game_scores(created_at DESC);
CREATE INDEX idx_girl_game_scores_player_name ON girl_game_scores(player_name);

CREATE INDEX idx_balloon_game_scores_created_at ON balloon_game_scores(created_at DESC);
CREATE INDEX idx_balloon_game_scores_player_name ON balloon_game_scores(player_name);

CREATE INDEX idx_announcements_announced_at ON announcements(announced_at DESC);
