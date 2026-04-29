"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./_components/ProjectCard";
import { BackendProject, getBackendProjects } from "~~/services/api/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [fundingAmount, setFundingAmount] = useState<Record<number, string>>({});

  async function loadProjects() {
    const data = await getBackendProjects();
    setProjects(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Milestone Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              fundingAmount={fundingAmount[project.contractProjectId] || ""}
              setFundingAmount={value =>
                setFundingAmount({
                  ...fundingAmount,
                  [project.contractProjectId]: value,
                })
              }
              reloadProjects={loadProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}
