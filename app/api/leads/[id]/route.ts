import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { lead, campaign, user, leadInteraction } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id

    // Get lead basic data with campaign and assigned user info
    const leadData = await db
      .select({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        status: lead.status,
        campaignId: lead.campaignId,
        campaignName: campaign.name,
        lastContactDate: lead.lastContactDate,
        assignedTo: lead.assignedTo,
        assignedUserName: user.name,
        notes: lead.notes,
        leadSource: lead.leadSource,
        priority: lead.priority,
        tags: lead.tags,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      })
      .from(lead)
      .leftJoin(campaign, eq(lead.campaignId, campaign.id))
      .leftJoin(user, eq(lead.assignedTo, user.id))
      .where(eq(lead.id, leadId))
      .limit(1)

    if (!leadData || leadData.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Get lead interactions with user info
    const interactions = await db
      .select({
        id: leadInteraction.id,
        type: leadInteraction.type,
        subject: leadInteraction.subject,
        message: leadInteraction.message,
        scheduledAt: leadInteraction.scheduledAt,
        completedAt: leadInteraction.completedAt,
        createdBy: leadInteraction.createdBy,
        createdByName: user.name,
        createdAt: leadInteraction.createdAt,
        updatedAt: leadInteraction.updatedAt,
      })
      .from(leadInteraction)
      .leftJoin(user, eq(leadInteraction.createdBy, user.id))
      .where(eq(leadInteraction.leadId, leadId))
      .orderBy(desc(leadInteraction.createdAt))

    const leadInfo = leadData[0]

    // Parse tags if they exist
    let parsedTags = []
    if (leadInfo.tags) {
      try {
        parsedTags = JSON.parse(leadInfo.tags)
      } catch (e) {
        parsedTags = []
      }
    }

    return NextResponse.json({
      lead: {
        ...leadInfo,
        tags: parsedTags,
      },
      interactions: interactions,
    })
  } catch (error) {
    console.error("Error fetching lead details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
