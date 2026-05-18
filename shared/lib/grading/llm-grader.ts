import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
});

export interface GradingResult {
  score: number;
  feedback: string;
  analysis: string;
}

export async function gradeWithLLM(
  studentAnswer: string,
  rubricCriteria: { description: string; weight: number }[],
  maxScore: number,
  assignmentTitle: string,
): Promise<GradingResult | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;

  const model = process.env.OPENROUTER_MODEL ?? 'nvidia/nemotron-3-super-120b-a12b:free';

  const rubricText = rubricCriteria
    .map((c, i) => `${i + 1}. ${c.description} (가중치: ${c.weight}%)`)
    .join('\n');

  const prompt = `당신은 대학교 과제 채점 도우미입니다. 아래 루브릭에 따라 학생의 답안을 채점하세요.

[과제]: ${assignmentTitle}
[만점]: ${maxScore}점
[채점 기준]:
${rubricText || '일반적인 학술 기준으로 평가하세요.'}

[학생 답안]:
${studentAnswer.slice(0, 10000)}

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{"score": 숫자(0~${maxScore}), "feedback": "학생에게 전달할 피드백", "analysis": "강점과 개선점 분석"}`;

  try {
    const { text } = await generateText({
      model: openrouter(model),
      prompt,
      maxTokens: 1000,
    });

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.min(Math.max(0, Number(parsed.score) || 0), maxScore),
      feedback: String(parsed.feedback ?? ''),
      analysis: String(parsed.analysis ?? ''),
    };
  } catch {
    return null;
  }
}
