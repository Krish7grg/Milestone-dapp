"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { BackendProject, getBackendProjects } from "~~/services/api/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [fundingAmount, setFundingAmount] = useState<Record<number, string>>({});
  const { writeContractAsync } = useWriteContract();

  const chainId = 31337;
  const contract = deployedContracts[chainId].MilestoneFunding;

  async function loadProjects() {
    const data = await getBackendProjects();
    setProjects(data);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleFundProject(projectId: number) {
    try {
      const amount = fundingAmount[projectId];

      if (!amount) {
        alert("Enter funding amount");
        return;
      }

      await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "fundProject",
        args: [BigInt(projectId)],
        value: parseEther(amount),
      });

      alert("Project funded successfully");
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Funding failed. Make sure you are not the project creator.");
    }
  }
  async function handleReleaseMilestone(projectId: number, milestoneIndex: number) {
    try {
      await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "releaseMilestone",
        args: [BigInt(projectId), BigInt(milestoneIndex)],
      });

      alert("Milestone released successfully");
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Milestone release failed. Only the funder can release milestones.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Milestone Projects</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project._id} className="border rounded-xl p-5 shadow space-y-3">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p>{project.description}</p>

              <p className="text-sm">Status: {project.status}</p>
              <p className="text-sm">Contract ID: {project.contractProjectId}</p>

              <div>
                <h3 className="font-semibold">Milestones</h3>
                <div className="space-y-2">
                  {project.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-lg p-3">
                      <span>{milestone}</span>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleReleaseMilestone(project.contractProjectId, index)}
                      >
                        Release
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <input
                  className="input input-bordered"
                  placeholder="Amount in ETH, e.g. 0.03"
                  value={fundingAmount[project.contractProjectId] || ""}
                  onChange={e =>
                    setFundingAmount({
                      ...fundingAmount,
                      [project.contractProjectId]: e.target.value,
                    })
                  }
                />

                <button className="btn btn-primary" onClick={() => handleFundProject(project.contractProjectId)}>
                  Fund Project
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
