"use client";

import { useEffect, useState } from "react";
import { BackendProject, getBackendProjects } from "~~/services/api/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<BackendProject[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const data = await getBackendProjects();
      setProjects(data);
    }

    loadProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Milestone Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project._id} className="border rounded-xl p-4 shadow">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p>{project.description}</p>
              <p className="text-sm mt-2">Status: {project.status}</p>
              <p className="text-sm">Contract ID: {project.contractProjectId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
