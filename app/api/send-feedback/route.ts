import FeedbackEmail from "@/app/components/Emails/FeedbackEmail";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
	try {
		// リクエストボディを取得
		const body = await request.json();
		const { email, message } = body;

		// 入力検証
		if (!email || !message) {
			return NextResponse.json(
				{ error: "メールアドレスとメッセージは必須です" },
				{ status: 400 },
			);
		}

		// トランスポーターを設定
		const transporter = nodemailer.createTransport({
			service: "gmail", // または他のサービス
			auth: {
				user: process.env.GMAIL_ACCOUNT,
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		});

		// React Emailでメールテンプレートをレンダリング
		const emailHtml = await render(
			FeedbackEmail({
				senderEmail: email,
				message: message,
			}),
		);

		// メールオプションを設定
		const mailOptions = {
			from: process.env.GMAIL_ACCOUNT,
			to: process.env.GMAIL_ACCOUNT,
			subject: "PocketALL フィードバック",
			html: emailHtml,
			text: `送信者: ${email}\n\nメッセージ:\n${message}`,
			replyTo: email,
		};

		// メール送信
		await transporter.sendMail(mailOptions);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("メール送信エラー:", error);
		return NextResponse.json(
			{ error: "メール送信に失敗しました" },
			{ status: 500 },
		);
	}
}
