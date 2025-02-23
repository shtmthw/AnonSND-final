import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as single string.Each qst should be separated by '|'.These qst are for an anonymous social messaging platform, like Qooh.me and should be suitable for a diverse audience.Avoid sensetive content, universal themes that encourage friendly convos should be at 100 % priority, i.e. 'If you could live as a footballer for a day who would that be ?|| What would be your everyday snack when on a diet ? || What dog breed is the most friendliest ?', ensure this at all cost, or our webapp might get called out for weird suggestions."

        const result = streamText({
            model: openai("gpt-3.5-turbo"),
            prompt,
            maxTokens: 400
        });

        return result.toDataStreamResponse();

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error
            return NextResponse.json({
                name,
                headers,
                status,
                message
            }, { status })
        } else {
            console.error('An unexpected Error occured', error)
            throw error
        }
    }

}

