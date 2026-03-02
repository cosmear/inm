import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DB_HOST: process.env.DB_HOST || null,
    DB_PORT: process.env.DB_PORT || null,
    DB_NAME: process.env.DB_NAME || null,
    DB_USER: process.env.DB_USER || null,
    HAS_DB_PASSWORD: !!process.env.DB_PASSWORD,
    HAS_JWT_SECRET: !!process.env.JWT_SECRET,
  });
}