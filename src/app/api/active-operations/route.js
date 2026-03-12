import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT DISTINCT operation FROM publications WHERE status != 'draft' AND operation IS NOT NULL"
        );
        
        // Extract plain strings from the query result
        const operations = rows.map(r => r.operation);
        
        return NextResponse.json(operations, {
            headers: {
                // Cache this heavily it rarely changes and is public data
                'Cache-Control': 's-maxage=60, stale-while-revalidate=120'
            }
        });
    } catch (err) {
        console.error("Error fetching active operations:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
