import { NextRequest, NextResponse } from 'next/server';
import { BedrockAgentCoreClient, InvokeAgentRuntimeCommand } from "@aws-sdk/client-bedrock-agentcore";

export async function POST(request: NextRequest) {
    try {
        const { input_text } = await request.json();

        if (!input_text) {
            return NextResponse.json(
                { error: 'input_text is required' },
                { status: 400 }
            );
        }

        // AWS設定
        const config = {
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        };

        const client = new BedrockAgentCoreClient(config);

        // セッションIDを生成（33文字以上必要）- より確実に33文字以上にする
        const timestamp = Date.now().toString();
        const randomString = Math.random().toString(36).substring(2, 15);
        const runtimeSessionId = process.env.BEDROCK_SESSION_ID ||
            `session_${timestamp}_${randomString}_${Math.random().toString(36).substring(2, 10)}`;

        // セッションIDの長さを確認
        if (runtimeSessionId.length < 33) {
            throw new Error(`Session ID must be at least 33 characters, current length: ${runtimeSessionId.length}`);
        }

        console.log(`Session ID: ${runtimeSessionId} (length: ${runtimeSessionId.length})`);
        console.log(`Agent ARN: ${process.env.BEDROCK_AGENT_RUNTIME_ARN}`);

        const messagePayload = {
            prompt: input_text
        };

        console.log('Payload:', JSON.stringify(messagePayload));

        const input = {
            runtimeSessionId: runtimeSessionId,
            agentRuntimeArn: process.env.BEDROCK_AGENT_RUNTIME_ARN ||
                "arn:aws:bedrock-agentcore:us-east-1:083439127731:runtime/my_agent-6qs1kDEQkj",
            qualifier: process.env.BEDROCK_QUALIFIER || "DEFAULT",
            payload: Buffer.from(JSON.stringify(messagePayload), 'utf-8'),
        };

        const command = new InvokeAgentRuntimeCommand(input);
        const response = await client.send(command);

        let textResponse = '';
        let parsedResponse = null;
        let extractedText = '';

        if (response.response) {
            textResponse = await response.response.transformToString();

            try {
                parsedResponse = JSON.parse(textResponse);

                // Claude APIの応答形式から実際のテキストを抽出
                if (parsedResponse && parsedResponse.result) {
                    const result = parsedResponse.result;

                    // Claude APIの応答形式: { role: "assistant", content: [{ text: "..." }] }
                    if (typeof result === 'object' && result.content && Array.isArray(result.content)) {
                        extractedText = result.content
                            .filter((item: any) => item.text)
                            .map((item: any) => item.text)
                            .join('\n');
                    }
                    // 文字列の場合はそのまま使用
                    else if (typeof result === 'string') {
                        extractedText = result;
                    }
                    // オブジェクトだが上記の形式ではない場合、JSON文字列として表示
                    else {
                        extractedText = JSON.stringify(result, null, 2);
                    }
                } else {
                    extractedText = textResponse;
                }
            } catch (parseError) {
                console.warn('Failed to parse response as JSON:', parseError);
                extractedText = textResponse;
                parsedResponse = { result: textResponse };
            }
        }

        return NextResponse.json({
            success: true,
            response: extractedText || textResponse,
            rawResponse: textResponse,
            parsedResponse: parsedResponse,
            metadata: {
                sessionId: response.mcpSessionId,
                contentType: response.contentType,
                runtimeSessionId: runtimeSessionId,
            },
        });

    } catch (error) {
        console.error('Bedrock API error:', error);

        // より詳細なエラー情報を取得
        let errorDetails = '';
        let statusCode = 500;

        if (error instanceof Error) {
            errorDetails = error.message;
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        // AWS SDKエラーの場合、追加情報を取得
        if (error && typeof error === 'object' && '$metadata' in error) {
            console.error('AWS Error metadata:', error.$metadata);
            console.error('AWS Error fault:', (error as any).$fault);

            // HTTPステータスコードがある場合はそれを使用
            const metadata = error.$metadata as any;
            if (metadata && typeof metadata === 'object' && 'httpStatusCode' in metadata) {
                statusCode = metadata.httpStatusCode;
            }
        }

        // 具体的なエラーメッセージを含めて返す
        return NextResponse.json(
            {
                error: 'Failed to invoke Bedrock agent',
                details: errorDetails,
                statusCode: statusCode,
                debug: process.env.NODE_ENV === 'development' ? {
                    error: error,
                    metadata: error && typeof error === 'object' && '$metadata' in error ? error.$metadata : null,
                    fault: error && typeof error === 'object' && '$fault' in error ? (error as any).$fault : null
                } : undefined
            },
            { status: statusCode === 424 ? 400 : statusCode } // 424エラーは400として扱う
        );
    }
}
