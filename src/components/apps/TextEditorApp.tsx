import React from "react";
import { CONFIG } from "../../utils/config";
import type { GitHubUser } from "../../types/github";

const categoryIcons: Record<string, string> = {
  languages: "fa-code",
  goWeb: "fa-server",
  goLibraries: "fa-cube",
  rustWeb: "fa-gear",
  rustLibraries: "fa-wrench",
  grpc: "fa-network-wired",
  messaging: "fa-comments",
  databases: "fa-database",
  storage: "fa-hard-drive",
  infrastructure: "fa-cloud",
  architecture: "fa-sitemap",
  observability: "fa-eye",
  security: "fa-shield-halved",
};

interface TextEditorAppProps {
  user: GitHubUser | null;
}

export const TextEditorApp: React.FC<TextEditorAppProps> = ({ user }) => {
  const categories = Object.entries(CONFIG.customSkills);
  const totalSkills = categories.reduce((sum, [, skills]) => sum + skills.length, 0);
  const avgLevel = Math.round(
    categories.reduce((sum, [, skills]) => sum + skills.reduce((s, sk) => s + sk.level, 0), 0) /
      totalSkills,
  );
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <div
        className="flex items-center gap-2 px-3 py-2 text-xs font-mono"
        style={{
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg-light)",
        }}
      >
        <i className="fas fa-file-lines" style={{ color: "var(--color-primary)" }} />
        <span style={{ color: "var(--color-text)" }}>about.md</span>
        <span className="ml-auto" style={{ color: "var(--color-text-muted)" }}>
          UTF-8 · Markdown
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
        {/* Profile Header */}
        <div
          className="mb-6 pb-4 flex items-start gap-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {user?.avatar_url && (
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-20 h-20 rounded-sm"
                style={{
                  border: "2px solid var(--color-primary-dark)",
                  boxShadow: "0 0 12px var(--color-primary-glow)",
                }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: "var(--color-success)",
                  borderColor: "var(--color-bg)",
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
              {user?.name || CONFIG.personal.name}
            </h1>
            <p className="text-sm mb-1" style={{ color: "var(--color-primary)" }}>
              {CONFIG.personal.title}
            </p>
            {CONFIG.personal.subtitle && (
              <p className="text-xs mb-2" style={{ color: "var(--color-text-dim)" }}>
                {CONFIG.personal.subtitle}
              </p>
            )}
            {user?.bio && (
              <p className="text-sm mb-2" style={{ color: "var(--color-text-dim)" }}>
                {user.bio}
              </p>
            )}
            <div
              className="flex flex-wrap gap-3 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {user?.location && (
                <span>
                  <i className="fas fa-map-marker-alt mr-1" />
                  {user.location}
                </span>
              )}
              {user?.blog && (
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--color-primary)" }}
                >
                  <i className="fas fa-link mr-1" />
                  {user.blog}
                </a>
              )}
              {user?.company && (
                <span>
                  <i className="fas fa-building mr-1" />
                  {user.company}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
            <i className="fas fa-user mr-2" style={{ color: "var(--color-primary)" }} />
            About
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
            {CONFIG.personal.bio}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
            <i className="fas fa-chart-pie mr-2" style={{ color: "var(--color-primary)" }} />
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Repositories",
                value: user?.public_repos ?? 0,
                icon: "fa-folder",
              },
              { label: "Followers", value: user?.followers ?? 0, icon: "fa-users" },
              {
                label: "Following",
                value: user?.following ?? 0,
                icon: "fa-user-friends",
              },
              {
                label: "Location",
                value: user?.location || "—",
                icon: "fa-map-marker-alt",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-sm border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <i
                  className={`fas ${stat.icon}`}
                  style={{ color: "var(--color-primary)", fontSize: 18 }}
                />
                <div>
                  <div className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        {CONFIG.education && CONFIG.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
              <i className="fas fa-graduation-cap mr-2" style={{ color: "var(--color-primary)" }} />
              Education
            </h2>
            <div className="space-y-4">
              {CONFIG.education.map((edu, i) => (
                <div
                  key={i}
                  className="pl-4 relative"
                  style={{ borderLeft: "2px solid var(--color-primary)" }}
                >
                  <div
                    className="absolute -left-1.5 top-1 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      boxShadow: "0 0 6px var(--color-primary-glow-strong)",
                    }}
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                      {edu.degree} in {edu.field}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: edu.endDate
                          ? "var(--color-bg-light)"
                          : "var(--color-primary-glow)",
                        color: edu.endDate ? "var(--color-text-muted)" : "var(--color-primary)",
                        border: `1px solid ${edu.endDate ? "var(--color-border)" : "var(--color-primary)"}`,
                      }}
                    >
                      {edu.endDate ? "Graduated" : "Enrolled"}
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "var(--color-text-dim)" }}>
                    {edu.institution} · {edu.startDate} – {edu.endDate || "Present"}
                    {edu.location && ` · ${edu.location}`}
                  </div>
                  {edu.description && (
                    <div className="text-xs mb-2" style={{ color: "var(--color-text-dim)" }}>
                      {edu.description}
                    </div>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-1">
                      {edu.achievements.map((a, j) => (
                        <div
                          key={j}
                          className="text-xs flex items-start gap-2"
                          style={{ color: "var(--color-text-dim)" }}
                        >
                          <span style={{ color: "var(--color-primary)" }}>✓</span>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
            <i className="fas fa-briefcase mr-2" style={{ color: "var(--color-primary)" }} />
            Experience
          </h2>
          <div className="space-y-4">
            {CONFIG.workExperience.map((exp, i) => (
              <div
                key={i}
                className="pl-4 relative"
                style={{ borderLeft: "2px solid var(--color-primary)" }}
              >
                <div
                  className="absolute -left-1.5 top-1 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    boxShadow: "0 0 6px var(--color-primary-glow-strong)",
                  }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {exp.position}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: exp.endDate
                        ? "var(--color-bg-light)"
                        : "var(--color-primary-glow)",
                      color: exp.endDate ? "var(--color-text-muted)" : "var(--color-primary)",
                      border: `1px solid ${exp.endDate ? "var(--color-border)" : "var(--color-primary)"}`,
                    }}
                  >
                    {exp.endDate ? "Completed" : "Current"}
                  </span>
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--color-text-dim)" }}>
                  {exp.company} · {exp.startDate} – {exp.endDate || "Present"}
                  {exp.location && ` · ${exp.location}`}
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--color-text-dim)" }}>
                  {exp.description}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: "var(--color-primary-glow)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-dim)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-1">
                    {exp.achievements.map((a, j) => (
                      <div
                        key={j}
                        className="text-xs flex items-start gap-2"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        <span style={{ color: "var(--color-primary)" }}>✓</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {CONFIG.certifications && CONFIG.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
              <i className="fas fa-certificate mr-2" style={{ color: "var(--color-primary)" }} />
              Certifications
            </h2>
            <div className="space-y-2">
              {CONFIG.certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-sm border"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {cert.icon && (
                    <i
                      className={`${cert.icon} text-lg`}
                      style={{ color: "var(--color-primary)" }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                      {cert.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {cert.issuer} · {cert.date}
                    </div>
                  </div>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <i className="fas fa-external-link-alt text-xs" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="mt-6">
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>
            <i className="fas fa-globe mr-2" style={{ color: "var(--color-primary)" }} />
            Social
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "GitHub",
                url: CONFIG.social.github,
                icon: "fab fa-github",
                desc: "Source code & projects",
              },
              {
                name: "LinkedIn",
                url: CONFIG.social.linkedin,
                icon: "fab fa-linkedin",
                desc: "Professional network",
              },
              {
                name: "Twitter",
                url: CONFIG.social.twitter,
                icon: "fab fa-x-twitter",
                desc: "Thoughts & updates",
              },
              {
                name: "Resume",
                url: CONFIG.personal.resume,
                icon: "fas fa-file-pdf",
                desc: "Download CV",
              },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-sm border transition-all group"
                style={{ borderColor: "var(--color-border)" }}
              >
                <i className={`${link.icon} text-lg`} style={{ color: "var(--color-primary)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {link.name}
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--color-text-dim)" }}>
                    {link.desc}
                  </div>
                </div>
                <i
                  className="fas fa-external-link-alt text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
              <i className="fas fa-layer-group mr-2" style={{ color: "var(--color-primary)" }} />
              Skills & Technologies
            </h2>
            <div className="flex gap-3 text-xs">
              <span
                className="px-2 py-1 rounded-sm"
                style={{
                  backgroundColor: "var(--color-primary-glow)",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {totalSkills} skills
              </span>
              <span
                className="px-2 py-1 rounded-sm"
                style={{
                  backgroundColor: "var(--color-bg-light)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {categories.length} categories · {avgLevel}% avg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(([category, skills]) => {
              const icon = categoryIcons[category] || "fa-layer-group";
              const catAvg = Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length);
              return (
                <div
                  key={category}
                  className="rounded-sm border p-3"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <i
                        className={`fas ${icon} text-xs`}
                        style={{ color: "var(--color-primary)" }}
                      />
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--color-text)" }}
                      >
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {catAvg}%
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {skills.map((skill, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span style={{ color: "var(--color-text-dim)" }}>{skill.name}</span>
                          <span className="font-mono" style={{ color: "var(--color-primary)" }}>
                            {skill.level}%
                          </span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div className="progress-fill" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
