import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const FALLBACK_RESPONSES = {
  default:
    "I'm here as your AI teammate! I help student-athletes like you with confidence, time management, goal setting, and planning for the future. What's on your mind today?",
  confidence:
    "Building confidence is a journey, and you're already taking great steps by asking! Try these: 1) Visualize yourself succeeding before big moments, 2) Focus on what you can control (your effort and attitude), 3) Celebrate small wins every day. What specific situation are you preparing for?",
  balance:
    "Balancing school and sports takes skill, but you've got this! Here's what works: 1) Use a planner to map out your week, 2) Study during downtimes (bus rides, between classes), 3) Communicate with teachers about your schedule. Which area feels toughest right now?",
  stress:
    "Feeling stressed shows you care, which is actually a strength! Try these strategies: 1) Take 5 deep breaths when overwhelmed, 2) Break big tasks into smaller steps, 3) Talk to someone you trust. What's your biggest source of stress right now?",
  leadership:
    "Leadership grows with practice! Start small: 1) Encourage teammates during tough moments, 2) Lead by example with work ethic, 3) Learn from how others respond to challenges. What's one leadership skill you want to develop?",
  college:
    "College planning is exciting! Consider: 1) What level of competition fits your athletic goals?, 2) Does the school have your major?, 3) What's the campus culture like?. Have you started making a list of schools that interest you?",
  injury:
    "Injuries are tough, but they can make you stronger mentally. Focus on: 1) Following your rehab plan exactly, 2) Supporting teammates from the sideline, 3) Developing other skills (leadership, studying game film). How are you doing emotionally with this?",
  communication:
    "Great communication with coaches is key! Try this: 1) Pick the right time (not right after a game), 2) Be specific about your concerns, 3) Listen to their perspective, 4) Stay respectful even if frustrated. What do you want to talk to them about?",
  goals:
    "Goal setting is powerful! Use this approach: 1) Make your goal specific and measurable, 2) Break it into monthly/weekly steps, 3) Track your progress, 4) Adjust as needed. What goal are you working toward?",
  motivation:
    "Everyone needs motivation sometimes! Remember: 1) Your journey is unique to you, 2) Progress matters more than perfection, 3) Challenges make you stronger. What's one thing you're proud of accomplishing recently?",
  future:
    "Thinking about your future is smart! Consider: 1) What are your interests beyond sports?, 2) What skills do you want to develop?, 3) Who can mentor you?. What excites you most about your future?",
  grades:
    "Academic success is just as important as athletic success! Try: 1) Find a study routine that works with your schedule, 2) Go to office hours and ask professors for help early, 3) Form study groups with teammates or classmates. What subject needs the most attention?",
  team: "Being a good teammate is crucial! Focus on: 1) Encouraging others when they struggle, 2) Showing up with positive energy, 3) Accepting your role while working to improve. How do you contribute to your team?",
  nutrition:
    "Fueling your body right makes a huge difference! Basic tips: 1) Eat protein after workouts, 2) Stay hydrated throughout the day, 3) Don't skip meals, especially breakfast. Are you getting enough fuel for your training?",
  sleep:
    "Sleep is when your body recovers and grows stronger! Aim for: 1) 8-9 hours per night, 2) Consistent bed/wake times, 3) No screens 30 minutes before bed. How many hours are you getting?",
  parents:
    "Family communication can be challenging! Remember: 1) They want what's best for you, 2) Be honest about how you feel, 3) Ask for their support in specific ways. What's the main issue you're navigating?",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let response = FALLBACK_RESPONSES.default

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.match(/\b(confidence|nervous|scared|anxious|afraid)\b/)) {
      response = FALLBACK_RESPONSES.confidence
    } else if (lowerMessage.match(/\b(balance|time management|schedule|busy|overwhelmed)\b/)) {
      response = FALLBACK_RESPONSES.balance
    } else if (lowerMessage.match(/\b(stress|pressure|anxious|worry|worried)\b/)) {
      response = FALLBACK_RESPONSES.stress
    } else if (lowerMessage.match(/\b(leader|leadership|captain|leading)\b/)) {
      response = FALLBACK_RESPONSES.leadership
    } else if (lowerMessage.match(/\b(college|university|recruiting|scholarship)\b/)) {
      response = FALLBACK_RESPONSES.college
    } else if (lowerMessage.match(/\b(injury|injured|hurt|pain|rehab)\b/)) {
      response = FALLBACK_RESPONSES.injury
    } else if (lowerMessage.match(/\b(coach|talk to|communicate|conversation|tell|speak)\b/)) {
      response = FALLBACK_RESPONSES.communication
    } else if (lowerMessage.match(/\b(goal|goals|achieve|success|accomplish)\b/)) {
      response = FALLBACK_RESPONSES.goals
    } else if (lowerMessage.match(/\b(motivat|inspire|encourage|keep going)\b/)) {
      response = FALLBACK_RESPONSES.motivation
    } else if (lowerMessage.match(/\b(future|career|job|work|profession)\b/)) {
      response = FALLBACK_RESPONSES.future
    } else if (lowerMessage.match(/\b(grade|grades|school|homework|test|exam|studying)\b/)) {
      response = FALLBACK_RESPONSES.grades
    } else if (lowerMessage.match(/\b(team|teammate|teammates|chemistry)\b/)) {
      response = FALLBACK_RESPONSES.team
    } else if (lowerMessage.match(/\b(nutrition|eat|eating|food|diet)\b/)) {
      response = FALLBACK_RESPONSES.nutrition
    } else if (lowerMessage.match(/\b(sleep|tired|exhausted|rest)\b/)) {
      response = FALLBACK_RESPONSES.sleep
    } else if (lowerMessage.match(/\b(parent|parents|mom|dad|family)\b/)) {
      response = FALLBACK_RESPONSES.parents
    }

    return NextResponse.json(
      {
        reply: response,
        message: response, // Include both formats for compatibility
        choices: [{ message: { content: response } }],
        fallback: true,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error in fallback chat route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        reply:
          "I'm your AI teammate, here to help with confidence, balance, leadership, and planning your future. What would you like to talk about?",
        fallback: true,
      },
      { status: 200 }, // Return 200 even on error with fallback message
    )
  }
}
