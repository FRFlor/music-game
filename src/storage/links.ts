export enum LinkType {
    LinkedIn,
    GitHub,
    PersonalWebsite,
    Twitter,
    Email,
}

export interface Link {
    icon?: string;
    text?: string;
    destination: string;
    type: LinkType;
}

export const ALL_LINKS: Link[] = [
    {
        icon: 'fas fa-user-circle',
        text: 'FelipeFlor.com',
        destination: 'https://www.felipeflor.com',
        type: LinkType.PersonalWebsite,
    },
    {
        icon: 'fab fa-github',
        text: 'Github.com/FRFlor',
        destination: 'https://github.com/FRFlor',
        type: LinkType.GitHub,
    },
    {
        icon: 'fab fa-linkedin',
        text: 'Linkedin.com/in/felipe-flor/',
        destination: 'https://www.linkedin.com/in/felipe-flor/',
        type: LinkType.LinkedIn,
    },
    {
        icon: 'fab fa-twitter',
        text: 'Twitter.com/Felipe_R_Flor',
        destination: 'https://twitter.com/Felipe_R_Flor',
        type: LinkType.Twitter,
    },
    {
        icon: 'email',
        destination: 'mailto:hello@felipeflor.com',
        text: 'hello@felipeflor.com',
        type: LinkType.Email,
    },
];
