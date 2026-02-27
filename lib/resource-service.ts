export type ResourceType =
  | "guide"
  | "assessment"
  | "tool"
  | "video"
  | "article"
  | "worksheet"
  | "infographic"
  | "podcast"
  | "webinar"
export type ResourceCategory =
  | "self-efficacy"
  | "emotional-intelligence"
  | "social-awareness"
  | "career-readiness"
  | "leadership"
  | "mental-health"
  | "time-management"
  | "communication"
  | "setback-response"
  | "rural-challenges"
  | "academic-balance"
  | "general"

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  category: ResourceCategory
  imageUrl: string
  content?: string
  url?: string
  estimatedTime?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  featured?: boolean
  tags?: string[]
  author?: string
  datePublished?: string
  downloadable?: boolean
  new?: boolean
  premium?: boolean
  relatedResources?: string[]
  views?: number
  rating?: number
  completionRate?: number
}

// Comprehensive collection of resources focused on E+R=O and rural athlete challenges
const resources: Resource[] = [
  // E+R=O Framework Resources
  {
    id: "ero-framework-master-guide",
    title: "E+R=O Framework: Master Your Response to Any Setback",
    description:
      "The complete guide to understanding Event + Response = Outcome. Learn how to control what you can control and turn every setback into a comeback.",
    type: "guide",
    category: "setback-response",
    imageUrl: "/ero-framework-guide.png",
    estimatedTime: "25 min",
    difficulty: "beginner",
    featured: true,
    tags: ["E+R=O", "setbacks", "resilience", "mindset", "control"],
    author: "Dr. Sarah Martinez, Sports Psychology",
    datePublished: "2024-01-15",
    downloadable: true,
    views: 2847,
    rating: 4.9,
    completionRate: 87,
    content: `
      <h2>Understanding the E+R=O Framework</h2>
      <p>The E+R=O framework is a powerful mental model that helps you understand that while you cannot control events that happen to you, you can always control your response, which ultimately determines your outcome.</p>
      
      <h3>Breaking Down the Formula</h3>
      <ul>
        <li><strong>Event (E):</strong> What happens to you - setbacks, challenges, failures</li>
        <li><strong>Response (R):</strong> How you choose to react - your thoughts, emotions, and actions</li>
        <li><strong>Outcome (O):</strong> The result of your response - success, growth, or continued struggle</li>
      </ul>
      
      <h3>Real Examples for Student Athletes</h3>
      <p><strong>Scenario 1: Losing the Championship Game</strong></p>
      <ul>
        <li>Event: Lost the game by 2 points</li>
        <li>Response Option A: Blame refs, quit trying → Outcome: Bitterness, no growth</li>
        <li>Response Option B: Analyze mistakes, train harder → Outcome: Improved skills, mental toughness</li>
      </ul>
      
      <h3>The Power of Choice</h3>
      <p>Every setback gives you a choice. You can choose to be a victim of circumstances or the architect of your comeback. Champions choose their response.</p>
    `,
    relatedResources: ["setback-response-toolkit", "champion-mindset-guide", "resilience-building-exercises"],
  },

  {
    id: "setback-response-toolkit",
    title: "Setback Response Toolkit: 50 Proven Strategies",
    description:
      "A comprehensive toolkit with 50 proven response strategies for common setbacks faced by student athletes. Turn every challenge into growth.",
    type: "tool",
    category: "setback-response",
    imageUrl: "/setback-response-toolkit.png",
    estimatedTime: "45 min",
    difficulty: "intermediate",
    featured: true,
    tags: ["strategies", "responses", "toolkit", "practical", "setbacks"],
    author: "Coach Michael Johnson, Former Olympic Trainer",
    datePublished: "2024-01-20",
    downloadable: true,
    views: 1923,
    rating: 4.8,
    completionRate: 76,
    relatedResources: ["ero-framework-master-guide", "mental-toughness-builder"],
  },

  {
    id: "rural-athlete-challenges-guide",
    title: "Overcoming Rural Athlete Challenges: Your Advantage Playbook",
    description:
      "Turn the unique challenges of being a rural Texas athlete into your competitive advantage. Limited resources, unlimited potential.",
    type: "guide",
    category: "rural-challenges",
    imageUrl: "/rural-athlete-advantages.png",
    estimatedTime: "30 min",
    difficulty: "intermediate",
    featured: true,
    tags: ["rural", "texas", "challenges", "advantages", "resources"],
    author: "Maria Rodriguez, Rural Education Specialist",
    datePublished: "2024-01-10",
    downloadable: true,
    new: true,
    views: 1456,
    rating: 4.7,
    completionRate: 82,
    content: `
      <h2>Your Rural Advantage</h2>
      <p>Being a rural Texas athlete comes with unique challenges, but also incredible advantages that urban athletes don't have.</p>
      
      <h3>Common Rural Challenges & E+R=O Responses</h3>
      
      <h4>Challenge: Limited Equipment/Facilities</h4>
      <ul>
        <li><strong>Event:</strong> Old gym, worn equipment, no fancy training facilities</li>
        <li><strong>Champion Response:</strong> Focus on fundamentals, creativity, and mental toughness</li>
        <li><strong>Outcome:</strong> Superior fundamentals and adaptability that gives you an edge</li>
      </ul>
      
      <h4>Challenge: Fewer College Scouts</h4>
      <ul>
        <li><strong>Event:</strong> Scouts rarely visit small rural schools</li>
        <li><strong>Champion Response:</strong> Create highlight videos, reach out proactively, excel academically</li>
        <li><strong>Outcome:</strong> Stand out through initiative and well-rounded excellence</li>
      </ul>
      
      <h3>Your Hidden Advantages</h3>
      <ul>
        <li><strong>Work Ethic:</strong> Farm/ranch work builds unmatched toughness</li>
        <li><strong>Community Support:</strong> Tight-knit communities rally behind their athletes</li>
        <li><strong>Resourcefulness:</strong> Making do with less builds creativity and problem-solving</li>
        <li><strong>Character:</strong> Rural values build integrity and leadership</li>
      </ul>
    `,
    relatedResources: ["small-town-big-dreams", "resourcefulness-training"],
  },

  // Self-Efficacy Resources
  {
    id: "self-efficacy-assessment-comprehensive",
    title: "Comprehensive Self-Efficacy Assessment for Athletes",
    description:
      "Evaluate your confidence levels across athletics, academics, and life skills. Get personalized recommendations for building unshakeable self-belief.",
    type: "assessment",
    category: "self-efficacy",
    imageUrl: "/self-efficacy-assessment-comprehensive.png",
    estimatedTime: "15 min",
    difficulty: "beginner",
    featured: true,
    tags: ["assessment", "confidence", "self-belief", "evaluation"],
    author: "Dr. James Wilson, Sports Psychology",
    datePublished: "2024-01-12",
    views: 3241,
    rating: 4.6,
    completionRate: 91,
    relatedResources: ["confidence-building-plan", "self-talk-mastery"],
  },

  {
    id: "confidence-building-plan",
    title: "30-Day Confidence Building Plan for Student Athletes",
    description:
      "A step-by-step 30-day plan to build unshakeable confidence in sports, academics, and life. Includes daily exercises and progress tracking.",
    type: "tool",
    category: "self-efficacy",
    imageUrl: "/confidence-building-plan.png",
    estimatedTime: "5 min daily",
    difficulty: "beginner",
    tags: ["confidence", "30-day", "plan", "exercises", "tracking"],
    author: "Coach Lisa Thompson",
    datePublished: "2024-01-18",
    downloadable: true,
    views: 2156,
    rating: 4.8,
    completionRate: 68,
    relatedResources: ["self-efficacy-assessment-comprehensive", "visualization-mastery"],
  },

  {
    id: "visualization-mastery",
    title: "Visualization Mastery: See It, Believe It, Achieve It",
    description:
      "Master the art of mental imagery to enhance performance, build confidence, and prepare for success in any situation.",
    type: "video",
    category: "self-efficacy",
    imageUrl: "/visualization-mastery.png",
    estimatedTime: "22 min",
    difficulty: "intermediate",
    tags: ["visualization", "mental-imagery", "performance", "preparation"],
    author: "Olympic Coach Maria Santos",
    datePublished: "2024-01-25",
    new: true,
    views: 1834,
    rating: 4.9,
    completionRate: 79,
    relatedResources: ["confidence-building-plan", "pre-game-mental-prep"],
  },

  // Emotional Intelligence Resources
  {
    id: "emotional-intelligence-for-athletes",
    title: "Emotional Intelligence for High-Performance Athletes",
    description:
      "Develop the emotional skills that separate good athletes from great ones. Master self-awareness, self-regulation, and social skills.",
    type: "guide",
    category: "emotional-intelligence",
    imageUrl: "/emotional-intelligence-athletes.png",
    estimatedTime: "35 min",
    difficulty: "intermediate",
    featured: true,
    tags: ["emotional-intelligence", "self-awareness", "regulation", "performance"],
    author: "Dr. Emily Chen, Performance Psychology",
    datePublished: "2024-01-08",
    downloadable: true,
    views: 2967,
    rating: 4.7,
    completionRate: 73,
    relatedResources: ["pressure-management-toolkit", "team-chemistry-builder"],
  },

  {
    id: "pressure-management-toolkit",
    title: "Pressure Management Toolkit: Thrive Under Pressure",
    description:
      "Learn to thrive under pressure with proven techniques for managing stress, anxiety, and high-stakes situations.",
    type: "tool",
    category: "emotional-intelligence",
    imageUrl: "/pressure-management-toolkit.png",
    estimatedTime: "20 min",
    difficulty: "intermediate",
    tags: ["pressure", "stress", "anxiety", "performance", "techniques"],
    author: "Sports Psychologist Dr. Robert Garcia",
    datePublished: "2024-01-22",
    downloadable: true,
    views: 2445,
    rating: 4.8,
    completionRate: 81,
    relatedResources: ["emotional-intelligence-for-athletes", "clutch-performance-guide"],
  },

  {
    id: "mindfulness-for-athletes",
    title: "Mindfulness Training for Student Athletes",
    description:
      "Develop present-moment awareness to improve focus, reduce anxiety, and enhance performance both on and off the field.",
    type: "video",
    category: "emotional-intelligence",
    imageUrl: "/mindfulness-athletes.png",
    estimatedTime: "18 min",
    difficulty: "beginner",
    tags: ["mindfulness", "focus", "anxiety", "present-moment", "awareness"],
    author: "Mindfulness Coach Jennifer Lee",
    datePublished: "2024-01-14",
    views: 1789,
    rating: 4.6,
    completionRate: 85,
    relatedResources: ["pressure-management-toolkit", "mental-recovery-techniques"],
  },

  // Social Awareness & Leadership
  {
    id: "reading-the-room-athlete-edition",
    title: "Reading the Room: Social Intelligence for Athletes",
    description:
      "Develop the ability to read social situations, understand team dynamics, and navigate complex interpersonal relationships.",
    type: "guide",
    category: "social-awareness",
    imageUrl: "/reading-the-room-athletes.png",
    estimatedTime: "25 min",
    difficulty: "intermediate",
    tags: ["social-intelligence", "team-dynamics", "relationships", "communication"],
    author: "Team Dynamics Expert Dr. Lisa Johnson",
    datePublished: "2024-01-16",
    downloadable: true,
    views: 1654,
    rating: 4.5,
    completionRate: 77,
    relatedResources: ["leadership-development-path", "conflict-resolution-playbook"],
  },

  {
    id: "leadership-development-path",
    title: "Leadership Development Path for Student Athletes",
    description:
      "A comprehensive roadmap for developing leadership skills that will serve you in sports, academics, and your future career.",
    type: "tool",
    category: "leadership",
    imageUrl: "/leadership-development-path.png",
    estimatedTime: "40 min",
    difficulty: "advanced",
    featured: true,
    tags: ["leadership", "development", "skills", "roadmap", "career"],
    author: "Leadership Coach Mark Thompson",
    datePublished: "2024-01-11",
    downloadable: true,
    views: 2234,
    rating: 4.9,
    completionRate: 69,
    relatedResources: ["reading-the-room-athlete-edition", "team-captain-handbook"],
  },

  {
    id: "conflict-resolution-playbook",
    title: "Conflict Resolution Playbook for Teams",
    description:
      "Master the art of resolving conflicts with teammates, coaches, and others. Turn tension into team strength.",
    type: "guide",
    category: "social-awareness",
    imageUrl: "/conflict-resolution-playbook.png",
    estimatedTime: "20 min",
    difficulty: "intermediate",
    tags: ["conflict", "resolution", "teamwork", "communication", "relationships"],
    author: "Conflict Resolution Specialist Dr. Amanda White",
    datePublished: "2024-01-19",
    downloadable: true,
    new: true,
    views: 1432,
    rating: 4.7,
    completionRate: 83,
    relatedResources: ["reading-the-room-athlete-edition", "difficult-conversations-guide"],
  },

  // Career Readiness & Future Planning
  {
    id: "life-after-sports-planning-guide",
    title: "Life After Sports: Career Planning for Student Athletes",
    description:
      "Plan for a successful career beyond athletics. Leverage your athletic skills in the professional world.",
    type: "guide",
    category: "career-readiness",
    imageUrl: "/life-after-sports-planning.png",
    estimatedTime: "45 min",
    difficulty: "intermediate",
    featured: true,
    tags: ["career", "planning", "transition", "professional", "skills"],
    author: "Career Transition Specialist Maria Sanchez",
    datePublished: "2024-01-13",
    downloadable: true,
    views: 2678,
    rating: 4.8,
    completionRate: 71,
    relatedResources: ["transferable-skills-inventory", "networking-for-athletes"],
  },

  {
    id: "transferable-skills-inventory",
    title: "Transferable Skills Inventory: From Field to Career",
    description: "Identify and articulate the valuable skills you've developed through athletics that employers want.",
    type: "assessment",
    category: "career-readiness",
    imageUrl: "/transferable-skills-inventory.png",
    estimatedTime: "20 min",
    difficulty: "beginner",
    tags: ["skills", "inventory", "transferable", "career", "employers"],
    author: "HR Specialist Jennifer Brown",
    datePublished: "2024-01-17",
    downloadable: true,
    views: 1876,
    rating: 4.6,
    completionRate: 88,
    relatedResources: ["life-after-sports-planning-guide", "resume-builder-athletes"],
  },

  {
    id: "networking-for-athletes",
    title: "Networking Strategies for Student Athletes",
    description:
      "Learn how to build and leverage professional networks using your athletic connections and experiences.",
    type: "video",
    category: "career-readiness",
    imageUrl: "/networking-for-athletes.png",
    estimatedTime: "15 min",
    difficulty: "intermediate",
    tags: ["networking", "connections", "professional", "relationships", "career"],
    author: "Former Pro Athlete John Davis",
    datePublished: "2024-01-21",
    views: 1543,
    rating: 4.5,
    completionRate: 76,
    relatedResources: ["life-after-sports-planning-guide", "personal-branding-athletes"],
  },

  // Time Management & Academic Balance
  {
    id: "student-athlete-time-mastery",
    title: "Time Mastery for Student Athletes: Balance Without Burnout",
    description:
      "Master time management to excel in sports, academics, and life without burning out. Proven systems and strategies.",
    type: "guide",
    category: "time-management",
    imageUrl: "/time-mastery-student-athletes.png",
    estimatedTime: "30 min",
    difficulty: "intermediate",
    featured: true,
    tags: ["time-management", "balance", "burnout", "systems", "productivity"],
    author: "Academic Success Coach Dr. Sarah Miller",
    datePublished: "2024-01-09",
    downloadable: true,
    views: 3156,
    rating: 4.9,
    completionRate: 84,
    relatedResources: ["energy-management-guide", "study-strategies-athletes"],
  },

  {
    id: "energy-management-guide",
    title: "Energy Management Guide: Peak Performance All Day",
    description:
      "Learn to manage your energy, not just your time. Maintain peak performance in training, competition, and academics.",
    type: "tool",
    category: "time-management",
    imageUrl: "/energy-management-guide.png",
    estimatedTime: "25 min",
    difficulty: "intermediate",
    tags: ["energy", "management", "performance", "recovery", "optimization"],
    author: "Performance Coach Alex Johnson",
    datePublished: "2024-01-23",
    downloadable: true,
    views: 1987,
    rating: 4.7,
    completionRate: 79,
    relatedResources: ["student-athlete-time-mastery", "recovery-optimization-plan"],
  },

  {
    id: "study-strategies-athletes",
    title: "Study Strategies Designed for Athletes",
    description: "Study techniques that work with an athlete's brain and schedule. Maximize learning in minimal time.",
    type: "guide",
    category: "academic-balance",
    imageUrl: "/study-strategies-athletes.png",
    estimatedTime: "20 min",
    difficulty: "beginner",
    tags: ["study", "strategies", "learning", "academic", "efficiency"],
    author: "Learning Specialist Dr. Thomas Brown",
    datePublished: "2024-01-24",
    downloadable: true,
    new: true,
    views: 1234,
    rating: 4.8,
    completionRate: 86,
    relatedResources: ["student-athlete-time-mastery", "test-anxiety-management"],
  },

  // Mental Health & Wellness
  {
    id: "mental-health-toolkit-athletes",
    title: "Mental Health Toolkit for Student Athletes",
    description:
      "Comprehensive mental health resources specifically designed for the unique pressures and challenges athletes face.",
    type: "tool",
    category: "mental-health",
    imageUrl: "/mental-health-toolkit-athletes.png",
    estimatedTime: "35 min",
    difficulty: "beginner",
    featured: true,
    tags: ["mental-health", "wellness", "pressure", "support", "resources"],
    author: "Sports Psychiatrist Dr. Emily Chen",
    datePublished: "2024-01-07",
    downloadable: true,
    views: 2789,
    rating: 4.9,
    completionRate: 82,
    relatedResources: ["stress-management-athletes", "sleep-optimization-guide"],
  },

  {
    id: "stress-management-athletes",
    title: "Stress Management for High-Performance Athletes",
    description: "Evidence-based techniques for managing stress, preventing burnout, and maintaining mental wellness.",
    type: "guide",
    category: "mental-health",
    imageUrl: "/stress-management-athletes.png",
    estimatedTime: "25 min",
    difficulty: "intermediate",
    tags: ["stress", "management", "burnout", "wellness", "techniques"],
    author: "Stress Management Expert Dr. Michael Brown",
    datePublished: "2024-01-15",
    downloadable: true,
    views: 2345,
    rating: 4.6,
    completionRate: 78,
    relatedResources: ["mental-health-toolkit-athletes", "anxiety-management-athletes"],
  },

  // Communication Skills
  {
    id: "communication-mastery-athletes",
    title: "Communication Mastery for Student Athletes",
    description:
      "Develop exceptional communication skills for interacting with coaches, teammates, teachers, and future employers.",
    type: "guide",
    category: "communication",
    imageUrl: "/communication-mastery-athletes.png",
    estimatedTime: "30 min",
    difficulty: "intermediate",
    tags: ["communication", "skills", "coaches", "teammates", "professional"],
    author: "Communication Expert Dr. Lisa Thompson",
    datePublished: "2024-01-12",
    downloadable: true,
    views: 1876,
    rating: 4.7,
    completionRate: 81,
    relatedResources: ["difficult-conversations-guide", "public-speaking-athletes"],
  },

  {
    id: "difficult-conversations-guide",
    title: "Difficult Conversations Guide for Athletes",
    description:
      "Navigate challenging conversations with confidence, whether with coaches about playing time or teammates about conflicts.",
    type: "tool",
    category: "communication",
    imageUrl: "/difficult-conversations-guide.png",
    estimatedTime: "20 min",
    difficulty: "advanced",
    tags: ["difficult", "conversations", "conflict", "communication", "confidence"],
    author: "Conflict Communication Specialist Dr. Robert Wilson",
    datePublished: "2024-01-20",
    downloadable: true,
    views: 1543,
    rating: 4.8,
    completionRate: 75,
    relatedResources: ["communication-mastery-athletes", "assertiveness-training"],
  },
]

// Enhanced service functions
export function getResources(): Resource[] {
  return resources.sort((a, b) => {
    // Sort by featured first, then by views, then by rating
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    if ((a.views || 0) !== (b.views || 0)) return (b.views || 0) - (a.views || 0)
    return (b.rating || 0) - (a.rating || 0)
  })
}

export function getResourceById(id: string): Resource | undefined {
  return resources.find((resource) => resource.id === id)
}

export function getFeaturedResources(): Resource[] {
  return resources.filter((resource) => resource.featured).slice(0, 6)
}

export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return resources.filter((resource) => resource.category === category)
}

export function getResourcesByType(type: ResourceType): Resource[] {
  return resources.filter((resource) => resource.type === type)
}

export function getNewResources(): Resource[] {
  return resources.filter((resource) => resource.new)
}

export function getPopularResources(): Resource[] {
  return resources
    .filter((resource) => (resource.views || 0) > 2000)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8)
}

export function getHighRatedResources(): Resource[] {
  return resources
    .filter((resource) => (resource.rating || 0) >= 4.7)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)
}

export function getResourcesByTag(tag: string): Resource[] {
  return resources.filter((resource) => resource.tags?.includes(tag))
}

export function getRelatedResources(resourceId: string): Resource[] {
  const resource = getResourceById(resourceId)
  if (!resource || !resource.relatedResources || resource.relatedResources.length === 0) {
    return resources.filter((r) => r.category === resource?.category && r.id !== resourceId).slice(0, 3)
  }
  return resources.filter((r) => resource.relatedResources?.includes(r.id))
}

export function searchResources(query: string): Resource[] {
  const lowercaseQuery = query.toLowerCase()
  return resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(lowercaseQuery) ||
      resource.description.toLowerCase().includes(lowercaseQuery) ||
      resource.category.toLowerCase().includes(lowercaseQuery) ||
      resource.type.toLowerCase().includes(lowercaseQuery) ||
      resource.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      resource.author?.toLowerCase().includes(lowercaseQuery),
  )
}

export function getAllCategories(): { id: ResourceCategory; label: string; count: number; description: string }[] {
  const categories: { id: ResourceCategory; label: string; description: string }[] = [
    {
      id: "setback-response",
      label: "Setback Response",
      description: "Master the E+R=O framework and turn every setback into a comeback",
    },
    {
      id: "rural-challenges",
      label: "Rural Challenges",
      description: "Turn rural challenges into competitive advantages",
    },
    {
      id: "self-efficacy",
      label: "Self-Efficacy",
      description: "Build unshakeable confidence and self-belief",
    },
    {
      id: "emotional-intelligence",
      label: "Emotional Intelligence",
      description: "Master your emotions and thrive under pressure",
    },
    {
      id: "social-awareness",
      label: "Social Awareness",
      description: "Read the room and navigate social situations with confidence",
    },
    {
      id: "leadership",
      label: "Leadership",
      description: "Develop leadership skills for sports and life",
    },
    {
      id: "career-readiness",
      label: "Career Readiness",
      description: "Prepare for success beyond athletics",
    },
    {
      id: "time-management",
      label: "Time Management",
      description: "Balance sports, academics, and life without burnout",
    },
    {
      id: "academic-balance",
      label: "Academic Balance",
      description: "Excel academically while pursuing athletic goals",
    },
    {
      id: "mental-health",
      label: "Mental Health",
      description: "Maintain mental wellness and peak performance",
    },
    {
      id: "communication",
      label: "Communication",
      description: "Master communication skills for all situations",
    },
    {
      id: "general",
      label: "General",
      description: "Foundational skills for overall success",
    },
  ]

  return categories.map((category) => ({
    ...category,
    count: resources.filter((resource) => resource.category === category.id).length,
  }))
}

export function getAllResourceTypes(): { id: ResourceType; label: string; count: number; description: string }[] {
  const types: { id: ResourceType; label: string; description: string }[] = [
    { id: "guide", label: "Guides", description: "Comprehensive written resources" },
    { id: "assessment", label: "Assessments", description: "Evaluate your current skills and knowledge" },
    { id: "tool", label: "Tools", description: "Interactive tools and worksheets" },
    { id: "video", label: "Videos", description: "Visual learning content" },
    { id: "article", label: "Articles", description: "Quick reads and insights" },
    { id: "worksheet", label: "Worksheets", description: "Hands-on practice materials" },
    { id: "infographic", label: "Infographics", description: "Visual summaries and quick references" },
    { id: "podcast", label: "Podcasts", description: "Audio content for learning on the go" },
    { id: "webinar", label: "Webinars", description: "Live and recorded training sessions" },
  ]

  return types.map((type) => ({
    ...type,
    count: resources.filter((resource) => resource.type === type.id).length,
  }))
}

export function getResourceStats() {
  return {
    totalResources: resources.length,
    totalViews: resources.reduce((sum, resource) => sum + (resource.views || 0), 0),
    averageRating: resources.reduce((sum, resource) => sum + (resource.rating || 0), 0) / resources.length,
    averageCompletionRate:
      resources.reduce((sum, resource) => sum + (resource.completionRate || 0), 0) / resources.length,
    featuredCount: resources.filter((r) => r.featured).length,
    newCount: resources.filter((r) => r.new).length,
    downloadableCount: resources.filter((r) => r.downloadable).length,
  }
}
