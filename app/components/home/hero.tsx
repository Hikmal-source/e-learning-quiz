"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  GitBranch,
  Hammer,
  FlaskConical,
  Rocket,
  Activity,
  Check,
} from "lucide-react";

const pipeline = [
  {
    label: "Code",
    icon: GitBranch,
  },
  {
    label: "Build",
    icon: Hammer,
  },
  {
    label: "Test",
    icon: FlaskConical,
  },
  {
    label: "Deploy",
    icon: Rocket,
  },
  {
    label: "Monitor",
    icon: Activity,
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Content */}
        <div>
          <span className="inline-flex rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
            DevOps Learning Platform
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Learn.
            <span className="text-primary"> Practice.</span>
            <br />
            Master DevOps.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-text-secondary">
            Pelajari fundamental DevOps melalui materi terstruktur,
            latihan, dan quiz interaktif untuk membangun pemahaman
            secara bertahap.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Mulai Belajar
            </Link>

            <Link
              href="#features"
              className="rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-text-primary transition hover:bg-surface-muted"
            >
              Explore Features
            </Link>
          </div>
        </div>

        {/* DevOps Visual */}
        <div className="relative">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />

              <span className="ml-3 font-mono text-xs text-text-muted">
                devlearn@pipeline
              </span>
            </div>

            {/* Terminal */}
            <div className="mt-5 rounded-xl bg-[#111815] p-5 font-mono text-sm text-green-400">
              <p>
                <span className="text-slate-500">$</span>{" "}
                git push origin main
              </p>

              <p className="mt-2 text-slate-400">
                Starting CI/CD pipeline...
              </p>

              <div className="mt-4 space-y-2">
                <motion.p
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-green-400">✓</span> Build completed
                </motion.p>

                <motion.p
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-green-400">✓</span> Tests passed
                </motion.p>

                <motion.p
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-green-400">✓</span> Docker image built
                </motion.p>

                <motion.p
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-green-400">✓</span>{" "}
                  Deployment successful
                </motion.p>
              </div>

              <p className="mt-4">
                <span className="text-slate-500">$</span>{" "}
                <motion.span
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  _
                </motion.span>
              </p>
            </div>

            {/* Pipeline */}
            <div className="mt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                CI/CD Pipeline
              </p>

              <div className="flex items-center justify-between">
                {pipeline.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex flex-1 items-center"
                    >
                      {/* Pipeline Node */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.12, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.4,
                            ease: "easeInOut",
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>

                        <span className="mt-2 text-[11px] font-medium text-text-secondary">
                          {item.label}
                        </span>
                      </div>

                      {/* Pipeline Line */}
                      {index < pipeline.length - 1 && (
                        <motion.div
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scaleX: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.4 + 0.2,
                            ease: "easeInOut",
                          }}
                          className="mx-2 h-px flex-1 origin-left bg-primary"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-6 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft"
                >
                  <Check className="h-4 w-4 text-primary" />
                </motion.div>

                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Deployment
                  </p>

                  <p className="text-xs text-text-muted">
                    Production environment
                  </p>
                </div>
              </div>

              <motion.span
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-xs font-semibold text-primary"
              >
                SUCCESS
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}