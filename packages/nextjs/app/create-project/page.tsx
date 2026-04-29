"use client";

import { useState } from "react";
//import { parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { createBackendProject } from "~~/services/api/projects";

export default function CreateProjectPage() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState("");
  const [loading, setLoading] = useState(false);

  const chainId = 31337;
  const contract = deployedContracts[chainId].MilestoneFunding;

  const { data: projectCounter } = useScaffoldReadContract({
    contractName: "MilestoneFunding",
    functionName: "projectCounter",
  });

  async function handleCreateProject() {
    try {
      setLoading(true);

      const milestoneList = milestones
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

      const milestoneCount = BigInt(milestoneList.length);

      await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "createProject",
        args: [title, milestoneCount],
      });

      const nextProjectId = Number(projectCounter || 0n) + 1;

      await createBackendProject({
        contractProjectId: nextProjectId,
        title,
        description,
        creatorAddress: address || "",
        funderAddress: "",
        imageUrl: "",
        milestones: milestoneList,
        status: "Active",
      });

      alert("Project created successfully!");

      setTitle("");
      setDescription("");
      setMilestones("");
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Milestone Project</h1>

      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Project title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Project description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Milestones separated by commas, e.g. Design, Development, Testing"
          value={milestones}
          onChange={e => setMilestones(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleCreateProject}
          disabled={loading || !title || !description || !milestones}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </div>
  );
}
