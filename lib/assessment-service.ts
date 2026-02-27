import { selfEfficacyQuickAssessment } from "./assessments/self-efficacy-quick"
import { supabase } from "./supabase"

// Get all available assessments
export async function getAvailableAssessments() {
  // In a real implementation, this would fetch from a database
  // For now, we'll return our hardcoded assessments
  return [selfEfficacyQuickAssessment]
}

// Get a specific assessment by ID
export async function getAssessmentById(id: string) {
  if (id === "self-efficacy-quick") {
    return selfEfficacyQuickAssessment
  }

  // In a real implementation, this would fetch from a database
  return null
}

// Process assessment responses and generate results
export async function processAssessmentResponses(
  assessmentId: string,
  responses: Record<string, any>,
  userId?: string,
) {
  // Get the assessment
  const assessment = await getAssessmentById(assessmentId)
  if (!assessment) {
    throw new Error("Assessment not found")
  }

  // Initialize scores
  let totalScore = 0
  let maxPossibleScore = 0
  const domainScores: Record<string, { score: number; maxScore: number }> = {}

  // Initialize domain scores
  Object.keys(assessment.domains).forEach((domain) => {
    domainScores[domain] = { score: 0, maxScore: 0 }
  })

  // Process each question response
  assessment.questions.forEach((question) => {
    const response = responses[`question_${question.id}`]
    const domain = question.domain

    if (!response) return // Skip if no response

    if (question.type === "scale") {
      const score = Number.parseInt(response)
      totalScore += score * assessment.scoring.scaleWeight
      maxPossibleScore += 5 * assessment.scoring.scaleWeight // Max scale value is 5

      if (domain) {
        domainScores[domain].score += score
        domainScores[domain].maxScore += 5
      }
    } else if (question.type === "multiple-choice") {
      const option = question.options.find((opt) => opt.id === response)
      if (option && option.score) {
        totalScore += option.score * assessment.scoring.multipleChoiceWeight
        maxPossibleScore += 5 * assessment.scoring.multipleChoiceWeight // Max option score is 5

        if (domain) {
          domainScores[domain].score += option.score
          domainScores[domain].maxScore += 5
        }
      }
    }
    // Open-ended questions don't contribute to the numerical score
    // but are stored for qualitative analysis
  })

  // Normalize total score to 0-100 scale
  const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100)

  // Normalize domain scores to 0-100 scale
  const normalizedDomainScores = Object.entries(domainScores).reduce(
    (acc, [domain, scores]) => {
      if (scores.maxScore > 0) {
        acc[domain] = Math.round((scores.score / scores.maxScore) * 100)
      } else {
        acc[domain] = 0
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Determine overall level
  let overallLevel = ""
  let overallLabel = ""
  for (const range of assessment.interpretation.ranges) {
    if (normalizedScore >= range.min && normalizedScore <= range.max) {
      overallLevel = range.level
      overallLabel = range.label
      break
    }
  }

  // Generate strengths and growth areas based on domain scores
  const strengths: string[] = []
  const growthAreas: string[] = []

  Object.entries(normalizedDomainScores).forEach(([domain, score]) => {
    if (domain === "reflection" || domain === "strengths") return // Skip qualitative domains

    const thresholds = assessment.interpretation.domainThresholds[domain]
    const domainName = assessment.domains[domain]

    if (score >= 80) {
      strengths.push(`Strong ${domainName.toLowerCase()}`)
    } else if (score <= 60) {
      growthAreas.push(`Developing ${domainName.toLowerCase()}`)
    }
  })

  // Get recommendations based on overall level
  const recommendations = assessment.recommendations[overallLevel] || []

  // Create the results object
  const results = {
    assessmentId,
    userId,
    completedAt: new Date().toISOString(),
    overallScore: normalizedScore,
    overallLevel,
    overallLabel,
    domainScores: normalizedDomainScores,
    strengths,
    growthAreas,
    recommendations,
    responses, // Store the original responses
  }

  // Save results to database if userId is provided
  if (userId) {
    try {
      const { error } = await supabase.from("assessment_results").insert([
        {
          user_id: userId,
          assessment_id: assessmentId,
          results: results,
        },
      ])

      if (error) {
        console.error("Error saving assessment results:", error)
      }
    } catch (error) {
      console.error("Error saving assessment results:", error)
    }
  }

  return results
}
