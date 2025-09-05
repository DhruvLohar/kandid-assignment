import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { campaign, user, lead } from "@/db/schema"
import { eq, ilike, and, desc, asc, count, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Filter parameters
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const createdBy = searchParams.get("createdBy") || ""
    
    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build where conditions
    const whereConditions = []

    if (search) {
      whereConditions.push(
        ilike(campaign.name, `%${search}%`)
      )
    }

    if (status) {
      whereConditions.push(eq(campaign.status, status as any))
    }

    if (createdBy) {
      whereConditions.push(eq(campaign.createdBy, createdBy))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(campaign)
      .where(whereClause)

    const totalCount = totalCountResult[0]?.count || 0

    // Get campaigns with creator info and lead stats
    const sortFieldMap = {
      'name': campaign.name,
      'status': campaign.status,
      'totalLeads': campaign.totalLeads,
      'successfulLeads': campaign.successfulLeads,
      'responseRate': campaign.responseRate,
      'startDate': campaign.startDate,
      'endDate': campaign.endDate,
      'createdAt': campaign.createdAt,
      'updatedAt': campaign.updatedAt,
    } as const
    
    const sortColumn = sortFieldMap[sortBy as keyof typeof sortFieldMap] || campaign.createdAt

    const campaigns = await db
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
      .where(whereClause)
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(limit)
      .offset(offset)

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Get summary statistics
    const summaryStats = await db
      .select({
        totalCampaigns: count(),
        activeCampaigns: sql<number>`count(case when ${campaign.status} = 'active' then 1 end)`,
        totalLeadsAcrossAll: sql<number>`sum(${campaign.totalLeads})`,
        totalSuccessfulLeads: sql<number>`sum(${campaign.successfulLeads})`,
        avgResponseRate: sql<number>`avg(${campaign.responseRate})`,
      })
      .from(campaign)
      .where(whereClause)

    return NextResponse.json({
      data: campaigns,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      filters: {
        search,
        status,
        createdBy,
        sortBy,
        sortOrder,
      },
      summary: summaryStats[0] || {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalLeadsAcrossAll: 0,
        totalSuccessfulLeads: 0,
        avgResponseRate: 0,
      },
    })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
