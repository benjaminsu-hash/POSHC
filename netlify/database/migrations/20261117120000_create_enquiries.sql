CREATE TABLE enquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  received_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  parent_name      TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  child_first_name TEXT,
  year_level       TEXT,
  care             TEXT[] NOT NULL DEFAULT '{}',
  start_date       DATE,
  message          TEXT,
  status           TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
  notes            TEXT NOT NULL DEFAULT '',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX enquiries_received_at_idx ON enquiries (received_at DESC);
CREATE INDEX enquiries_status_idx ON enquiries (status);
