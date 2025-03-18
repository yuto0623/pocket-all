import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface FeedbackEmailProps {
	senderEmail: string;
	message: string;
}

export default function FeedbackEmail({
	senderEmail,
	message,
}: FeedbackEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>PocketALLからの新しいフィードバック</Preview>
			<Tailwind>
				<Body className="bg-gray-100 font-sans py-5">
					<Container className="bg-white border border-gray-200 rounded-md mx-auto p-5 max-w-md">
						<Heading className="text-gray-800 text-2xl font-bold my-6 text-center">
							新しいフィードバックが届きました
						</Heading>
						<Text className="text-gray-700 text-base">
							<strong>送信者:</strong> {senderEmail}
						</Text>
						<Hr className="border-gray-200 my-5" />
						<Section className="bg-gray-50 rounded p-4 mt-4">
							<Text className="text-gray-700 text-base whitespace-pre-wrap">
								{message}
							</Text>
						</Section>
						<Text className="text-gray-500 text-sm mt-5 text-center">
							PocketALLのフィードバックフォームから送信されました
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
