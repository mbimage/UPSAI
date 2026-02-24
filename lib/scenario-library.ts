export type Scenario = {
  id: string
  title: string
  situation: string
  challenge: string
  considerations: string[]
  reflectionQuestions: string[]
  relatedTopics: string[]
  tags: string[]
}

// Organized by key themes that might come up in athlete conversations
export const scenarios: Record<string, Scenario[]> = {
  "performance-anxiety": [
    {
      id: "pre-game-nerves",
      title: "Pre-Game Nerves",
      situation: "You have a championship game tomorrow and can't sleep because of anxiety.",
      challenge: "How do you manage your pre-game nerves without letting them affect your performance?",
      considerations: [
        "Physical symptoms of anxiety can be similar to excitement",
        "Preparation routines can help channel nervous energy",
        "Visualization techniques can build confidence",
      ],
      reflectionQuestions: [
        "What specific thoughts are causing your anxiety?",
        "What has helped you manage nerves in the past?",
        "How might this nervous energy actually help your performance?",
      ],
      relatedTopics: ["mindfulness", "performance-psychology", "sleep-hygiene"],
      tags: ["mental-health", "performance", "game-day"],
    },
    {
      id: "spotlight-pressure",
      title: "Performing Under Pressure",
      situation: "You're at the free-throw line with 3 seconds left and your team down by 1 point.",
      challenge: "How do you stay focused and perform under intense pressure?",
      considerations: [
        "Routine creates a sense of control",
        "Focusing on process over outcome reduces pressure",
        "Controlled breathing regulates your nervous system",
      ],
      reflectionQuestions: [
        "What aspects of this situation are within your control?",
        "How can you narrow your focus to just the task at hand?",
        "What positive experiences can you draw confidence from?",
      ],
      relatedTopics: ["clutch-performance", "focus", "pressure-management"],
      tags: ["mental-toughness", "game-situations", "focus"],
    },
  ],
  "team-dynamics": [
    {
      id: "difficult-teammate",
      title: "The Difficult Teammate",
      situation: "A talented teammate constantly criticizes others and creates tension during practice.",
      challenge: "How do you address negative team dynamics while maintaining team cohesion?",
      considerations: [
        "Understanding their perspective might reveal underlying issues",
        "Private conversations are often more effective than public confrontations",
        "Focus on specific behaviors rather than character judgments",
      ],
      reflectionQuestions: [
        "What might be causing this teammate's behavior?",
        "How is this affecting team performance and morale?",
        "What role can you play in improving the situation?",
      ],
      relatedTopics: ["conflict-resolution", "leadership", "communication"],
      tags: ["teamwork", "conflict", "leadership"],
    },
    {
      id: "new-team-integration",
      title: "Joining a New Team",
      situation: "You've transferred schools and are joining a team where everyone already knows each other.",
      challenge: "How do you integrate yourself into an established team culture?",
      considerations: [
        "Observation before action helps understand team dynamics",
        "Finding common ground builds connections",
        "Demonstrating value through effort earns respect",
      ],
      reflectionQuestions: [
        "What unique strengths do you bring to this team?",
        "How can you learn the unwritten rules of this team culture?",
        "What small steps can you take to build relationships?",
      ],
      relatedTopics: ["belonging", "team-culture", "relationship-building"],
      tags: ["social-skills", "adaptation", "team-culture"],
    },
  ],
  "academic-athletic-balance": [
    {
      id: "finals-week-tournament",
      title: "Finals Week Tournament",
      situation: "You have a major tournament the same week as your final exams.",
      challenge: "How do you balance academic responsibilities with athletic commitments?",
      considerations: [
        "Early planning can prevent last-minute conflicts",
        "Communication with professors and coaches creates options",
        "Efficient study methods maximize limited time",
      ],
      reflectionQuestions: [
        "What specific conflicts exist in your schedule?",
        "What resources (people, tools) could help you manage this situation?",
        "How can you prioritize your most important responsibilities?",
      ],
      relatedTopics: ["time-management", "stress-management", "prioritization"],
      tags: ["academics", "time-management", "stress"],
    },
  ],
  "career-planning": [
    {
      id: "beyond-sports",
      title: "Life Beyond Sports",
      situation: "You're passionate about your sport but realize a professional career isn't likely.",
      challenge: "How do you leverage your athletic experience for career success?",
      considerations: [
        "Athletic skills like discipline and teamwork transfer to many careers",
        "Your athletic network can provide career opportunities",
        "Exploring interests outside sports can reveal new passions",
      ],
      reflectionQuestions: [
        "What aspects of being an athlete do you most enjoy?",
        "What careers might allow you to use similar skills?",
        "Who in your network might help you explore career options?",
      ],
      relatedTopics: ["transferable-skills", "networking", "career-exploration"],
      tags: ["future-planning", "identity", "career"],
    },
    {
      id: "personal-branding",
      title: "Building Your Personal Brand",
      situation: "You want to leverage your athletic achievements for future opportunities.",
      challenge: "How do you build a personal brand that highlights your unique strengths?",
      considerations: [
        "Authenticity resonates more than perfection",
        "Consistency across platforms builds recognition",
        "Your story and values differentiate you from others",
      ],
      reflectionQuestions: [
        "What three words would you want others to associate with you?",
        "What unique perspective or experience do you bring?",
        "How do your actions align with the image you want to project?",
      ],
      relatedTopics: ["social-media", "networking", "personal-marketing"],
      tags: ["personal-brand", "communication", "networking"],
    },
  ],
  leadership: [
    {
      id: "leading-by-example",
      title: "Leading Without a Title",
      situation: "You're not a team captain, but you see ways the team could improve.",
      challenge: "How do you lead and influence without formal authority?",
      considerations: [
        "Actions often speak louder than words",
        "Building one-on-one relationships increases influence",
        "Supporting existing leadership can create unity",
      ],
      reflectionQuestions: [
        "What specific behaviors could you model for teammates?",
        "How might you suggest ideas in a way that doesn't challenge authority?",
        "What small changes could make a big difference for your team?",
      ],
      relatedTopics: ["influence", "team-culture", "communication"],
      tags: ["leadership", "teamwork", "influence"],
    },
  ],
  "injury-recovery": [
    {
      id: "comeback-mindset",
      title: "The Comeback Mindset",
      situation: "You're recovering from a serious injury and feeling disconnected from your team.",
      challenge: "How do you stay positive and connected during recovery?",
      considerations: [
        "Recovery is an opportunity to develop mental aspects of your game",
        "Finding ways to contribute off the field maintains team connection",
        "Setting recovery milestones provides motivation",
      ],
      reflectionQuestions: [
        "How can you reframe this challenge as an opportunity?",
        "What team contributions can you make while recovering?",
        "What small wins can you celebrate during your recovery?",
      ],
      relatedTopics: ["resilience", "mental-health", "team-connection"],
      tags: ["injury", "mental-health", "resilience"],
    },
  ],
  communication: [
    {
      id: "coach-communication",
      title: "Communicating with Coaches",
      situation: "You disagree with your coach's decision about your playing time.",
      challenge: "How do you have a productive conversation about your concerns?",
      considerations: [
        "Timing and privacy matter for difficult conversations",
        "Focusing on growth rather than complaints shows maturity",
        "Preparation helps you communicate clearly under stress",
      ],
      reflectionQuestions: [
        "What specific outcome are you hoping for from this conversation?",
        "How might the situation look from your coach's perspective?",
        "What facts (rather than feelings) support your position?",
      ],
      relatedTopics: ["assertiveness", "conflict-resolution", "perspective-taking"],
      tags: ["communication", "coach-relationships", "advocacy"],
    },
  ],
}

// Function to find relevant scenarios based on keywords
export function findRelevantScenarios(keywords: string[]): Scenario[] {
  const matchedScenarios: Scenario[] = []
  const processedKeywords = keywords.map((k) => k.toLowerCase())

  // Check theme matches
  for (const [theme, scenarioList] of Object.entries(scenarios)) {
    if (processedKeywords.some((keyword) => theme.toLowerCase().includes(keyword))) {
      matchedScenarios.push(...scenarioList)
      continue
    }

    // Check tag and related topic matches
    for (const scenario of scenarioList) {
      const allTerms = [...scenario.tags, ...scenario.relatedTopics, scenario.title.toLowerCase()]

      if (processedKeywords.some((keyword) => allTerms.some((term) => term.toLowerCase().includes(keyword)))) {
        matchedScenarios.push(scenario)
      }
    }
  }

  // Return unique scenarios (no duplicates)
  return Array.from(new Set(matchedScenarios))
}

// Function to get a random scenario from a specific theme
export function getRandomScenario(theme: keyof typeof scenarios): Scenario | null {
  const themeScenarios = scenarios[theme]
  if (!themeScenarios || themeScenarios.length === 0) return null

  const randomIndex = Math.floor(Math.random() * themeScenarios.length)
  return themeScenarios[randomIndex]
}

// Function to get all available themes
export function getAllThemes(): string[] {
  return Object.keys(scenarios)
}

// Function to get a scenario by ID
export function getScenarioById(id: string): Scenario | null {
  for (const scenarioList of Object.values(scenarios)) {
    const found = scenarioList.find((scenario) => scenario.id === id)
    if (found) return found
  }
  return null
}
