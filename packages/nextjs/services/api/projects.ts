const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export type BackendProject = {
  _id?: string;
  contractProjectId: number;
  title: string;
  description: string;
  creatorAddress: string;
  funderAddress?: string;
  imageUrl?: string;
  milestones: string[];
  status: string;
};

export async function createBackendProject(project: BackendProject) {
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error("Failed to create backend project");
  }

  return response.json();
}

export async function getBackendProjects() {
  const response = await fetch(`${API_URL}/api/projects`);

  if (!response.ok) {
    throw new Error("Failed to fetch backend projects");
  }

  return response.json();
}
