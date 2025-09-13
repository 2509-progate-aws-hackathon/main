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
            agentRuntimeArn: process.env.BEDROCK_AGENT_RUNTIME_ARN ||
                "arn:aws:bedrock-agentcore:us-east-1:083439127731:runtime/my_agent-6qs1kDEQkj",
            qualifier: "DEFAULT",
            payload: Buffer.from(JSON.stringify({ prompt: input_text }), 'utf-8'),
        });

        const response = await client.send(command);
        const textResponse = await response.response?.transformToString() || '';

        // レスポンステキスト抽出
        let finalText = textResponse;
        try {
            const parsed = JSON.parse(textResponse);
            if (parsed?.result) {
                const result = parsed.result;
                if (result?.content && Array.isArray(result.content)) {
                    finalText = result.content
                        .filter((item: any) => item.text)
                        .map((item: any) => item.text)
                        .join('\n');
                } else if (typeof result === 'string') {
                    finalText = result;
                }
            }
        } catch {
            // パースに失敗したら元のテキストを使用
        }

        return NextResponse.json({
            success: true,
            response: finalText,
        });

    } catch (error) {
        console.error('Bedrock API error:', error);
        return NextResponse.json(
            { error: 'Failed to invoke Bedrock agent', details: (error as Error).message },
            { status: 500 }
        );
    }
}
