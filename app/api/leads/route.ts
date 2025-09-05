import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { lead, campaign, user } from "@/db/schema"
import { eq, ilike, and, or, desc, asc, sql, count } from "drizzle-orm"

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
    const campaignId = searchParams.get("campaignId") || ""
    const assignedTo = searchParams.get("assignedTo") || ""
    const priority = searchParams.get("priority") || ""
    const leadSource = searchParams.get("leadSource") || ""
    
    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build where conditions
    const whereConditions = []

    if (search) {
      whereConditions.push(
        or(
          ilike(lead.name, `%${search}%`),
          ilike(lead.email, `%${search}%`),
          ilike(lead.company, `%${search}%`)
        )
      )
    }

    if (status) {
      whereConditions.push(eq(lead.status, status as any))
    }

    if (campaignId) {
      whereConditions.push(eq(lead.campaignId, campaignId))
    }

    if (assignedTo) {
      whereConditions.push(eq(lead.assignedTo, assignedTo))
    }

    if (priority) {
      whereConditions.push(eq(lead.priority, priority))
    }

    if (leadSource) {
      whereConditions.push(eq(lead.leadSource, leadSource))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(lead)
      .leftJoin(campaign, eq(lead.campaignId, campaign.id))
      .where(whereClause)

    const totalCount = totalCountResult[0]?.count || 0

    // Get leads with campaign and assigned user info
    const sortFieldMap = {
      'name': lead.name,
      'email': lead.email,
      'company': lead.company,
      'status': lead.status,
      'priority': lead.priority,
      'leadSource': lead.leadSource,
      'createdAt': lead.createdAt,
      'updatedAt': lead.updatedAt,
    } as const
    
    const sortColumn = sortFieldMap[sortBy as keyof typeof sortFieldMap] || lead.createdAt
    
    const leads = await db
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
      .where(whereClause)
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(limit)
      .offset(offset)

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: leads,
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
        campaignId,
        assignedTo,
        priority,
        leadSource,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}