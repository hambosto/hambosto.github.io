export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string; // undefined means current
    description: string;
    technologies: string[];
    achievements?: string[];
}

export interface PersonalInfo {
    name: string;
    title: string;
    email: string;
    bio: string;
    resume?: string;
}

export interface CustomSkill {
    name: string;
    level: number;
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
        excludeRepos?: string[];
    };
    customSkills: Record<string, CustomSkill[]>;
    workExperience: WorkExperience[];
}
