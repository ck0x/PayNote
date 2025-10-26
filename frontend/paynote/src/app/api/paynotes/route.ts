import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { payNotes } from "@/db/schema";
import { eq, and, or, like, sql } from "drizzle-orm";
import { createProblemDetail } from "../auth/_lib/utils";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";

/**
 * GET /api/paynotes
 * List paynotes with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const chainId = searchParams.get("chainId");
    const address = searchParams.get("address");
    const orgId = searchParams.get("orgId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Build where conditions
    const conditions = [];

    if (chainId) {
      conditions.push(eq(payNotes.chainId, parseInt(chainId, 10)));
    }

    if (orgId) {
      conditions.push(eq(payNotes.orgId, orgId));
    }

    if (status) {
      conditions.push(eq(payNotes.status, status));
    }

    if (address) {
      // Search in sender or recipient wallet IDs
      // Note: This assumes wallet IDs might contain addresses
      conditions.push(
        or(
          like(payNotes.senderWalletId, `%${address}%`),
          like(payNotes.recipientWalletId, `%${address}%`)
        )
      );
    }

    if (search && search.trim()) {
      // Search across multiple fields
      const searchTerm = `%${search.trim()}%`;
      conditions.push(
        or(
          like(payNotes.txHash, searchTerm),
          like(payNotes.payReference, searchTerm),
          sql`CAST(${payNotes.senderWalletId} AS TEXT) LIKE ${searchTerm}`,
          sql`CAST(${payNotes.recipientWalletId} AS TEXT) LIKE ${searchTerm}`
        )
      );
    }

    // Query the database
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select()
      .from(payNotes)
      .where(whereClause)
      .limit(limit)
      .orderBy(sql`${payNotes.timestamp} DESC`);

    // Transform to PayNoteExpanded format
    // Note: For now, we're not including related data (sender, recipient, categories, etc.)
    // Those can be added later with proper joins
    const expanded: PayNoteExpanded[] = results.map((note) => ({
      payNoteId: note.payNoteId,
      txHash: note.txHash,
      chainId: note.chainId,
      senderWalletId: note.senderWalletId,
      recipientWalletId: note.recipientWalletId,
      amountWei: note.amountWei,
      payReference: note.payReference,
      fiatValueUsd: note.fiatValueUsd,
      timestamp: note.timestamp,
      status: note.status as "Settled" | "Pending" | "Failed",
      orgId: note.orgId,
    }));

    return NextResponse.json(expanded);
  } catch (error) {
    console.error("GET /api/paynotes error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to list paynotes"
      ),
      { status: 500 }
    );
  }
}
