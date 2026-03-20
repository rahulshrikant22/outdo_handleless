// ============================================================
// OutDo CRM Module — Phase 2 Data Layer
// Correlated: CRM Leads → Accounts → Follow-ups → Territories
// 4 Databases: Dealer, Factory, Architect, Organic
// ============================================================

export type CRMDatabase = "dealer" | "factory" | "architect" | "organic";
export type LeadQuality = "cold" | "warm" | "hot" | "bad" | "account";
export type SampleStatus = "pending" | "provided" | "not_applicable";
export type CRMAccountType = "dealer" | "factory" | "architect";
export type AccountClassification =
  | "dealer_with_display"
  | "dealer_with_sample"
  | "dealer_without_display"
  | "factory_partner"
  | "factory_exclusive"
  | "architect_associate"
  | "architect_premium";
export type AccountHealth = "excellent" | "good" | "average" | "at_risk" | "churned";

// ---------- Territories ----------
export interface Territory {
  zone: string;
  territory: string;
  states: string[];
  cities: string[];
}

export const territories: Territory[] = [
  { zone: "West", territory: "West-1", states: ["Maharashtra", "Goa"], cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Panaji"] },
  { zone: "West", territory: "West-2", states: ["Gujarat", "Rajasthan"], cities: ["Ahmedabad", "Surat", "Rajkot", "Jaipur", "Udaipur"] },
  { zone: "North", territory: "North-1", states: ["Delhi", "Haryana", "Punjab"], cities: ["Delhi", "Gurugram", "Chandigarh", "Ludhiana", "Noida"] },
  { zone: "North", territory: "North-2", states: ["Uttar Pradesh", "Madhya Pradesh"], cities: ["Lucknow", "Indore", "Bhopal", "Kanpur"] },
  { zone: "South", territory: "South-1", states: ["Karnataka", "Kerala"], cities: ["Bangalore", "Mysore", "Kochi", "Mangalore"] },
  { zone: "South", territory: "South-2", states: ["Tamil Nadu", "Andhra Pradesh", "Telangana"], cities: ["Chennai", "Coimbatore", "Hyderabad", "Vizag", "Vijayawada"] },
  { zone: "East", territory: "East-1", states: ["West Bengal", "Odisha", "Bihar"], cities: ["Kolkata", "Bhubaneswar", "Patna"] },
];

export const allZones = [...new Set(territories.map((t) => t.zone))];
export const allTerritoryNames = territories.map((t) => t.territory);
export const allStates = [...new Set(territories.flatMap((t) => t.states))];
export const allCities = [...new Set(territories.flatMap((t) => t.cities))];

export function getTerritory(city: string): Territory | undefined {
  return territories.find((t) => t.cities.includes(city));
}

// ---------- Internal Salespeople ----------
export interface CRMSalesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  territory: string;
  zone: string;
  leadsAssigned: number;
  accountsConverted: number;
}

export const crmSalespeople: CRMSalesperson[] = [
  { id: "SP01", name: "Rajesh Kumar", email: "rajesh@outdo.in", phone: "+91-9876543210", city: "Mumbai", territory: "West-1", zone: "West", leadsAssigned: 8, accountsConverted: 3 },
  { id: "SP02", name: "Priya Sharma", email: "priya@outdo.in", phone: "+91-9876543220", city: "Delhi", territory: "North-1", zone: "North", leadsAssigned: 6, accountsConverted: 2 },
  { id: "SP03", name: "Amit Patel", email: "amit.sp@outdo.in", phone: "+91-9876543230", city: "Ahmedabad", territory: "West-2", zone: "West", leadsAssigned: 5, accountsConverted: 2 },
  { id: "SP04", name: "Sneha Reddy", email: "sneha.sp@outdo.in", phone: "+91-9876543240", city: "Hyderabad", territory: "South-2", zone: "South", leadsAssigned: 6, accountsConverted: 2 },
  { id: "SP05", name: "Vikram Menon", email: "vikram.sp@outdo.in", phone: "+91-9876543250", city: "Bangalore", territory: "South-1", zone: "South", leadsAssigned: 4, accountsConverted: 1 },
];

// ---------- CRM Leads (22 leads across 4 databases) ----------
export interface CRMLead {
  id: string;
  database: CRMDatabase;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  territory: string;
  zone: string;
  source: string;
  assignedUserId: string;
  assignedUserName: string;
  quality: LeadQuality;
  sampleStatus: SampleStatus;
  lastFollowUp: string | null;
  nextFollowUp: string | null;
  createdAt: string;
  conversionDate: string | null;
  convertedBy: string | null;
  daysToConvert: number | null;
  convertedAccountId: string | null;
  lostReason: string | null;
  lostDate: string | null;
  notes: string;
  transferredToPartner: string | null;
  followUpHistory: FollowUpEntry[];
}

export interface FollowUpEntry {
  id: string;
  date: string;
  type: "call" | "email" | "meeting" | "whatsapp" | "visit";
  notes: string;
  outcome: string;
  nextAction: string;
  updatedBy: string;
}

// Lead Sources
export const leadSources = [
  "Website", "Exhibition", "Referral", "Social Media", "Cold Call",
  "Google Ads", "IndiaMart", "Walk-in", "Partner Referral", "Architect Referral"
];

export const lostReasons = [
  "Budget constraints", "Went with competitor", "Not interested", "Project cancelled",
  "No response", "Bad timing", "Quality concerns", "Price too high", "Location issue"
];

export const crmLeads: CRMLead[] = [
  // ===== DEALER POSSIBILITY (6) =====
  { id: "CL001", database: "dealer", businessName: "Rajkot Kitchen Gallery", contactPerson: "Mahesh Solanki", mobile: "+91-9898123001", email: "mahesh@rajkotkitchen.in", city: "Rajkot", state: "Gujarat", territory: "West-2", zone: "West", source: "Exhibition", assignedUserId: "SP03", assignedUserName: "Amit Patel", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-08", nextFollowUp: "2026-03-18", createdAt: "2026-01-15", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Met at AhmedabadBuild Expo. Interested in handleless range for showroom.", transferredToPartner: null, followUpHistory: [
    { id: "FU001", date: "2026-01-20", type: "call", notes: "Initial follow-up call. Discussed product range.", outcome: "Interested, wants samples", nextAction: "Send catalog and price list", updatedBy: "Amit Patel" },
    { id: "FU002", date: "2026-02-10", type: "email", notes: "Sent digital catalog and dealer program details.", outcome: "Acknowledged, reviewing", nextAction: "Follow up in 2 weeks", updatedBy: "Amit Patel" },
    { id: "FU003", date: "2026-03-08", type: "call", notes: "Discussed dealer margins and display requirements.", outcome: "Positive, wants to visit factory", nextAction: "Schedule factory visit", updatedBy: "Amit Patel" },
  ]},
  { id: "CL002", database: "dealer", businessName: "Surat Modular Kitchen Hub", contactPerson: "Ketan Desai", mobile: "+91-9898123002", email: "ketan@suratkitchen.in", city: "Surat", state: "Gujarat", territory: "West-2", zone: "West", source: "Google Ads", assignedUserId: "SP03", assignedUserName: "Amit Patel", quality: "hot", sampleStatus: "provided", lastFollowUp: "2026-03-12", nextFollowUp: "2026-03-17", createdAt: "2025-12-20", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "High-volume dealer in Surat. Already has 3 kitchen showrooms.", transferredToPartner: null, followUpHistory: [
    { id: "FU004", date: "2026-01-05", type: "meeting", notes: "Showroom visit. Impressed with product quality.", outcome: "Wants to onboard as dealer", nextAction: "Send dealer agreement draft", updatedBy: "Amit Patel" },
    { id: "FU005", date: "2026-02-15", type: "email", notes: "Sent dealer agreement. Discussing terms.", outcome: "Reviewing agreement", nextAction: "Follow up on agreement", updatedBy: "Amit Patel" },
    { id: "FU006", date: "2026-03-12", type: "call", notes: "Agreement review done. Minor clarifications needed.", outcome: "Ready to sign", nextAction: "Schedule signing meeting", updatedBy: "Amit Patel" },
  ]},
  { id: "CL003", database: "dealer", businessName: "Jaipur Home Décor", contactPerson: "Rakesh Agarwal", mobile: "+91-9898123003", email: "rakesh@jaipurhomedecor.in", city: "Jaipur", state: "Rajasthan", territory: "West-2", zone: "West", source: "Referral", assignedUserId: "SP03", assignedUserName: "Amit Patel", quality: "cold", sampleStatus: "pending", lastFollowUp: "2026-02-20", nextFollowUp: "2026-03-25", createdAt: "2026-02-10", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Referred by existing dealer. Exploring handleless concept.", transferredToPartner: null, followUpHistory: [
    { id: "FU007", date: "2026-02-20", type: "call", notes: "Introduction call. Explained product range.", outcome: "Mildly interested, needs time", nextAction: "Follow up in March", updatedBy: "Amit Patel" },
  ]},
  { id: "CL004", database: "dealer", businessName: "Indore Kitchen World", contactPerson: "Sanjay Tiwari", mobile: "+91-9898123004", email: "sanjay@indorekitchen.in", city: "Indore", state: "Madhya Pradesh", territory: "North-2", zone: "North", source: "IndiaMart", assignedUserId: "SP02", assignedUserName: "Priya Sharma", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-05", nextFollowUp: "2026-03-20", createdAt: "2026-01-08", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Found us on IndiaMart. Looking for modern kitchen solutions.", transferredToPartner: null, followUpHistory: [
    { id: "FU008", date: "2026-01-15", type: "call", notes: "Discussed product line and pricing.", outcome: "Interested in samples", nextAction: "Ship sample kit", updatedBy: "Priya Sharma" },
    { id: "FU009", date: "2026-03-05", type: "whatsapp", notes: "Shared new product images. Asked about sample kit status.", outcome: "Sample kit being shipped", nextAction: "Confirm sample delivery", updatedBy: "Priya Sharma" },
  ]},
  { id: "CL005", database: "dealer", businessName: "Ludhiana Wood Works", contactPerson: "Gurpreet Singh", mobile: "+91-9898123005", email: "gurpreet@ludhianaww.in", city: "Ludhiana", state: "Punjab", territory: "North-1", zone: "North", source: "Cold Call", assignedUserId: "SP02", assignedUserName: "Priya Sharma", quality: "bad", sampleStatus: "pending", lastFollowUp: "2026-02-28", nextFollowUp: null, createdAt: "2026-01-05", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: "Budget constraints", lostDate: "2026-02-28", notes: "Traditional furniture shop. Not ready for premium segment.", transferredToPartner: null, followUpHistory: [
    { id: "FU010", date: "2026-01-12", type: "call", notes: "Cold call introduction. Some interest.", outcome: "Wants pricing details", nextAction: "Send price list", updatedBy: "Priya Sharma" },
    { id: "FU011", date: "2026-02-28", type: "call", notes: "Called to follow up. Says pricing is too high for their market.", outcome: "Not feasible - marked bad", nextAction: "None", updatedBy: "Priya Sharma" },
  ]},
  { id: "CL006", database: "dealer", businessName: "Nagpur Modern Interiors", contactPerson: "Rahul Deshpande", mobile: "+91-9898123006", email: "rahul@nagpurmodern.in", city: "Nagpur", state: "Maharashtra", territory: "West-1", zone: "West", source: "Exhibition", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", quality: "account", sampleStatus: "provided", lastFollowUp: "2026-02-15", nextFollowUp: null, createdAt: "2025-11-10", conversionDate: "2025-12-28", convertedBy: "Rajesh Kumar", daysToConvert: 48, convertedAccountId: "CA001", lostReason: null, lostDate: null, notes: "Converted to dealer account. Premium showroom in Nagpur.", transferredToPartner: null, followUpHistory: [
    { id: "FU012", date: "2025-11-18", type: "meeting", notes: "Met at Mumbai expo. Very interested.", outcome: "Wants to visit factory", nextAction: "Arrange factory visit", updatedBy: "Rajesh Kumar" },
    { id: "FU013", date: "2025-12-05", type: "visit", notes: "Factory visit completed. Loved the product.", outcome: "Ready to sign up", nextAction: "Send dealer agreement", updatedBy: "Rajesh Kumar" },
    { id: "FU014", date: "2025-12-28", type: "meeting", notes: "Agreement signed. Onboarded as dealer.", outcome: "Converted to account", nextAction: "Setup account and ship display", updatedBy: "Rajesh Kumar" },
  ]},

  // ===== FACTORY POSSIBILITY (5) =====
  { id: "CL007", database: "factory", businessName: "Chennai Wood Factory", contactPerson: "Ramesh Iyer", mobile: "+91-9898123007", email: "ramesh@chennaiwf.in", city: "Chennai", state: "Tamil Nadu", territory: "South-2", zone: "South", source: "IndiaMart", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-10", nextFollowUp: "2026-03-22", createdAt: "2026-01-20", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "MDF processing facility. Interested in manufacturing partnership.", transferredToPartner: null, followUpHistory: [
    { id: "FU015", date: "2026-02-05", type: "call", notes: "Discussed manufacturing capabilities.", outcome: "Has CNC machines, interested", nextAction: "Share technical specs", updatedBy: "Sneha Reddy" },
    { id: "FU016", date: "2026-03-10", type: "email", notes: "Sent technical requirements doc.", outcome: "Reviewing specs", nextAction: "Schedule factory audit", updatedBy: "Sneha Reddy" },
  ]},
  { id: "CL008", database: "factory", businessName: "Bangalore Panel Works", contactPerson: "Suresh Gowda", mobile: "+91-9898123008", email: "suresh@bangalorepanel.in", city: "Bangalore", state: "Karnataka", territory: "South-1", zone: "South", source: "Partner Referral", assignedUserId: "SP05", assignedUserName: "Vikram Menon", quality: "hot", sampleStatus: "provided", lastFollowUp: "2026-03-14", nextFollowUp: "2026-03-18", createdAt: "2025-12-15", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Well-equipped factory with CNC and edge banding. Ready for trial production.", transferredToPartner: null, followUpHistory: [
    { id: "FU017", date: "2026-01-10", type: "visit", notes: "Factory audit completed. Excellent infrastructure.", outcome: "Passed audit, ready for trial", nextAction: "Send trial order specs", updatedBy: "Vikram Menon" },
    { id: "FU018", date: "2026-02-20", type: "meeting", notes: "Trial production discussion. Agreed on terms.", outcome: "Trial batch approved", nextAction: "Ship raw materials for trial", updatedBy: "Vikram Menon" },
    { id: "FU019", date: "2026-03-14", type: "call", notes: "Trial batch quality check pending.", outcome: "Waiting for QC results", nextAction: "Visit for QC review", updatedBy: "Vikram Menon" },
  ]},
  { id: "CL009", database: "factory", businessName: "Coimbatore MDF Solutions", contactPerson: "Murali Krishnan", mobile: "+91-9898123009", email: "murali@coimbatoremdf.in", city: "Coimbatore", state: "Tamil Nadu", territory: "South-2", zone: "South", source: "Exhibition", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", quality: "cold", sampleStatus: "pending", lastFollowUp: "2026-02-25", nextFollowUp: "2026-04-01", createdAt: "2026-02-15", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Small-scale MDF unit. Needs capacity upgrade for our requirements.", transferredToPartner: null, followUpHistory: [
    { id: "FU020", date: "2026-02-25", type: "call", notes: "Intro call. Interested but capacity is limited.", outcome: "Needs investment for upgrade", nextAction: "Revisit in Q2", updatedBy: "Sneha Reddy" },
  ]},
  { id: "CL010", database: "factory", businessName: "Vizag Laminates & Boards", contactPerson: "Ravi Prasad", mobile: "+91-9898123010", email: "ravi@vizaglam.in", city: "Vizag", state: "Andhra Pradesh", territory: "South-2", zone: "South", source: "Website", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-06", nextFollowUp: "2026-03-21", createdAt: "2026-01-25", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Laminate and board manufacturer. Good potential for panel processing.", transferredToPartner: null, followUpHistory: [
    { id: "FU021", date: "2026-02-10", type: "call", notes: "Discussed processing capabilities.", outcome: "Can handle volume orders", nextAction: "Send sample specs", updatedBy: "Sneha Reddy" },
    { id: "FU022", date: "2026-03-06", type: "email", notes: "Shared sample specifications.", outcome: "Working on trial samples", nextAction: "Review trial samples", updatedBy: "Sneha Reddy" },
  ]},
  { id: "CL011", database: "factory", businessName: "Mysore Woodcraft Industries", contactPerson: "Prakash Hegde", mobile: "+91-9898123011", email: "prakash@mysorewc.in", city: "Mysore", state: "Karnataka", territory: "South-1", zone: "South", source: "Referral", assignedUserId: "SP05", assignedUserName: "Vikram Menon", quality: "account", sampleStatus: "provided", lastFollowUp: "2026-01-20", nextFollowUp: null, createdAt: "2025-10-15", conversionDate: "2025-12-10", convertedBy: "Vikram Menon", daysToConvert: 56, convertedAccountId: "CA002", lostReason: null, lostDate: null, notes: "Converted to factory partner. High-quality production facility.", transferredToPartner: null, followUpHistory: [
    { id: "FU023", date: "2025-11-01", type: "visit", notes: "Factory audit. Excellent setup.", outcome: "Approved for partnership", nextAction: "Draft factory agreement", updatedBy: "Vikram Menon" },
    { id: "FU024", date: "2025-12-10", type: "meeting", notes: "Agreement signed. Onboarded.", outcome: "Converted to factory partner", nextAction: "Begin production orders", updatedBy: "Vikram Menon" },
  ]},

  // ===== ARCHITECT/INTERIOR POSSIBILITY (6) =====
  { id: "CL012", database: "architect", businessName: "Studio Arc Design", contactPerson: "Arun Kapoor", mobile: "+91-9898123012", email: "arun@studioarc.in", city: "Delhi", state: "Delhi", territory: "North-1", zone: "North", source: "Architect Referral", assignedUserId: "SP02", assignedUserName: "Priya Sharma", quality: "hot", sampleStatus: "provided", lastFollowUp: "2026-03-13", nextFollowUp: "2026-03-19", createdAt: "2025-12-01", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Top interior firm in Delhi. 5+ ongoing luxury projects.", transferredToPartner: null, followUpHistory: [
    { id: "FU025", date: "2025-12-15", type: "meeting", notes: "Office visit. Showed full product range.", outcome: "Very impressed, wants to specify in projects", nextAction: "Send architect program details", updatedBy: "Priya Sharma" },
    { id: "FU026", date: "2026-01-20", type: "email", notes: "Sent architect partnership program details.", outcome: "Reviewing, positive signals", nextAction: "Follow up in Feb", updatedBy: "Priya Sharma" },
    { id: "FU027", date: "2026-03-13", type: "meeting", notes: "Discussed first project specification.", outcome: "Ready to specify for 2 projects", nextAction: "Send specification sheets", updatedBy: "Priya Sharma" },
  ]},
  { id: "CL013", database: "architect", businessName: "Pune Design Lab", contactPerson: "Meera Joshi", mobile: "+91-9898123013", email: "meera@punedesignlab.in", city: "Pune", state: "Maharashtra", territory: "West-1", zone: "West", source: "Social Media", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-04", nextFollowUp: "2026-03-22", createdAt: "2026-01-12", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Interior design studio. Focus on modern residential projects.", transferredToPartner: null, followUpHistory: [
    { id: "FU028", date: "2026-01-25", type: "call", notes: "Intro call. Interested in handleless concept.", outcome: "Wants to see samples", nextAction: "Schedule showroom visit", updatedBy: "Rajesh Kumar" },
    { id: "FU029", date: "2026-03-04", type: "whatsapp", notes: "Shared project images. Discussed sample visit.", outcome: "Visit planned for late March", nextAction: "Confirm visit date", updatedBy: "Rajesh Kumar" },
  ]},
  { id: "CL014", database: "architect", businessName: "Kolkata Interiors Studio", contactPerson: "Debashish Roy", mobile: "+91-9898123014", email: "debashish@kolkatainteriors.in", city: "Kolkata", state: "West Bengal", territory: "East-1", zone: "East", source: "Website", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", quality: "cold", sampleStatus: "pending", lastFollowUp: "2026-02-18", nextFollowUp: "2026-04-05", createdAt: "2026-02-10", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Website inquiry. Small firm, exploring new materials.", transferredToPartner: null, followUpHistory: [
    { id: "FU030", date: "2026-02-18", type: "call", notes: "Initial contact. Explained product concept.", outcome: "Mildly curious, no current project", nextAction: "Follow up in April", updatedBy: "Rajesh Kumar" },
  ]},
  { id: "CL015", database: "architect", businessName: "Chandigarh Design Associates", contactPerson: "Harmanpreet Kaur", mobile: "+91-9898123015", email: "harman@chandigarhda.in", city: "Chandigarh", state: "Punjab", territory: "North-1", zone: "North", source: "Exhibition", assignedUserId: "SP02", assignedUserName: "Priya Sharma", quality: "warm", sampleStatus: "pending", lastFollowUp: "2026-03-01", nextFollowUp: "2026-03-24", createdAt: "2026-01-20", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Met at DesignIndia expo. Working on 3 villa projects.", transferredToPartner: null, followUpHistory: [
    { id: "FU031", date: "2026-02-05", type: "email", notes: "Sent lookbook and technical sheets.", outcome: "Liked designs, wants samples", nextAction: "Ship sample kit", updatedBy: "Priya Sharma" },
    { id: "FU032", date: "2026-03-01", type: "call", notes: "Sample kit being prepared. Discussed project specs.", outcome: "Positive, waiting for samples", nextAction: "Confirm sample shipment", updatedBy: "Priya Sharma" },
  ]},
  { id: "CL016", database: "architect", businessName: "Kochi Creative Studio", contactPerson: "Thomas Mathew", mobile: "+91-9898123016", email: "thomas@kochicreative.in", city: "Kochi", state: "Kerala", territory: "South-1", zone: "South", source: "Referral", assignedUserId: "SP05", assignedUserName: "Vikram Menon", quality: "bad", sampleStatus: "provided", lastFollowUp: "2026-02-25", nextFollowUp: null, createdAt: "2025-12-05", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: "Went with competitor", lostDate: "2026-02-25", notes: "Was interested but chose competitor's product for current project.", transferredToPartner: null, followUpHistory: [
    { id: "FU033", date: "2025-12-20", type: "meeting", notes: "Product demo. Liked quality.", outcome: "Evaluating against competitor", nextAction: "Follow up in Jan", updatedBy: "Vikram Menon" },
    { id: "FU034", date: "2026-02-25", type: "call", notes: "Informed they went with competitor. Price was a factor.", outcome: "Lost to competition", nextAction: "Re-engage in 6 months", updatedBy: "Vikram Menon" },
  ]},
  { id: "CL017", database: "architect", businessName: "Hyderabad Home Studio", contactPerson: "Ananya Rao", mobile: "+91-9898123017", email: "ananya@hydstudio.in", city: "Hyderabad", state: "Telangana", territory: "South-2", zone: "South", source: "Architect Referral", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", quality: "account", sampleStatus: "provided", lastFollowUp: "2026-01-15", nextFollowUp: null, createdAt: "2025-10-20", conversionDate: "2025-12-15", convertedBy: "Sneha Reddy", daysToConvert: 56, convertedAccountId: "CA003", lostReason: null, lostDate: null, notes: "Converted to architect partner. Specifying OutDo in all luxury projects.", transferredToPartner: null, followUpHistory: [
    { id: "FU035", date: "2025-11-10", type: "meeting", notes: "Showroom visit. Loved the range.", outcome: "Wants to partner officially", nextAction: "Send partnership details", updatedBy: "Sneha Reddy" },
    { id: "FU036", date: "2025-12-15", type: "meeting", notes: "Partnership agreement signed.", outcome: "Converted to architect partner", nextAction: "Add to partner program", updatedBy: "Sneha Reddy" },
  ]},

  // ===== ORGANIC LEADS (5) =====
  { id: "CL018", database: "organic", businessName: "Verma Residences", contactPerson: "Nitin Verma", mobile: "+91-9898123018", email: "nitin@vermaresidences.in", city: "Mumbai", state: "Maharashtra", territory: "West-1", zone: "West", source: "Website", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", quality: "warm", sampleStatus: "not_applicable", lastFollowUp: "2026-03-10", nextFollowUp: "2026-03-20", createdAt: "2026-02-01", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Homeowner. Renovating 3BHK flat. Wants handleless kitchen.", transferredToPartner: "U003", followUpHistory: [
    { id: "FU037", date: "2026-02-08", type: "call", notes: "Website inquiry follow-up. Discussed requirements.", outcome: "Interested, need quotation", nextAction: "Transfer to dealer Amit Patel", updatedBy: "Rajesh Kumar" },
    { id: "FU038", date: "2026-03-10", type: "whatsapp", notes: "Transferred to dealer. Dealer following up.", outcome: "Dealer in contact", nextAction: "Check with dealer on progress", updatedBy: "Rajesh Kumar" },
  ]},
  { id: "CL019", database: "organic", businessName: "Sharma Villa Project", contactPerson: "Deepak Sharma", mobile: "+91-9898123019", email: "deepak@sharmavilla.in", city: "Delhi", state: "Delhi", territory: "North-1", zone: "North", source: "Exhibition", assignedUserId: "SP02", assignedUserName: "Priya Sharma", quality: "hot", sampleStatus: "not_applicable", lastFollowUp: "2026-03-14", nextFollowUp: "2026-03-17", createdAt: "2026-01-28", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Builder. 12-unit villa project in Gurugram. Needs bulk kitchen shutters.", transferredToPartner: null, followUpHistory: [
    { id: "FU039", date: "2026-02-05", type: "meeting", notes: "Met at HomeDeco Expo. Big project opportunity.", outcome: "Wants bulk quotation", nextAction: "Prepare project quotation", updatedBy: "Priya Sharma" },
    { id: "FU040", date: "2026-03-14", type: "meeting", notes: "Quotation presented. Negotiating terms.", outcome: "Positive, discussing payment terms", nextAction: "Finalize terms", updatedBy: "Priya Sharma" },
  ]},
  { id: "CL020", database: "organic", businessName: "Personal Inquiry", contactPerson: "Kavita Nair", mobile: "+91-9898123020", email: "kavita.nair@gmail.com", city: "Bangalore", state: "Karnataka", territory: "South-1", zone: "South", source: "Social Media", assignedUserId: "SP05", assignedUserName: "Vikram Menon", quality: "cold", sampleStatus: "not_applicable", lastFollowUp: "2026-02-22", nextFollowUp: "2026-04-10", createdAt: "2026-02-15", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Instagram inquiry. Early-stage renovation planning.", transferredToPartner: null, followUpHistory: [
    { id: "FU041", date: "2026-02-22", type: "whatsapp", notes: "Shared product images. Early stage, just exploring.", outcome: "Will revisit when ready", nextAction: "Follow up in April", updatedBy: "Vikram Menon" },
  ]},
  { id: "CL021", database: "organic", businessName: "Patel Home Renovation", contactPerson: "Bhavesh Patel", mobile: "+91-9898123021", email: "bhavesh@gmail.com", city: "Ahmedabad", state: "Gujarat", territory: "West-2", zone: "West", source: "Referral", assignedUserId: "SP03", assignedUserName: "Amit Patel", quality: "warm", sampleStatus: "not_applicable", lastFollowUp: "2026-03-08", nextFollowUp: "2026-03-19", createdAt: "2026-02-05", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: null, lostDate: null, notes: "Referred by dealer. Large bungalow renovation.", transferredToPartner: "U003", followUpHistory: [
    { id: "FU042", date: "2026-02-12", type: "call", notes: "Referral follow-up. Has a large kitchen and wardrobe project.", outcome: "Interested, wants site visit", nextAction: "Schedule site visit via dealer", updatedBy: "Amit Patel" },
    { id: "FU043", date: "2026-03-08", type: "visit", notes: "Site visit done with dealer. Measurements taken.", outcome: "Quotation to be prepared", nextAction: "Prepare and send quotation", updatedBy: "Amit Patel" },
  ]},
  { id: "CL022", database: "organic", businessName: "Personal Inquiry", contactPerson: "Radhika Kulkarni", mobile: "+91-9898123022", email: "radhika.k@gmail.com", city: "Pune", state: "Maharashtra", territory: "West-1", zone: "West", source: "Cold Call", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", quality: "bad", sampleStatus: "not_applicable", lastFollowUp: "2026-02-10", nextFollowUp: null, createdAt: "2026-01-28", conversionDate: null, convertedBy: null, daysToConvert: null, convertedAccountId: null, lostReason: "Not interested", lostDate: "2026-02-10", notes: "Not interested in handleless concept. Prefers traditional handles.", transferredToPartner: null, followUpHistory: [
    { id: "FU044", date: "2026-02-10", type: "call", notes: "Follow-up call. Clear that traditional design is preferred.", outcome: "Not interested - marked bad", nextAction: "None", updatedBy: "Rajesh Kumar" },
  ]},
];

// ---------- CRM Accounts (8 total, correlated) ----------
export interface CRMAccount {
  id: string;
  fromLeadId: string;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  territory: string;
  zone: string;
  accountType: CRMAccountType;
  classification: AccountClassification;
  health: AccountHealth;
  assignedUserId: string;
  assignedUserName: string;
  convertedBy: string;
  conversionDate: string;
  daysToConvert: number;
  totalOrderValue: number;
  totalOrders: number;
  lastOrderDate: string | null;
  outstandingAmount: number;
  sampleKitsProvided: number;
  displayInstalled: boolean;
  gstNumber: string;
  address: string;
  notes: string;
  isActive: boolean;
  // Dealer locator fields
  showOnLocator: boolean;
  locatorPriority: number;
  latitude: number;
  longitude: number;
}

export const crmAccounts: CRMAccount[] = [
  // Accounts from Phase 1 leads (L001-L005)
  { id: "A001", fromLeadId: "L001", businessName: "Mehta Interiors", contactPerson: "Anand Mehta", mobile: "+91-9876543210", email: "anand@mehta.in", city: "Mumbai", state: "Maharashtra", territory: "West-1", zone: "West", accountType: "dealer", classification: "dealer_with_display", health: "excellent", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", convertedBy: "Rajesh Kumar", conversionDate: "2025-11-25", daysToConvert: 10, totalOrderValue: 485000, totalOrders: 3, lastOrderDate: "2026-02-10", outstandingAmount: 45000, sampleKitsProvided: 2, displayInstalled: true, gstNumber: "27AABCM1234F1Z5", address: "Shop 12, LBS Road, Ghatkopar, Mumbai 400086", notes: "Premium dealer. Top performer in West zone.", isActive: true, showOnLocator: true, locatorPriority: 1, latitude: 19.0760, longitude: 72.8777 },
  { id: "A002", fromLeadId: "L002", businessName: "Nair Designs", contactPerson: "Deepika Nair", mobile: "+91-9876543211", email: "deepika@nair.in", city: "Bangalore", state: "Karnataka", territory: "South-1", zone: "South", accountType: "architect", classification: "architect_premium", health: "excellent", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", convertedBy: "Sneha Reddy", conversionDate: "2025-12-01", daysToConvert: 11, totalOrderValue: 720000, totalOrders: 4, lastOrderDate: "2026-03-01", outstandingAmount: 120000, sampleKitsProvided: 3, displayInstalled: false, gstNumber: "29AABCN5678G1Z3", address: "2nd Floor, 100 Feet Road, Indiranagar, Bangalore 560038", notes: "Top architect partner. Specifies OutDo in luxury projects.", isActive: true, showOnLocator: false, locatorPriority: 0, latitude: 12.9716, longitude: 77.5946 },
  { id: "A003", fromLeadId: "L003", businessName: "Sheikh Constructions", contactPerson: "Farhan Sheikh", mobile: "+91-9876543212", email: "farhan@sheikh.in", city: "Delhi", state: "Delhi", territory: "North-1", zone: "North", accountType: "dealer", classification: "dealer_with_sample", health: "good", assignedUserId: "SP02", assignedUserName: "Priya Sharma", convertedBy: "Priya Sharma", conversionDate: "2025-12-10", daysToConvert: 9, totalOrderValue: 350000, totalOrders: 2, lastOrderDate: "2026-01-15", outstandingAmount: 75000, sampleKitsProvided: 1, displayInstalled: false, gstNumber: "07AABCS9012H1Z8", address: "B-45, Kirti Nagar, New Delhi 110015", notes: "Growing dealer in Delhi. Focus on commercial projects.", isActive: true, showOnLocator: true, locatorPriority: 2, latitude: 28.6139, longitude: 77.2090 },
  { id: "A004", fromLeadId: "L004", businessName: "Rao Homes", contactPerson: "Geeta Rao", mobile: "+91-9876543213", email: "geeta@rao.in", city: "Hyderabad", state: "Telangana", territory: "South-2", zone: "South", accountType: "dealer", classification: "dealer_without_display", health: "average", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", convertedBy: "Sneha Reddy", conversionDate: "2025-12-20", daysToConvert: 10, totalOrderValue: 290000, totalOrders: 2, lastOrderDate: "2026-01-20", outstandingAmount: 57000, sampleKitsProvided: 1, displayInstalled: false, gstNumber: "36AABCR3456J1Z1", address: "Plot 78, Jubilee Hills, Hyderabad 500033", notes: "Residential focus. Potential for growth with display setup.", isActive: true, showOnLocator: true, locatorPriority: 3, latitude: 17.3850, longitude: 78.4867 },
  { id: "A005", fromLeadId: "L005", businessName: "Bhat Associates", contactPerson: "Harish Bhat", mobile: "+91-9876543214", email: "harish@bhat.in", city: "Pune", state: "Maharashtra", territory: "West-1", zone: "West", accountType: "dealer", classification: "dealer_with_sample", health: "at_risk", assignedUserId: "SP03", assignedUserName: "Amit Patel", convertedBy: "Amit Patel", conversionDate: "2025-12-28", daysToConvert: 13, totalOrderValue: 150000, totalOrders: 1, lastOrderDate: "2025-12-28", outstandingAmount: 0, sampleKitsProvided: 1, displayInstalled: false, gstNumber: "27AABCB7890K1Z6", address: "Office 5, FC Road, Pune 411004", notes: "Low activity since onboarding. Needs re-engagement.", isActive: false, showOnLocator: false, locatorPriority: 0, latitude: 18.5204, longitude: 73.8567 },
  // New accounts from CRM leads
  { id: "CA001", fromLeadId: "CL006", businessName: "Nagpur Modern Interiors", contactPerson: "Rahul Deshpande", mobile: "+91-9898123006", email: "rahul@nagpurmodern.in", city: "Nagpur", state: "Maharashtra", territory: "West-1", zone: "West", accountType: "dealer", classification: "dealer_with_sample", health: "good", assignedUserId: "SP01", assignedUserName: "Rajesh Kumar", convertedBy: "Rajesh Kumar", conversionDate: "2025-12-28", daysToConvert: 48, totalOrderValue: 180000, totalOrders: 1, lastOrderDate: "2026-02-15", outstandingAmount: 35000, sampleKitsProvided: 1, displayInstalled: false, gstNumber: "27AABCN2345L1Z2", address: "Shop 8, Dharampeth, Nagpur 440010", notes: "New dealer. Good showroom location.", isActive: true, showOnLocator: true, locatorPriority: 4, latitude: 21.1458, longitude: 79.0882 },
  { id: "CA002", fromLeadId: "CL011", businessName: "Mysore Woodcraft Industries", contactPerson: "Prakash Hegde", mobile: "+91-9898123011", email: "prakash@mysorewc.in", city: "Mysore", state: "Karnataka", territory: "South-1", zone: "South", accountType: "factory", classification: "factory_partner", health: "good", assignedUserId: "SP05", assignedUserName: "Vikram Menon", convertedBy: "Vikram Menon", conversionDate: "2025-12-10", daysToConvert: 56, totalOrderValue: 520000, totalOrders: 3, lastOrderDate: "2026-03-05", outstandingAmount: 80000, sampleKitsProvided: 0, displayInstalled: false, gstNumber: "29AABCM6789P1Z4", address: "Industrial Area, Hebbal, Mysore 570016", notes: "Reliable factory partner. Good quality and timely delivery.", isActive: true, showOnLocator: false, locatorPriority: 0, latitude: 12.2958, longitude: 76.6394 },
  { id: "CA003", fromLeadId: "CL017", businessName: "Hyderabad Home Studio", contactPerson: "Ananya Rao", mobile: "+91-9898123017", email: "ananya@hydstudio.in", city: "Hyderabad", state: "Telangana", territory: "South-2", zone: "South", accountType: "architect", classification: "architect_associate", health: "good", assignedUserId: "SP04", assignedUserName: "Sneha Reddy", convertedBy: "Sneha Reddy", conversionDate: "2025-12-15", daysToConvert: 56, totalOrderValue: 310000, totalOrders: 2, lastOrderDate: "2026-02-20", outstandingAmount: 50000, sampleKitsProvided: 2, displayInstalled: false, gstNumber: "36AABCH4567Q1Z7", address: "Suite 301, Banjara Hills, Hyderabad 500034", notes: "Active architect partner. Recommends OutDo in residential projects.", isActive: true, showOnLocator: false, locatorPriority: 0, latitude: 17.4100, longitude: 78.4850 },
];

// ---------- Helpers ----------
export const getCRMLeadById = (id: string) => crmLeads.find((l) => l.id === id);
export const getCRMAccountById = (id: string) => crmAccounts.find((a) => a.id === id);
export const getCRMSalespersonById = (id: string) => crmSalespeople.find((s) => s.id === id);
export const getLeadsByDatabase = (db: CRMDatabase) => crmLeads.filter((l) => l.database === db);
export const getLeadsByQuality = (q: LeadQuality) => crmLeads.filter((l) => l.quality === q);
export const getAccountsByType = (t: CRMAccountType) => crmAccounts.filter((a) => a.accountType === t);
export const getActiveAccounts = () => crmAccounts.filter((a) => a.isActive);
export const getLeadsByAssignee = (spId: string) => crmLeads.filter((l) => l.assignedUserId === spId);
export const getAccountsByAssignee = (spId: string) => crmAccounts.filter((a) => a.assignedUserId === spId);

// ---------- Analytics Helpers ----------
export function getLeadAgingDays(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date("2026-03-16");
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function getSourceSummary() {
  const summary: Record<string, { total: number; converted: number; hot: number; warm: number; cold: number; bad: number }> = {};
  crmLeads.forEach((l) => {
    if (!summary[l.source]) summary[l.source] = { total: 0, converted: 0, hot: 0, warm: 0, cold: 0, bad: 0 };
    summary[l.source].total++;
    if (l.quality === "account") summary[l.source].converted++;
    else if (l.quality === "hot") summary[l.source].hot++;
    else if (l.quality === "warm") summary[l.source].warm++;
    else if (l.quality === "cold") summary[l.source].cold++;
    else if (l.quality === "bad") summary[l.source].bad++;
  });
  return summary;
}

export function getCitySummary() {
  const summary: Record<string, { total: number; converted: number; active: number }> = {};
  crmLeads.forEach((l) => {
    if (!summary[l.city]) summary[l.city] = { total: 0, converted: 0, active: 0 };
    summary[l.city].total++;
    if (l.quality === "account") summary[l.city].converted++;
    if (l.quality !== "bad") summary[l.city].active++;
  });
  return summary;
}

export function getSalespersonSummary() {
  return crmSalespeople.map((sp) => {
    const leads = getLeadsByAssignee(sp.id);
    const accounts = getAccountsByAssignee(sp.id);
    const converted = leads.filter((l) => l.quality === "account").length;
    const avgDays = leads.filter((l) => l.daysToConvert).reduce((acc, l) => acc + (l.daysToConvert || 0), 0) / (converted || 1);
    return {
      ...sp,
      totalLeads: leads.length,
      convertedLeads: converted,
      conversionRate: leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0,
      avgDaysToConvert: Math.round(avgDays),
      totalAccounts: accounts.length,
      totalAccountValue: accounts.reduce((acc, a) => acc + a.totalOrderValue, 0),
    };
  });
}

// Format helpers
export function formatClassification(c: AccountClassification): string {
  const map: Record<AccountClassification, string> = {
    dealer_with_display: "Dealer with Display",
    dealer_with_sample: "Dealer with Sample",
    dealer_without_display: "Dealer without Display",
    factory_partner: "Factory Partner",
    factory_exclusive: "Factory Exclusive",
    architect_associate: "Architect Associate",
    architect_premium: "Architect Premium",
  };
  return map[c] || c;
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}
