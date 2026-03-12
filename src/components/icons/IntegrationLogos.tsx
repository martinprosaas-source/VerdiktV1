// Logos officiels des intégrations

export const SlackLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.712 33.867a4.468 4.468 0 0 1-4.468 4.468 4.468 4.468 0 0 1-4.468-4.468 4.468 4.468 0 0 1 4.468-4.468h4.468v4.468z" fill="#E01E5A"/>
        <path d="M21.958 33.867a4.468 4.468 0 0 1 4.468-4.468 4.468 4.468 0 0 1 4.468 4.468v11.178a4.468 4.468 0 0 1-4.468 4.468 4.468 4.468 0 0 1-4.468-4.468V33.867z" fill="#E01E5A"/>
        <path d="M26.426 19.712a4.468 4.468 0 0 1-4.468-4.468 4.468 4.468 0 0 1 4.468-4.468 4.468 4.468 0 0 1 4.468 4.468v4.468H26.426z" fill="#36C5F0"/>
        <path d="M26.426 21.958a4.468 4.468 0 0 1 4.468 4.468 4.468 4.468 0 0 1-4.468 4.468H15.244a4.468 4.468 0 0 1-4.468-4.468 4.468 4.468 0 0 1 4.468-4.468H26.426z" fill="#36C5F0"/>
        <path d="M40.58 26.426a4.468 4.468 0 0 1 4.468-4.468 4.468 4.468 0 0 1 4.468 4.468 4.468 4.468 0 0 1-4.468 4.468H40.58V26.426z" fill="#2EB67D"/>
        <path d="M38.334 26.426a4.468 4.468 0 0 1-4.468 4.468 4.468 4.468 0 0 1-4.468-4.468V15.244a4.468 4.468 0 0 1 4.468-4.468 4.468 4.468 0 0 1 4.468 4.468V26.426z" fill="#2EB67D"/>
        <path d="M33.867 40.58a4.468 4.468 0 0 1 4.468 4.468 4.468 4.468 0 0 1-4.468 4.468 4.468 4.468 0 0 1-4.468-4.468V40.58h4.468z" fill="#ECB22E"/>
        <path d="M33.867 38.334a4.468 4.468 0 0 1-4.468-4.468 4.468 4.468 0 0 1 4.468-4.468h11.178a4.468 4.468 0 0 1 4.468 4.468 4.468 4.468 0 0 1-4.468 4.468H33.867z" fill="#ECB22E"/>
    </svg>
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
