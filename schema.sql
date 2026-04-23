-- Run this once against your database to set up the schema.
-- psql -U youruser -d yourdb -f schema.sql

CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT        UNIQUE NOT NULL,
    display_name  TEXT        UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx    ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS games (
    session_id          UUID        PRIMARY KEY,
    user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    move_number  INTEGER     NOT NULL,
    san          TEXT        NOT NULL,
    fen          TEXT        NOT NULL,
    category     TEXT        NOT NULL,
    value        NUMERIC     NOT NULL,
    eval_cp      INTEGER     NOT NULL
);

CREATE INDEX IF NOT EXISTS moves_session_idx  ON moves(session_id);
CREATE INDEX IF NOT EXISTS games_user_idx     ON games(user_id);
CREATE INDEX IF NOT EXISTS games_played_at_idx ON games(played_at DESC);
