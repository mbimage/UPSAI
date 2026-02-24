import type React from "react"

interface GrowthOpportunity {
  title: string
  description: string
  type: "achievement" | "growth" | "strength" | "goal" | "progress"
}

const PersonalizedGrowthOpportunities: React.FC = () => {
  const opportunities: GrowthOpportunity[] = [
    {
      title: "Completed Project Alpha",
      description: "Successfully delivered Project Alpha, exceeding client expectations.",
      type: "achievement",
    },
    {
      title: "Mastered React Hooks",
      description: "Gained proficiency in React Hooks, improving component reusability.",
      type: "growth",
    },
    {
      title: "Improved Time Management",
      description: "Implemented new time management techniques, increasing productivity.",
      type: "strength",
    },
    {
      title: "Learn TypeScript",
      description: "Set a goal to learn TypeScript and improve code maintainability.",
      type: "goal",
    },
    {
      title: "Refactored Legacy Code",
      description: "Made significant progress in refactoring legacy code, reducing technical debt.",
      type: "progress",
    },
  ]

  const getSymbol = (type: string) => {
    switch (type) {
      case "achievement":
        return "⭐"
      case "growth":
        return "✨"
      case "strength":
        return "💪"
      case "goal":
        return "🎯"
      case "progress":
        return "🚀"
      default:
        return ""
    }
  }

  return (
    <div>
      <h2>Personalized Growth Opportunities</h2>
      <ul>
        {opportunities.map((opportunity, index) => (
          <li key={index}>
            {getSymbol(opportunity.type)} {opportunity.title} - {opportunity.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PersonalizedGrowthOpportunities
