// Logos officiels des intégrations

export const SlackLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <img 
        src="/Logo Slack-Photoroom.png" 
        alt="Slack" 
        className={className}
    />
);

export const NotionLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <img 
        src="/Logo Notion.webp" 
        alt="Notion" 
        className={className}
    />
);

export const GoogleCalendarLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <img 
        src="/Logo Google Calendar-Photoroom.png" 
        alt="Google Calendar" 
        className={className}
    />
);

// Export grouped for easy use
export const IntegrationLogos = {
    slack: SlackLogo,
    notion: NotionLogo,
    google_calendar: GoogleCalendarLogo,
};
