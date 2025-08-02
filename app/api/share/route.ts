import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { shareLinks } from "@/db/schema";

export async function POST(req: NextRequest) {
	try {
		const { fileId, permission, email } = await req.json();

		if (!fileId || !permission) {
			return NextResponse.json(
				{ error: "Missing fileId or permission" },
				{ status: 400 },
			);
		}

		const token = uuidv4();

		const expiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000,
		).toISOString();

		// Ulož link do DB
		await db.insert(shareLinks).values({
			token,
			fileId,
			permission,
			expiresAt,
		});

		const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/share/${token}`;

		// Ak je email, pošli notifikáciu
		if (email) {
			// Vytvor transporter podľa svojho SMTP nastavenia
			const transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT),
				secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			});

			// Posli email
			await transporter.sendMail({
				from: `"Box Drop" <${process.env.SMTP_FROM}>`,
				to: email,
				subject: "You have been granted access to a file",
				text: `You can access the file here: ${shareUrl}`,
				html: `<p>You can access the file <a href="${shareUrl}">here</a>.</p>`,
			});
		}

		return NextResponse.json({ shareUrl });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to generate share link" },
			{ status: 500 },
		);
	}
}
