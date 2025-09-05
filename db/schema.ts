import { pgTable, text, timestamp, boolean, integer, decimal, pgEnum } from "drizzle-orm/pg-core";

// Enums for status fields
export const campaignStatusEnum = pgEnum("campaign_status", [
    "draft",
    "active", 
    "paused",
    "completed"
]);

export const leadStatusEnum = pgEnum("lead_status", [
    "pending",
    "contacted", 
    "responded",
    "converted"
]);

export const interactionTypeEnum = pgEnum("interaction_type", [
    "email",
    "call",
    "message",
    "meeting",
    "note"
]);

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// Campaigns Table
export const campaign = pgTable("campaign", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    status: campaignStatusEnum("status").default("draft").notNull(),
    totalLeads: integer("total_leads").default(0).notNull(),
    successfulLeads: integer("successful_leads").default(0).notNull(),
    responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("0.00"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    createdBy: text("created_by")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// Leads Table
export const lead = pgTable("lead", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    position: text("position"),
    status: leadStatusEnum("status").default("pending").notNull(),
    campaignId: text("campaign_id")
        .notNull()
        .references(() => campaign.id, { onDelete: "cascade" }),
    lastContactDate: timestamp("last_contact_date"),
    assignedTo: text("assigned_to")
        .references(() => user.id, { onDelete: "set null" }),
    notes: text("notes"),
    leadSource: text("lead_source"), // e.g., "LinkedIn", "Website", "Referral"
    priority: text("priority").default("medium"), // low, medium, high
    tags: text("tags"), // JSON array of tags
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// Lead Interactions Table (for tracking communication history)
export const leadInteraction = pgTable("lead_interaction", {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
        .notNull()
        .references(() => lead.id, { onDelete: "cascade" }),
    type: interactionTypeEnum("type").notNull(),
    subject: text("subject"),
    message: text("message"),
    scheduledAt: timestamp("scheduled_at"),
    completedAt: timestamp("completed_at"),
    createdBy: text("created_by")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

// Campaign Analytics Table (for detailed metrics)
export const campaignAnalytics = pgTable("campaign_analytics", {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
        .notNull()
        .references(() => campaign.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    leadsAdded: integer("leads_added").default(0).notNull(),
    leadsContacted: integer("leads_contacted").default(0).notNull(),
    leadsResponded: integer("leads_responded").default(0).notNull(),
    leadsConverted: integer("leads_converted").default(0).notNull(),
    emailsSent: integer("emails_sent").default(0).notNull(),
    emailsOpened: integer("emails_opened").default(0).notNull(),
    emailsClicked: integer("emails_clicked").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
