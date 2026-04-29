"use client";

import { formatEther, parseEther } from "viem";
import { useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { BackendProject } from "~~/services/api/projects";

type ProjectCardProps = {
  project: BackendProject;
  fundingAmount: string;
  setFundingAmount: (value: string) => void;
  reloadProjects: () => Promise<void>;
};

export function ProjectCard({ project, fundingAmount, setFundingAmount, reloadProjects }: ProjectCardProps) {
  const { writeContractAsync } = useWriteContract();

  const chainId = 31337;
  const contract = deployedContracts[chainId].MilestoneFunding;

  const { data: blockchainProject } = useScaffoldReadContract({
    contractName: "MilestoneFunding",
    functionName: "getProject",
    args: [BigInt(project.contractProjectId)],
  });

  const totalAmount = blockchainProject ? formatEther(blockchainProject.totalAmount) : "0";
  const releasedAmount = blockchainProject ? formatEther(blockchainProject.releasedAmount) : "0";
  const completedMilestones = blockchainProject ? Number(blockchainProject.completedMilestones) : 0;
  const status = blockchainProject ? Number(blockchainProject.status) : 0;

  async function handleFundProject() {
    try {
      await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "fundProject",
        args: [BigInt(project.contractProjectId)],
        value: parseEther(fundingAmount),
      });

      alert("Project funded successfully");
      await reloadProjects();
    } catch (error) {
      console.error(error);
      alert("Funding failed. Use a different wallet from the creator.");
    }
  }

  async function handleReleaseMilestone(index: number) {
    try {
      await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "releaseMilestone",
        args: [BigInt(project.contractProjectId), BigInt(index)],
      });

      alert("Milestone released successfully");
      await reloadProjects();
    } catch (error) {
      console.error(error);
      alert("Only the funder can release milestones.");
    }
  }

  return (
    <div className="border rounded-xl p-5 shadow space-y-4">
      <h2 className="text-xl font-semibold">{project.title}</h2>
      <p>{project.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <p>Contract ID: {project.contractProjectId}</p>
        <p>Status: {status === 0 ? "Active" : status === 1 ? "Completed" : "Cancelled"}</p>
        <p>Total Funded: {totalAmount} ETH</p>
        <p>Released: {releasedAmount} ETH</p>
        <p>Completed Milestones: {completedMilestones}</p>
        <p>Total Milestones: {project.milestones.length}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Milestones</h3>

        {project.milestones.map((milestone, index) => (
          <div key={index} className="flex justify-between items-center border rounded-lg p-3">
            <span>
              {index + 1}. {milestone}
            </span>

            <button
              className="btn btn-sm btn-secondary"
              disabled={index < completedMilestones || status !== 0}
              onClick={() => handleReleaseMilestone(index)}
            >
              {index < completedMilestones ? "Released" : "Release"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="input input-bordered"
          placeholder="Amount in ETH"
          value={fundingAmount}
          disabled={Number(totalAmount) > 0}
          onChange={e => setFundingAmount(e.target.value)}
        />

        <button className="btn btn-primary" disabled={Number(totalAmount) > 0} onClick={handleFundProject}>
          {Number(totalAmount) > 0 ? "Funded" : "Fund Project"}
        </button>
      </div>
    </div>
  );
}
