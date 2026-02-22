import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db/client";
import { profiles } from "@repo/db/schema";
import { auth } from "@repo/api/auth";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await request.json();
    const { bio, location, website, avatar } = body;

    // Check if profile exists
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    let updatedProfile;

    if (existingProfile) {
      // Update existing profile
      const result = await db
        .update(profiles)
        .set({
          bio,
          location,
          website,
          avatar,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId))
        .returning();
      updatedProfile = result[0];
    } else {
      // Create new profile
      const result = await db
        .insert(profiles)
        .values({
          userId,
          bio,
          location,
          website,
          avatar,
        })
        .returning();
      updatedProfile = result[0];
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
