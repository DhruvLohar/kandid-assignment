import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { campaign, user, lead, campaignAnalytics } from "@/db/schema"
import { eq, desc, count, sql } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id

    // Get campaign basic data with creator info
    const campaignData = await db
      .select({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        totalLeads: campaign.totalLeads,
        successfulLeads: campaign.successfulLeads,
        responseRate: campaign.responseRate,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        createdBy: campaign.createdBy,
        createdByName: user.name,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      })
      .from(campaign)
      .leftJoin(user, eq(campaign.createdBy, user.id))
      .where(eq(campaign.id, campaignId))
      .limit(1)

    if (!campaignData || campaignData.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Get lead statistics breakdown by status
    const leadStatusStats = await db
      .select({
        status: lead.status,
        count: count(),
      })
      .from(lead)
      .where(eq(lead.campaignId, campaignId))
      .groupBy(lead.status)

    // Get recent leads (latest 10)
    const recentLeads = await db
      .select({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        status: lead.status,
        priority: lead.priority,
        createdAt: lead.createdAt,
      })
      .from(lead)
      .where(eq(lead.campaignId, campaignId))
      .orderBy(desc(lead.createdAt))
      .limit(10)

    // Get campaign analytics (last 30 days)
    const analytics = await db
      .select({
        id: campaignAnalytics.id,
        date: campaignAnalytics.date,
        leadsAdded: campaignAnalytics.leadsAdded,
        leadsContacted: campaignAnalytics.leadsContacted,
        leadsResponded: campaignAnalytics.leadsResponded,
        leadsConverted: campaignAnalytics.leadsConverted,
        emailsSent: campaignAnalytics.emailsSent,
        emailsOpened: campaignAnalytics.emailsOpened,
        emailsClicked: campaignAnalytics.emailsClicked,
        createdAt: campaignAnalytics.createdAt,
      })
      .from(campaignAnalytics)
      .where(eq(campaignAnalytics.campaignId, campaignId))
      .orderBy(desc(campaignAnalytics.date))
      .limit(30)

    // Calculate conversion funnel
    const totalLeadsInCampaign = leadStatusStats.reduce((sum, stat) => sum + stat.count, 0)
    const conversionFunnel = {
      totalLeads: totalLeadsInCampaign,
      contacted: leadStatusStats.find(s => s.status === 'contacted')?.count || 0,
      responded: leadStatusStats.find(s => s.status === 'responded')?.count || 0,
      converted: leadStatusStats.find(s => s.status === 'converted')?.count || 0,
    }

    const campaignInfo = campaignData[0]

    return NextResponse.json({
      campaign: campaignInfo,
      leadStatusStats: leadStatusStats,
      recentLeads: recentLeads,
      analytics: analytics,
      conversionFunnel: conversionFunnel,
      metrics: {
        conversionRate: totalLeadsInCampaign > 0 ? (conversionFunnel.converted / totalLeadsInCampaign) * 100 : 0,
        contactRate: totalLeadsInCampaign > 0 ? (conversionFunnel.contacted / totalLeadsInCampaign) * 100 : 0,
        responseRate: conversionFunnel.contacted > 0 ? (conversionFunnel.responded / conversionFunnel.contacted) * 100 : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching campaign details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
