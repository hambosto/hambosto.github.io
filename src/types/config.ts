export interface WorkExperience {
    id: string;
    company: string;
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
    };
    github: {
        username: string;
    };
    customSkills: Record<string, CustomSkill[]>;
    workExperience: WorkExperience[];
    education?: Education[];
    projects?: Project[];
}
