"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  _id: string;
  contractProjectId: number;
  title: string;
  description: string;
  status: string;
  milestones: string[];
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <section className="relative overflow-hidden px-8 py-24 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#60a5fa,_transparent_40%)]" />

        <div className="relative max-w-5xl mx-auto">
          <p className="mb-4 text-blue-300 font-semibold tracking-wide uppercase">Decentralized Milestone Funding</p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Fund projects securely with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              blockchain milestones
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            A hybrid DApp built with Scaffold-ETH 2, Solidity, Next.js, MongoDB, and Sepolia testnet. Funders release
            payments only when milestones are completed.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-project"
              className="px-8 py-4 rounded-full bg-blue-500 hover:bg-blue-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 font-bold"
            >
              Create Project
            </Link>

            <Link
              href="/projects"
              className="px-8 py-4 rounded-full border border-blue-300 hover:bg-blue-300 hover:text-slate-950 transition-all duration-300 hover:scale-105 font-bold"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Smart Contract Escrow",
            text: "Funds are locked on-chain and released milestone by milestone.",
            icon: "🔐",
          },
          {
            title: "Sepolia Testnet",
            text: "All blockchain transactions are tested on a public Ethereum test network.",
            icon: "⛓️",
          },
          {
            title: "MongoDB Backend",
            text: "Project metadata, descriptions, and milestone lists are stored off-chain.",
            icon: "🗄️",
          },
        ].map(card => (
          <div
            key={card.title}
            className="group rounded-3xl bg-white/10 backdrop-blur border border-white/10 p-8 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
            <h2 className="text-2xl font-bold mb-3">{card.title}</h2>
            <p className="text-slate-300">{card.text}</p>
          </div>
        ))}
      </section>

      <section className="px-8 py-16 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-300 font-semibold">Live Projects</p>
              <h2 className="text-4xl font-bold">Recently Created Projects</h2>
            </div>

            <Link href="/projects" className="hidden md:block text-blue-300 hover:text-blue-100 transition">
              View all →
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-slate-300">No projects found yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map(project => (
                <div
                  key={project._id}
                  className="rounded-3xl bg-slate-900 border border-blue-400/20 p-6 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <div className="h-36 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-5 flex items-center justify-center text-5xl">
                    🚀
                  </div>

                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-slate-300 line-clamp-3">{project.description}</p>

                  <div className="mt-5 flex justify-between text-sm text-slate-300">
                    <span>ID #{project.contractProjectId}</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl font-extrabold mb-4">Ready to fund milestones transparently?</h2>
          <p className="text-blue-50 mb-8 max-w-2xl mx-auto">
            Create a project, fund it on Sepolia, and release payments only when milestones are achieved.
          </p>

          <Link
            href="/create-project"
            className="inline-block px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-slate-100 transition-all duration-300 hover:scale-105 font-bold"
          >
            Start Now
          </Link>
        </div>
      </section>
    </main>
  );
}
