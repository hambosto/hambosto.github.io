export interface WorkExperience {
    id: string;
    company: string;
    companyUrl?: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies: string[];
    achievements?: string[];
}

export interface PersonalInfo {
    name: string;
    title: string;
    subtitle?: string;
    email: string;
    bio: string;
    resume?: string;
    website?: string;
}

export interface CustomSkill {
    name: string;
    level: number;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    url?: string;
    github?: string;
    technologies: string[];
    highlights?: string[];
    featured?: boolean;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    url?: string;
    icon?: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
}

export interface SiteConfig {
    personal: PersonalInfo;
    social: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        email: string;
        blog?: string;
    };
    github: {
        username: string;
        excludeRepos?: string[];
    };
    customSkills: Record<string, CustomSkill[]>;
    workExperience: WorkExperience[];
    education?: Education[];
    projects?: Project[];
    certifications?: Certification[];
    funFacts?: string[];
    quote?: string;
}
