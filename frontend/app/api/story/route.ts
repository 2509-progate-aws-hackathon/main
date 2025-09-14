import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from "@aws-sdk/client-bedrock-agentcore";

export async function POST(request: NextRequest) {
    try {
        const { input_text } = await request.json();

        if (!input_text) {
            return NextResponse.json({ error: 'input_text is required' }, { status: 400 });
        }

        const client = new BedrockAgentCoreClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}_extra`;

        const command = new InvokeAgentRuntimeCommand({
            runtimeSessionId: sessionId,
            agentRuntimeArn: process.env.BEDROCK_AGENT_RUNTIME_ARN_STORY || "",
            qualifier: "DEFAULT",
            payload: Buffer.from(JSON.stringify({ prompt: input_text }), 'utf-8'),
        });

        const response = await client.send(command);
        const textResponse = await response.response?.transformToString() || '';

        // レスポンステキスト抽出
        let parsedData;
        let extractedText = '';

        try {
            parsedData = JSON.parse(textResponse);

            // レスポンス構造に応じてテキストを抽出
            if (parsedData.result && parsedData.result.content && Array.isArray(parsedData.result.content)) {
                extractedText = parsedData.result.content
                    .map((item: any) => item.text)
                    .filter(Boolean)
                    .join('\n');
            }

            return NextResponse.json({
                success: true,
                data: {
                    text: extractedText,
                    raw: parsedData
                }
            });
        } catch {
            // パースに失敗した場合はテキストとして返す
            return NextResponse.json({
                success: true,
                response: textResponse,
            });
        }

    } catch (error) {
        console.error('Bedrock API error:', error);
        return NextResponse.json(
            { error: 'Failed to invoke Bedrock agent', details: (error as Error).message },
            { status: 500 }
        );
    }
}
