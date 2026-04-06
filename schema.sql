-- Run this once against your database to set up the schema.
-- psql -U youruser -d yourdb -f schema.sql

CREATE TABLE IF NOT EXISTS games (
    session_id          UUID        PRIMARY KEY,
    username            TEXT        NOT NULL,
    match_number        INTEGER     NOT NULL,
    chess_type          TEXT        NOT NULL,
    time_base           INTEGER     NOT NULL,  -- seconds
    time_increment_sec  INTEGER     NOT NULL,  -- seconds
    time_control        TEXT        NOT NULL,  -- e.g. "5+3"
    ai_skill_level      INTEGER     NOT NULL,
    moves_count         INTEGER     NOT NULL,
    termination_reason  TEXT        NOT NULL,
    played_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moves (
    id           SERIAL      PRIMARY KEY,
    session_id   UUID        NOT NULL REFERENCES games(session_id) ON DELETE CASCADE,
    move_number  INTEGER     NOT NULL,  -- 1-indexed position in the game
    san          TEXT        NOT NULL,  -- standard algebraic notation e.g. "Nf3"
    fen          TEXT        NOT NULL,  -- board state after the move
    category     TEXT        NOT NULL,  -- best | excellent | good | inaccuracy | mistake | blunder
    value        NUMERIC     NOT NULL,  -- numeric score for the category
    eval_cp      INTEGER     NOT NULL   -- centipawn eval from white's perspective
);

-- Handy indexes for common queries
CREATE INDEX IF NOT EXISTS moves_session_idx ON moves(session_id);
CREATE INDEX IF NOT EXISTS games_username_idx ON games(username);
CREATE INDEX IF NOT EXISTS games_played_at_idx ON games(played_at DESC);
