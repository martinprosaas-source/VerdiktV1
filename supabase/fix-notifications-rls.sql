-- Allow users to insert notifications for other team members
CREATE POLICY "notifications_insert" ON notifications
    FOR INSERT WITH CHECK (
        triggered_by_user_id = auth.uid()
    );
