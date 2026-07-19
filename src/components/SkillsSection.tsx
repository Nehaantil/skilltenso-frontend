import React from 'react';

const skills = [
  { name: "Web Development", count: "245 learners", icon: "💻", color: "#7c3aed" },
  { name: "Graphic Design", count: "189 learners", icon: "🎨", color: "#ec4899" },
  { name: "Digital Marketing", count: "156 learners", icon: "📱", color: "#f59e0b" },
  { name: "Photography", count: "132 learners", icon: "📸", color: "#06b6d4" },
  { name: "Music Production", count: "98 learners", icon: "🎵", color: "#10b981" },
  { name: "Language Learning", count: "87 learners", icon: "🌍", color: "#f97316" },
  { name: "UI/UX Design", count: "76 learners", icon: "✏️", color: "#8b5cf6" },
  { name: "Data Science", count: "65 learners", icon: "📊", color: "#ef4444" },
];

function SkillsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Popular Skills</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of learners exchanging these in-demand skills
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <div key={i}
              className="glass-card p-5 text-center cursor-pointer hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {skill.icon}
              </div>
              <div className="font-semibold text-white text-sm mb-1">{skill.name}</div>
              <div className="text-xs mt-1" style={{ color: skill.color }}>{skill.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;