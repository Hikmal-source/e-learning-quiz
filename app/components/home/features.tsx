import { BookOpen, Trophy, Wrench } from "lucide-react";

const features = [
  {
    title: "Learning Materials",
    description:
      "Pelajari fundamental dan konsep DevOps melalui materi yang terstruktur dan mudah dipahami.",
    icon: BookOpen,
  },
  {
    title: "Practice Questions",
    description:
      "Uji pemahaman tentang konsep dan tools DevOps melalui latihan soal.",
    icon: Wrench,
  },
  {
    title: "Quiz & Leaderboard",
    description:
      "Tantang kemampuanmu melalui quiz dengan batas waktu dan lihat hasilnya di leaderboard.",
    icon: Trophy,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-semibold text-primary">
            LEARNING EXPERIENCE
          </p>

          <h2 className="mt-2 text-3xl font-bold text-text-primary">
            Learn DevOps through practice
          </h2>

          <p className="mt-4 text-text-secondary">
            Pelajari konsep dan tools DevOps melalui materi,
            latihan soal, dan quiz yang dirancang untuk membantu
            membangun pemahaman secara bertahap.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-1 hover:border-border-hover hover:shadow-lg"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>

                <p className="mt-2 leading-7 text-text-secondary">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}