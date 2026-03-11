create table if not exists feedbacks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete set null,
    team_id uuid references teams(id) on delete set null,
    category text not null check (category in ('idea', 'bug', 'general')),
    message text not null,
    created_at timestamptz default now()
);

alter table feedbacks enable row level security;

-- Anyone authenticated can insert their own feedback
create policy "Users can insert feedback"
    on feedbacks for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Users can only read their own feedback
create policy "Users can read own feedback"
    on feedbacks for select
    to authenticated
    using (auth.uid() = user_id);
