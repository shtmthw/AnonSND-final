import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import OpenAI from "openai";
import DBconnect from '@/lib/DBconnect';

//doesnt work mf needs money ass shit


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(request: Request) {
    await DBconnect()
    try {
        const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/search';
        const API_KEY = process.env.DEEPSEEK_API_KEY;

        // Make sure API_KEY is available
        if (!API_KEY) {
            return NextResponse.json({
                success: false,
                msg: "API Key is missing"
            }, { status: 400 });
        }


        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: process.env.DEEPSEEK_API_KEY
        });


        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "deepseek-chat",
        });
        console.log(completion.choices[0].message.content)
        return NextResponse.json({
            success : false,
            data : (completion.choices[0].message.content)
        })



    } catch (err) {
        const error = err as Error
        console.error('Error in handler:', error);

        return NextResponse.json({
            success: false,
            msg: `Internal server error: ${error.message}`,
        }, { status: 500 });
    }
}
