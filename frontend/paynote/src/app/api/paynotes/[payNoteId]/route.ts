import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { payNotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createProblemDetail } from "../../auth/_lib/utils";
import type { PayNoteExpanded } from "@/types/interfaces/PayNoteExpanded";

/**
 * GET /api/paynotes/[payNoteId]
 * Get a single paynote by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ payNoteId: string }> }
) {
  try {
    const { payNoteId } = await params;

    const result = await db
      .select()
      .from(payNotes)
      .where(eq(payNotes.payNoteId, payNoteId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "PayNote not found"),
        { status: 404 }
      );
    }

    const note = result[0];

    const expanded: PayNoteExpanded = {
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
    };

    return NextResponse.json(expanded);
  } catch (error) {
    console.error("GET /api/paynotes/[payNoteId] error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to get paynote"
      ),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/paynotes/[payNoteId]
 * Update payment reference
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ payNoteId: string }> }
) {
  try {
    const { payNoteId } = await params;
    const body = await request.json();
    const { payReference } = body;

    // Validate that payReference exists in body
    if (!("payReference" in body)) {
      return NextResponse.json(
        createProblemDetail(
          400,
          "Bad Request",
          "payReference field is required"
        ),
        { status: 400 }
      );
    }

    const result = await db
      .update(payNotes)
      .set({
        payReference: payReference,
        updatedAt: new Date(),
      })
      .where(eq(payNotes.payNoteId, payNoteId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        createProblemDetail(404, "Not Found", "PayNote not found"),
        { status: 404 }
      );
    }

    const note = result[0];

    // Transform to PayNoteExpanded format
    const expanded: PayNoteExpanded = {
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
    };

    return NextResponse.json(expanded);
  } catch (error) {
    console.error("PATCH /api/paynotes/[payNoteId] error:", error);
    return NextResponse.json(
      createProblemDetail(
        500,
        "Internal Server Error",
        "Failed to update paynote"
      ),
      { status: 500 }
    );
  }
}
