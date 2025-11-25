import type { SiteConfig } from '../types/config';

export const CONFIG: SiteConfig = {
    github: {
        username: 'hambosto',
        excludeRepos: [],
    },

    personal: {
        name: 'Ilham Putra Husada',
        title: 'Software Engineer',
        bio: "Just a person who writes code, eats mie ayam, drinks tea, and pretends to know what they're doing.",
        email: 'hambosto@gmail.com',
        resume: '/resume.pdf',
    },

    social: {
        github: 'https://github.com/hambosto',
        linkedin: 'https://linkedin.com/in/hambosto',
        twitter: 'https://twitter.com/hambosto',
        email: 'hambosto@gmail.com',
    },

    customSkills: {
        languages: [
            { name: 'Python', level: 95 },
            { name: 'Rust', level: 90 },
            { name: 'Go', level: 90 },
            { name: 'TypeScript', level: 90 },
            { name: 'C++', level: 85 },
        ],
        cloud: [
            { name: 'AWS', level: 85 },
            { name: 'GCP', level: 85 },
            { name: 'Azure', level: 85 },
        ],
        devops: [
            { name: 'Docker', level: 90 },
            { name: 'Kubernetes', level: 85 },
            { name: 'Jenkins', level: 85 },
            { name: 'CI/CD', level: 85 },
            { name: 'Git', level: 90 },
        ],
        os: [
            { name: 'Linux', level: 95 },
            { name: 'Windows', level: 85 },
            { name: 'Unix', level: 85 },
        ],
        databases: [
            { name: 'PostgreSQL', level: 90 },
            { name: 'MongoDB', level: 85 },
            { name: 'Redis', level: 85 },
            { name: 'MinIO', level: 85 },
        ],
        messaging: [
            { name: 'RabbitMQ', level: 85 },
            { name: 'Kafka', level: 85 },
        ],
        api: [
            { name: 'gRPC', level: 85 },
            { name: 'GraphQL', level: 85 },
            { name: 'Rest API', level: 90 },
            { name: 'WebSocket', level: 85 },
        ],
        auth: [
            { name: 'JWT', level: 85 },
            { name: 'OAuth', level: 85 },
        ],
        architecture: [
            { name: 'System Design', level: 90 },
            { name: 'Microservices', level: 85 },
            { name: 'Distributed Systems', level: 85 },
            { name: 'Domain Driven Design', level: 85 },
            { name: 'Event Driven Architecture', level: 85 },
        ],
    },

    workExperience: [
        {
            id: '1',
            company: 'Tech Company Inc.',
            position: 'Software Engineer',
            location: 'Remote',
            startDate: '2023-01',
            description:
                'Architecting and building high-performance distributed systems. optimizing database queries, and implementing robust microservices using Go and Rust.',
            technologies: ['Go', 'Rust', 'gRPC', 'PostgreSQL', 'Kubernetes', 'AWS'],
            achievements: [
                'Designed a high-throughput event processing system handling 1M+ events/sec',
                'Reduced infrastructure costs by 40% through container optimization',
                'Implemented automated CI/CD pipelines reducing deployment time by 70%',
            ],
        },
        {
            id: '2',
            company: 'StartupXYZ',
            position: 'Backend Engineer',
            location: 'Jakarta, Indonesia',
            startDate: '2021-06',
            endDate: '2022-12',
            description:
                'Developed scalable backend services and APIs. Focused on database optimization and system reliability.',
            technologies: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
            achievements: [
                'Optimized API response times by 50% using caching strategies',
                'Migrated monolithic architecture to microservices',
                'Built real-time data processing pipeline using Python',
            ],
        },
        {
            id: '3',
            company: 'Freelance',
            position: 'Systems Developer',
            startDate: '2020-01',
            endDate: '2021-05',
            description:
                'Built custom automation tools and CLI applications for various clients. specialized in system administration and scripting.',
            technologies: ['Python', 'Bash', 'Linux', 'Docker'],
            achievements: [
                'Automated server provisioning and configuration management',
                'Developed custom CLI tools for data processing',
            ],
        },
    ],
};
