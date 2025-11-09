// Step by Step Instructions Page (localStorage progress)
// Drop-in page for Vite + React (+ Wouter or React Router at the app level)

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";

const BIZ_FORMATION_PDF_URL = "/resources/Step-by-Step-Biz-Formation.pdf";

type Step = {
  id: string;
  label: string;
  items: readonly string[];
  description?: string;
  cta?: { text: string; href: string };
};

const steps: Step[] = [
  { id: "pre-launch", label: "Phase 0: Pre-Launch Planning", 
    description: "Assess readiness, understand capital requirements, and set realistic expectations before investing time and money.",
    items: [
      "Define Your Focus: Choose your income goal, service focus (food, package, medical, rideshare, or mixed), and starting city. Clear goals drive all subsequent decisions",
      "Self-Assessment Check: Valid driver's license (typically 1+ years), clean driving record (check DMV), age 21+ for most commercial work",
      "Vehicle Requirements: Working reliable vehicle under 10-15 years old for gig apps, passes state inspection, clean interior/exterior. Choose based on service type, total cost of ownership, reliability, fuel efficiency, and cargo space",
      "Financial Readiness: $500-$2,000 startup capital for insurance, business setup, equipment kit, and first month operating expenses",
      "Time Commitment: Full-time drivers (40+ hrs/week) earn $2,000-$5,000/mo starting out, part-time (20 hrs/week) earn $1,000-$2,500/mo",
      "Market Research: Research your metro area demand (high-density areas = more orders), identify peak times and hot zones, check local competition",
      "Capital Investment Timeline: Phase 1-2 Foundation/Gig ($500-$2,000), Phase 3 Courier Pro ($1,000-$3,000), Phase 4 Commercial Vehicle ($10,000-$50,000), Phase 5 Fleet Operations ($50,000-$200,000+)",
      "Revenue Expectations: Set realistic goals - Phase 2 Gig Driver ($2,000-$5,000/mo), Phase 3 Courier ($4,000-$8,000/mo), Phase 4 Commercial Vehicle ($8,000-$15,000 per vehicle), Phase 5 Fleet ($20,000-$100,000+)",
      "Risk Assessment: Understand vehicle wear/tear costs, insurance requirements increase with revenue, competition from other drivers, platform deactivation policies",
      "Exit Strategy Planning: Consider how you'll scale (add vehicles, hire drivers, niche specialization) or exit (sell routes, sell business, maintain passive income)",
      "⚠️ Scam Protection: ALWAYS use official government websites with '.gov' domain when applying for EIN, DOT/MC numbers, and registrations. Never pay third-party services for free government forms",
    ]
  },
  { id: "account-setup", label: "1) Account & Profile Setup", 
    description: "Complete your user profile with all personal and professional information. Check Driver Resources for essential startup tools.",
    cta: { text: "Open User Profile", href: "/user-profile" },
    items: [
      "Go to User Profile → Complete personal information (name, email, phone)",
      "Upload professional profile photo",
      "Add DOT Number and MC Number if applicable",
    ]
  },
  { id: "vehicle-fleet", label: "2) My Fleet - Vehicle Management",
    description: "Secure and document your vehicle(s) for gig work. Use Personal Credit section to check financing options. Driver Resources has insurance brokers and essential equipment.",
    cta: { text: "Open My Fleet", href: "/my-fleet" },
    items: [
      "Need a vehicle? Check Personal Credit → Vehicle Financing section for qualification requirements",
      "Research reliable gig vehicles: Honda Civic, Toyota Corolla, Nissan Sentra (fuel efficiency + reliability)",
      "Consider: CarMax, Carvana, local dealerships, or lease options for lower upfront costs",
      "Vehicle Standards for Gig Apps: Typically under 10-15 years old, passes state inspection, clean and reliable condition, 4-door preferred for rideshare",
      "Prepare Vehicle: Clear cargo area, optional shelving/bins, professional decals or magnets, dash camera, maintenance checklist",
      "Get Registration: Visit your local DMV or complete online registration (bring title, proof of insurance, ID, payment for registration fees - typically $50-200 depending on state)",
      "Get State Tags from DMV: After registration approval, receive license plates/tags to display on vehicle (required before operating commercially)",
      "Go to My Fleet → Add vehicle details (year, make, model, VIN, purchase/lease info)",
      "Get Correct Insurance Bundle for Your Use Case: Business-use auto liability, commercial auto, cargo coverage (for high-value goods), general liability (for facility access/inside delivery), non-owned auto liability (if hiring drivers with own vehicles), workers' compensation (if W2 employees), occupational accident insurance (for independent contractors)",
      "Get Insurance: Visit Driver Resources → Insurance & Fuel Cards section for commercial auto quotes (Progressive Commercial, Next Insurance, Simply Business compare $300k-$1M liability coverage)",
      "Essential Daily Kit: Safety vest, gloves, flashlight, cleaning wipes, towels, emergency contacts. Phone mount, car charger, LED flashlight, reflective safety vest, moving blankets, hand dolly, ratchet straps, tarp, basic tool set (screwdrivers, pliers, adjustable wrench)",
      "Activate Dash Camera: Turn on dash camera before each shift for liability protection and incident documentation",
      "Driver Resources → Equipment & Safety Tools has dashcams ($100-400), roadside emergency kits ($40-100), phone mounts ($15-40), and medical coolers ($40-500 for medical delivery)",
      "Upload vehicle registration, insurance, and inspection documents",
      "Set up maintenance schedule using the built-in accessory checklist",
      "Configure vehicle alerts for insurance renewal, registration, and maintenance",
      "Add vehicle photos (exterior, interior, dashboard, odometer) for insurance/resale documentation",
    ]
  },
  { id: "business-formation", label: "3) Business Entity Formation",
    description: "Use Business Document Storage to manage your business structure. Driver Resources has accounting and tax tools to streamline finances.",
    cta: { text: "Open Business Document Storage", href: "/business-document-storage" },
    items: [
      "Choose Business Structure: LLC recommended for most beginners (liability protection and professional credibility) vs Sole Proprietorship (simpler but no liability shield)",
      "Select and Register Business Name: Keep same spelling everywhere you will appear. Check availability on your state's Secretary of State website, ensure name is available across all platforms you'll use",
      "File LLC Formation: Register legal name with state Secretary of State office directly (typically $50-300) or services like LegalZoom, Nolo if you need help",
      "Get Federal EIN from IRS.gov (100% FREE): Obtain directly from official IRS website https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number - NEVER pay third-party services",
      "Get Professional Business Address: Some contracts don't accept home addresses - use UPS Store, virtual office service, or commercial PO Box for professional credibility",
      "Open Business Bank Account: Separate personal and business funds. Bring LLC formation paperwork and EIN letter. Options: Chase Business, Wells Fargo, or Driver Resources → Financial Institutions for Drivers Credit Union",
      "Set Up Cash Flow Sub-Accounts: Split income into 4 accounts - Operations (daily expenses), Profit (owner pay), Tax Savings (quarterly taxes), Growth/Maintenance (vehicle upgrades)",
      "Set up Bookkeeping & Expense Tracking: Log mileage, fuel, insurance, maintenance, phone, marketing costs. Driver Resources → Financial Tools has QuickBooks Self-Employed, Wave (free), Hurdlr, Stride Tax (free)",
      "Build Business Credit Early: Establish vendor accounts and monitor scores for future vehicle/fuel financing. Get D-U-N-S Number from Dun & Bradstreet (free), open Net-30 vendor accounts (Uline, Quill, Grainger) and pay early to build payment history",
      "Government & Institutional Readiness (For Large Contracts): Register Data Universal Numbering System (DUNS), System for Award Management (SAM.gov), relevant small business certifications to access government and institutional contracts",
      "Build Brand Identity: Choose logo, color scheme (2-3 colors max), typography with clear promise and visual identity. Use Canva, Looka, or hire designer on Fiverr ($20-100)",
      "Create Simple Website: List services, service area, contact, insurance coverage. Secure domain name. Include services offered, areas served, proof of insurance, contact info, booking/inquiry form. Use Wix, Squarespace, or WordPress",
      "Order Vehicle Branding: Door magnets or vinyl decals with logo, business name, phone number for instant field credibility and mobile advertising ($50-200)",
      "Prepare 'Proof Pack' (Critical for Contract Applications): Certificate of Formation, EIN Letter, Driver's License copy, Vehicle Registration, Auto Insurance Certificate, LLC/Commercial Insurance, One-page service rate sheet",
      "Professional Communication Templates: Create branded invoice template, rate card, proposal template, email signature with logo and contact info. Align all messaging across website and social channels",
      "Document Brand Guidelines: Save logo versions (color, black/white, vertical, horizontal), color codes (hex/RGB), font names, usage rules - apply consistently across website, social media, documents, vehicle graphics",
      "Build Cash Reserves: Maintain 3-6 months of operating expenses to stabilize operations and prepare for expansion ($3,000-$15,000 depending on operation size)",
      "Go to Business Document Storage → Upload all formation documents, EIN letter, insurance certificates",
      "Use app's business plan template to complete executive summary and market analysis",
    ]
  },
  { id: "certifications", label: "4) License & Certification Upload",
    description: "Complete your medical certifications and professional credentials. Driver Resources Medical Add-On Bundle provides complete medical specialization setup.",
    items: [
      "Build Professional Profile: Go to User Profile → License and Certification section with clear portrait photo, driver license, vehicle registration, insurance proof, and any certifications",
      "Upload clean driver's license photo and any CDL endorsements",
      "USDOT Number (If Required): Determine whether you need US Department of Transportation number for interstate commerce or specific weight/passenger thresholds. Complete registration at https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number if required. Generally triggers at 10,001+ lbs GVWR and interstate commerce",
      "MC Authority Number (If Required): Determine whether you need Federal Motor Carrier Safety Administration operating authority for for-hire carriage. Obtain motor carrier number at https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate if needed. Most car/SUV couriers won't need this",
      "Health & Safety Training: Complete training relevant to your niche - Bloodborne Pathogens (https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1030) for potential exposure, HIPAA training for medical data handling ($20-50 online)",
      "Medical transport premium: Get HIPAA training (online $20-50), CPR/First Aid certification",
      "HIPAA Compliance & BAA: Complete HIPAA awareness mini-module. Some medical clients require Business Associate Agreement (BAA) or privacy addendum before handling Protected Health Information (PHI). Track BAA requirements per client",
      "HIPAA Evolution & Continuous Compliance: Continually harden medical privacy and safety compliance by updating workforce training materials and security practices as HIPAA regulations evolve",
      "Medical Specialization Package: Driver Resources → Curated Bundles → Medical Transport Add-On ($500-1,200 setup) includes HIPAA training, BAA templates, medical-grade coolers, temperature logging, spill kits, bloodborne pathogens cert, CPR/First Aid, cargo insurance ($25k-$100k)",
      "Medical Equipment Essentials: Driver Resources → Equipment & Safety Tools has medical coolers ($40-500), OSHA-compliant spill kits ($30-80), temperature logging systems",
      "High-value cargo: OSHA Bloodborne Pathogens certification from local training centers for potential exposure",
      "Hazmat/DG Scope Defined: Most medical specimen work is UN3373 (Category B biological substance) - NOT classified as hazmat and doesn't require DOT hazmat endorsement. True hazmat (Class 6.2) is rare for couriers",
      "BioHazard transport: BioHazard Transport Training for medical waste and infectious materials (DOT/EPA compliance) - required for regulated medical waste only",
      "Airport/International (Advanced/Optional): DOT/IATA Dangerous Goods certification for airport cargo operations or international shipments (check local airports for training). Not needed for standard courier work",
      "Use app's educational buttons to understand which certifications boost your earning potential",
      "Add custom certifications using the two customizable slots for specialized training",
    ]
  },
  { id: "personal-credit", label: "5) Personal Credit Setup",
    description: "Set up credit monitoring for vehicle financing and business expansion. Essential for fleet growth.",
    cta: { text: "Open Personal Credit", href: "/personal-credit" },
    items: [
      "Get free credit reports: AnnualCreditReport.com (official government site)",
      "Check scores: Credit Karma, Experian app, or your bank's free credit monitoring",
      "Go to Personal Credit → Enter current scores from all three bureaus (Equifax, Experian, TransUnion)",
      "Use app's vehicle financing calculator to see what you qualify for (680+ credit = better rates)",
      "Set improvement goals: Pay down credit cards below 30% utilization, dispute errors",
      "Set up credit monitoring alerts for new accounts, inquiries, and score changes",
      "Plan for fleet expansion: Good credit = access to business vehicle loans and leases",
    ]
  },
  { id: "company-research", label: "6) Driver Opportunities Research",
    description: "Research and track gig companies using the comprehensive 449+ company database. Use GigBot AI for personalized recommendations.",
    cta: { text: "Open Driver Opportunities", href: "/companies" },
    items: [
      "Go to Driver Opportunities → Browse 449+ verified non-CDL courier companies by service vertical",
      "Start with high-demand verticals: Medical (premium pay), Food Delivery (consistent volume), Package Delivery",
      "Use search criteria filters: Medical Search, Food Search, Package Search for targeted results",
      "Ask GigBot AI assistant for personalized company recommendations based on your location/vehicle",
      "Set company actions: Research → Apply → Active status (all selections save permanently)",
      "Add detailed notes: pay rates, requirements, contact info, application status",
      "Set reminders for follow-ups using the app's integrated reminder system",
      "Focus on companies with verified websites and active hiring status",
    ]
  },
  { id: "application-tracking", label: "7) Application Management",
    description: "Track your application lifecycle from submission to hiring.",
    items: [
      "Update company status from Research → Applied when submitting",
      "Schedule and track interview dates (auto-saves to notes)",
      "Move status to Interview → Hired/Rejected based on outcomes",
      "Log all contact communications and follow-ups",
      "Set up reminder notifications for important dates",
    ]
  },
  { id: "platform-signups", label: "8) Platform Sign-Ups & Onboarding",
    description: "Start with 3-5 platforms to avoid overwhelm. Track requirements and payouts.",
    items: [
      "Starter Gig Platforms (Food/Rideshare): Uber Eats, DoorDash, Grubhub, Lyft - great for flexible starting cash and learning delivery basics",
      "Parcel/Retail Platforms: Amazon Flex, Roadie, Walmart Spark, Dispatch - larger packages, higher pay than food delivery",
      "Medical Courier (Premium Pay): USPack, Dropoff, Medifleet, BioMed - requires HIPAA training and medical certifications from step 4",
      "Construction/Parts Delivery: Curri (construction/electrical supplies), GoShare, Frayt, Bungii - higher pay, requires reliability and often SUV/truck",
      "Platform Approval Process: Complete background checks, MVR (motor vehicle record), vehicle inspection photos, profile photo, proof of insurance",
      "Maintain High Performance Metrics: Target 95%+ acceptance rate, 95%+ on-time delivery, 4.8+ star customer rating to avoid deactivation",
      "Track Mileage & Expenses from Day One: Use Hurdlr, Everlance, or Stride Tax (all free) for IRS-compliant mileage logs and expense tracking",
      "Collect Social Proof: Save screenshots of 5-star reviews and high ratings for later use in direct contract proposals and platform applications",
    ]
  },
  { id: "task-management", label: "9) Task & Project Management",
    description: "Use Kanban boards and calendar views to organize your gig work. Seamless integration with reminder system.",
    cta: { text: "Open Task Management", href: "/task-management" },
    items: [
      "Go to Task Management → Create boards: 'Applications', 'Vehicle Maintenance', 'Business Tasks'",
      "Set up cards for each company application with deadlines and requirements",
      "Add vehicle maintenance cards: oil changes, registration renewals, insurance updates",
      "Use calendar view for interview scheduling and deadline visualization",
      "Set due dates and reminders (automatically sync with left navigation reminder count)",
      "Track progress with drag-and-drop: To Do → In Progress → Completed",
      "Switch between Board and Calendar views using seamless bidirectional navigation",
    ]
  },
  { id: "academy-training", label: "10) Driver Gigs Academy",
    description: "Complete training courses to improve skills and qualifications.",
    cta: { text: "Open Academy", href: "/academy" },
    items: [
      "Go to Academy → Browse available courses and certifications",
      "Complete safety and compliance training modules",
      "Track course progress and completion certificates",
      "Access video and text content for skill development",
      "Download certificates for employment applications",
    ]
  },
  { id: "operations-setup", label: "11) Daily Operations Workflow",
    description: "Establish efficient daily routines and safety protocols. Driver Resources has fuel cards and tracking tools to maximize daily earnings.",
    items: [
      "Pre-trip checklist: fuel, tires, wipes, towels, flashlight",
      "Fuel Savings Strategy: Driver Resources → Fuel Cards section has 21+ options - Start with Upside (up to 25¢/gal cashback), Shell Fuel Rewards (5-20¢/gal), or GasBuddy Pay (up to 40¢/gal). Commercial drivers check WEX Fleet Card or AtoB for fleet discounts",
      "Mileage & Expense Tracking: Driver Resources → Financial Tools has automatic tracking apps - Everlance, Stride Tax (free), Hurdlr for real-time expense logging and IRS-compliant reports",
      "Dashcam active + safety kit (vest, gloves, emergency contacts). Driver Resources → Equipment has dashcams ($100-400), roadside emergency kits ($40-100)",
      "Start/end shift logging with mileage tracking using recommended apps",
      "Proof-of-delivery protocol: geo-photos + video + notes",
      "Peak Earning Times - Food Delivery: Breakfast 7-9am Mon-Fri, Lunch 11am-2pm Mon-Fri (HIGHEST demand), Dinner 5-9pm every day (HIGHEST demand and tips), Late night 9pm-midnight Fri-Sat",
      "Peak Earning Times - Parcel/Amazon: Mid-morning to evening 10am-8pm (7 days/week), Prime Now/Fresh early morning 6-9am and evening 4-8pm",
      "Hot Zone Strategy: Position yourself in high-demand areas - Downtown business districts (lunch), suburban residential (dinner), near restaurant clusters (food delivery), near Amazon facilities (Flex blocks), avoid dead zones (industrial areas during off-hours)",
      "Performance Metrics to Target: Acceptance Rate 70-95%, On-Time Rate 95%+, Completion Rate 98%+, Customer Rating 4.7-5.0 stars (below 4.5 risks deactivation)",
      "End-shift: upload PODs, reconcile payouts, log issues",
    ]
  },
  { id: "safety-protocols", label: "11a) Safety & Quality Protocols",
    description: "Professional delivery standards, customer communication templates, and safety rules to maintain high ratings and protect yourself.",
    items: [
      "Immaculate Proof of Delivery (POD) Records: Keep time-stamped photos, notes, and signatures for every delivery to reduce disputes and strengthen client trust. Every delivery requires: (1) time-stamped photo showing package at door/reception, (2) recipient name captured, (3) signature when required (high-value/medical), (4) delivery notes for exceptions",
      "Photo Every Delivery: Even hand-to-hand if customer agrees. Protects against false 'not delivered' claims. Show package AND house number/door in photo",
      "Safe Placement: Out of sight from street, protected from weather, follow customer delivery notes carefully (gate codes, dog warnings, side door)",
      "Text Message Templates - Save these in your phone for quick responses:",
      "  • Arrival/ETA: 'Hi [Name], this is [Your Name] from [Platform]. I'm 5 minutes away with your delivery. Thanks!'",
      "  • Delivery Confirmation: 'Delivered to your [front door/side entrance]. Placed in [safe location]. Thanks and have a great day!'",
      "  • Issue/Delay: 'Hi [Name], I'm experiencing a slight delay due to [traffic/previous delivery]. New ETA is [time]. Apologies for the inconvenience!'",
      "  • Access Issue: 'I'm at your location but cannot access [gate code not working/no answer at door]. Can you please assist? Thanks!'",
      "Safety Rules - Never Negotiate: Never enter a customer's home, don't accept cash tips without recording (for tax purposes), trust your instincts (if unsafe, contact support and leave)",
      "Vehicle Safety: Park legally using hazards if briefly stopping, lock car when away (even 30 seconds), keep phone charged with emergency contacts, share location with trusted person during night shifts",
      "Vehicle Maintenance: Daily inspection (tire pressure, lights, fluid levels), weekly brake check and wash, monthly full maintenance check, keep maintenance log for taxes",
      "Protect Your Eligibility: Maintain clean motor vehicle record (MVR), stay current with background authorizations, complete required drug screening for sensitive work (medical, government contracts)",
      "How to Get Great Ratings: Communicate proactively (ETA updates, delivery confirmations), go slightly above expectations (neat presentation, insulated bag in cold weather), be friendly but professional, handle issues calmly (wrong/missing items → contact support immediately, don't blame customer or restaurant), maintain clean vehicle and neat appearance",
      "Social Proof Collection: Screenshot positive platform reviews and compliments, maintain 4.8+ star rating consistently, document milestones ('500 deliveries with 5-star rating'), request Google reviews from B2B customers, save testimonials for website and contract proposals",
    ]
  },
  { id: "revenue-planning", label: "12) Revenue Goals & Daily Operations Plan",
    description: "Master the financial framework and daily execution plan to reach $10,000/month through route stacking and margin management.",
    items: [
      "Monthly Income Target Breakdown: Set $10,000/month goal → Convert to $2,500/week → Break down to $500/day target for clear daily execution",
      "Daily Volume Plan: Target 10 deliveries per day at $50 average = $500/day. Track actual vs target daily to identify gaps and adjust strategy",
      "Anchor Service Strategy: Select ONE reliable weekly base (e.g., Amazon Flex block, dedicated medical route, contract route paying $300-500/week), then stack on-demand deliveries around that guaranteed base income each day",
      "Build Three Company Lists: (1) Companies offering contract routes (Amazon DSP, FedEx Ground, local courier companies), (2) On-demand delivery apps (DoorDash, Roadie, Curri, GoShare), (3) Private local businesses that ship daily (pharmacies, auto parts, law firms, labs). Keep active contact list in your CRM or spreadsheet",
      "Ask for Multiple Routes from Master Contractors: When approaching companies with independent contractor or master contractor routes, request 2-3 routes instead of just one. Explain you have backup drivers and can handle volume. More routes = better negotiating leverage",
      "Negotiate Performance Add-Ons: Don't just accept base route pay. Negotiate bonuses for: 98%+ on-time percentage (+$50-100/week), 100% scan accuracy (+$25-50/week), perfect POD photo quality (+$25-50/week), zero customer complaints (+$50/week). Document these in your contract",
      "Subcontracting Margin Model: Accept route at $1,500/week → Pay reliable driver $1,200/week → Keep $300/week company margin. You handle client relationship, driver does execution. This is your path from owner-operator to business owner",
      "Duplicate Margin Model Across Routes: Once one route works, replicate it. Three identical routes at $300 margin each = $900/week company income without you driving. This is scalable revenue",
      "Package-Based Margin Model (E-Commerce): Negotiate at least $3 per package with client → Pay driver $2.50 per package → Retain $0.50 per package company margin. On 100-package route, that's $50/day or $250/week margin per route",
      "Scale Package Model to Daily Cash Flow: Assign 10 drivers to 100-package routes each = 1,000 packages/day × $0.50 margin = $500/day company margin ($2,500/week, $10,000/month) without you delivering packages. This is the business model",
      "Daily Stacking Plan Execution: Start with anchor route (6am-10am), then fill 10am-6pm gaps with on-demand pickups within 10-mile radius during idle windows. Never drive empty. Always have backup app open",
      "Three Daily Metrics System: Track $/hour (gross and net), $/mile, and idle minutes for every shift. Drop any app/route/client that consistently weakens your average. Be ruthless with low performers",
      "Weekly Performance Scoreboard: Track total completed stops, average revenue per stop, company margin per stop, route on-time percentage. Post this visibly. What gets measured gets managed",
      "Direct Business Relationships for Weekday Stability: Build recurring contracts with pharmacies (specimen/prescription runs), laboratories (medical specimen routes), clinics (supply delivery), auto parts suppliers (emergency parts), caterers (morning delivery), law firms (court filing/document service). These provide predictable weekday base",
      "One-Page Zone Rate Sheet: Create professional rate card showing: Zone 1 (0-5 miles): $15, Zone 2 (6-10 miles): $25, Zone 3 (11-20 miles): $40, Zone 4 (20+ miles): $60+. Add: wait time $30/hr after 15min, after-hours +50%, bulk discount 10% for 5+ stops. Include service area map",
      "Proof of Delivery (POD) Checklist Standard: Every delivery requires: (1) Time-stamped photo showing package at door/reception, (2) Recipient name captured, (3) Signature when required (high-value/medical), (4) Delivery notes for exceptions (left with neighbor, business closed). No exceptions. This protects against false claims",
      "Route Assignment System: Assign each route to named primary driver AND named backup driver. Document swap process for: illness (24hr notice, backup covers), vehicle failure (backup vehicle or swap driver), weather delays (client notification protocol). Never scramble last-minute",
      "Weekly Route Density Optimization: Every Friday, review route sequences to eliminate: excessive left turns (UPS saves millions on this), deadhead miles (empty driving between stops), long cross-town jumps. Redesign to reduce miles by 10-15% = fuel savings and more deliveries per day",
      "Client Profitability Review: Track $/hour and $/mile by client. If any client falls below your minimum threshold for 2 consecutive weeks, either raise rates immediately or replace with better client. Your time is your inventory - don't waste it on low payers",
      "Financial Rhythm by Timeframe: Daily = fuel receipts captured, Weekly = driver payroll + owner pay distribution, Monthly = insurance premiums + vehicle maintenance, Quarterly = tax payments + profit review, Annual = insurance renewal + entity filing. Automate what you can",
      "First 3 Months Reinvestment Rule: Take 100% of company margin from first 3 months and reinvest in: driver recruiting ads, backup/spare vehicle purchase or deposit, evening route expansion. Goal: anchor revenue never depends on you personally after 90 days",
    ]
  },
  { id: "direct-contracts", label: "13) Direct Contracts & Client Acquisition",
    description: "Scale beyond gig apps by securing direct contracts with businesses. Higher margins, predictable income.",
    items: [
      "Target High-Value Local Clients: Medical labs/pharmacies (specimens, prescriptions - premium pay), auto parts stores (NAPA, O'Reilly - same-day urgent parts), legal firms (court filings, document service), real estate offices (lockbox keys, documents), HVAC companies (emergency parts delivery), appliance/furniture stores (white-glove delivery), florists (same-day event delivery), print shops (blueprint/banner delivery), small manufacturers/wholesalers (B2B shipping)",
      "Build Your Client Pitch Package: Professional one-page capability sheet listing services offered, coverage area map, pricing structure, insurance limits ($1M liability standard), 3-5 customer testimonials/references, photos of branded vehicle, ETA tracking screenshot example, same-day and scheduled delivery options",
      "Contract Types - MSA (Master Service Agreement): Long-term framework contract (1-3 years) outlining: general service terms, base rate structure, insurance requirements and certificates, liability and damage protocol, payment terms (Net 7/14/30), termination clauses (30-60 day notice), renewal options. MSA stays in place while individual deliveries happen under it",
      "Contract Types - SOW (Statement of Work): Specific project executed under MSA framework. Each SOW defines: exact scope (daily route, on-demand, dedicated driver), specific deliverables (number of stops, coverage hours, SLA requirements), project timeline (start/end dates, recurring schedule), payment schedule for this specific work. Multiple SOWs can exist under one MSA",
      "Pricing Models Explained: Per-Mile ($1.50-$3.50/mile for medical/legal/time-sensitive - measure actual driving distance), Per-Stop ($8-25/stop for route delivery with multiple destinations), Hourly Rate ($25-45/hr for dedicated driver routes or waiting time), Day Rate ($200-400/day for full-day dedicated service), Base Fee + Mileage (e.g., $15 base + $2/mile after first 5 miles), After-Hours Surcharge (add 25-50% for nights/weekends/holidays)",
      "Create Professional Rate Card: Design clean PDF rate sheet showing: standard delivery (next-day), rush delivery (same-day 4-hour window), urgent delivery (2-hour guaranteed), scheduled recurring routes (discounted 10-15%), mileage tiers (0-10 miles, 11-25 miles, 26+ miles), wait time fees ($25-35/hr after 15 min grace), failed delivery fee ($10-15 if recipient unavailable), after-hours premium (25-50% upcharge). Include contact info, insurance proof, service area map",
      "Payment Terms Strategy: Net 7 (payment within 7 days - best for cash flow, offer 2% discount for immediate payment), Net 14 (standard for small businesses, good balance), Net 30 (common for mid-size corporations, plan cash flow accordingly), Net 45-60 (large enterprise only, negotiate 25-50% deposit upfront or progress billing). For new clients, start with Net 14 or require deposit until trust is established",
      "Insurance Requirements for B2B Contracts: Commercial Auto Liability ($1M is standard minimum for most contracts), Cargo/Goods in Transit Insurance ($25k-$100k based on value of items transported - required for high-value deliveries), General Liability ($1M-$2M for facility access, loading dock work, inside delivery), Workers Compensation (if you have W2 employees delivering), Additional Insured Endorsement (client's company added to your policy as protected party - common request)",
      "Local Client Prospecting Methods: Cold calling 10-15 businesses daily (use script: 'Hi, this is [Name] with [Business]. We provide same-day courier service to businesses in [area]. Do you currently have a reliable courier for urgent deliveries?'), LinkedIn B2B outreach (connect with operations managers, office managers, procurement), in-person visits with business cards and rate sheets during slow traffic hours, Chamber of Commerce and BNI networking group meetings (great for referrals), industry-specific trade shows and conferences, Google My Business listing optimization",
      "Build Referral Incentive Program: Offer existing clients $50-100 credit for each qualified referral (business that completes 3+ deliveries), create simple referral card to hand to satisfied customers, track referrals in CRM, send thank-you note or small gift ($25 Starbucks card) to referring client after successful onboarding",
      "Create Service Level Agreements (SLAs): Define on-time delivery standards (98%+ on-time within promised window), communication protocols (driver texts 15 min ETA, confirms delivery within 5 min), photo documentation requirements (geo-tagged photo at every stop), damage/loss reporting process (client notified within 1 hour, claim submitted within 24 hours), backup driver protocol if primary driver unavailable, holiday/weekend coverage policy",
      "Negotiation Strategy for New Contracts: Offer 30-90 day trial period at 10-15% discount rate to prove reliability and build case study, document all successful deliveries with metrics (on-time %, customer feedback, cost savings vs previous provider), after trial, present case study showing value delivered and request rate increase to standard pricing, for volume clients (20+ deliveries/month), offer 5-10% volume discount in exchange for 6-12 month commitment, bundle related services (same-day + scheduled routes) for package pricing",
      "Contract Red Flags to Avoid: Net 60-90+ payment terms without upfront deposit (cash flow killer, especially for new business), vague scope like 'as-needed deliveries' without minimum volume commitment or defined service area, no clear termination clause (you want 30-60 day out clause in case client doesn't pay or relationship sours), insurance requirements exceeding $2M or specialized coverage you can't obtain affordably, exclusivity clauses preventing you from serving competitors without premium rate (25-40% higher) to justify lost opportunity, unlimited liability for damages beyond your cargo insurance limits, automatic renewal clauses without rate adjustment provisions",
    ]
  },
  { id: "marketing-customer-acquisition", label: "14) Marketing & Customer Acquisition",
    description: "Digital and local marketing strategies to attract direct clients and build your brand beyond gig platforms.",
    items: [
      "Google My Business Optimization: Claim and complete GMB listing with photos of branded vehicle, services offered, coverage area, business hours. Add keywords: 'courier service [Your City]', 'same-day delivery [Your City]', 'medical courier'",
      "Local SEO Strategy: Build citations on Yelp, Yellow Pages, Thumbtack, Angi (formerly Angie's List), Better Business Bureau. Ensure NAP (Name, Address, Phone) is consistent across all platforms",
      "Social Media Presence: Post weekly on Facebook Business Page and Instagram showing: completed deliveries (with permission), service areas, special offers, behind-the-scenes, customer testimonials. Use hashtags: #CourierService #SameDayDelivery #LocalDelivery [CityName]",
      "Flyer & Door Hanger Campaign: Design professional flyers targeting businesses that ship daily. Distribute to: medical offices, auto parts stores, law firms, real estate offices, pharmacies, print shops. Include QR code linking to booking form",
      "Networking Events - Monthly Target: Attend Chamber of Commerce meetings, BNI (Business Network International) chapters, industry trade shows (HVAC, construction, medical), local business expos. Bring business cards and one-page rate sheet",
      "LinkedIn B2B Outreach: Connect with operations managers, office managers, procurement professionals in your metro. Share valuable content about logistics, offer free delivery consultation, send personalized connection requests",
      "Referral Incentive Program: Offer existing clients $50-100 credit for each qualified referral (business completing 3+ deliveries). Create simple referral card, track in CRM, send thank-you gift ($25 Starbucks card) to referring client",
      "Cold Email Template: 'Hi [Name], I'm [Your Name] with [Business]. We provide same-day courier service to businesses in [Area]. I noticed [Company] ships [products/documents] and wondered if you have a reliable courier for urgent deliveries. We offer [key benefit]. Would you be open to a brief 10-min call this week?'",
      "Partnership Strategy: Build relationships with complementary businesses who can refer clients: Print shops (delivery for banners, blueprints), IT companies (equipment delivery), event planners (supply delivery), property managers (key delivery), medical equipment suppliers (installation delivery)",
      "Vehicle as Billboard: Ensure magnetic signs or vinyl decals are visible with: Large logo, business name, phone number (large clear font), tagline ('Same-Day Delivery' or 'Medical Courier Services'), website URL. Park strategically during lunch breaks in high-traffic business districts",
      "Promotional Offers for New Clients: First delivery free (up to $25 value), 10-15% discount on first month for contracts, bulk delivery discounts (5+ deliveries get 10% off), seasonal promotions (tax season for legal couriers, holiday season for e-commerce)",
      "Content Marketing: Create simple blog or Facebook posts about: How to choose a courier service, Benefits of same-day delivery, Industry-specific tips (medical specimen handling, construction materials delivery), Case studies of successful deliveries",
      "Online Advertising (Optional): Google Ads targeting '[City] courier service', '[City] same-day delivery' keywords ($5-20/day budget), Facebook/Instagram ads targeting local business owners age 30-60 ($5-15/day), Nextdoor Business posts (free, highly local)",
      "Email Marketing: Collect business cards from networking events, build email list of 50-100 local businesses, send monthly newsletter with: service updates, special offers, success stories, industry tips. Use Mailchimp free tier (up to 500 contacts)",
    ]
  },
  { id: "networking", label: "15) Professional Networking",
    description: "Build professional relationships and expand your network.",
    items: [
      "Go to Networking Groups → Join relevant professional groups",
      "Connect with other drivers and industry professionals",
      "Attend virtual and local networking events",
      "Share experiences and learn best practices",
      "Build referral relationships for new opportunities",
    ]
  },
  { id: "earnings-optimization", label: "16) Earnings Strategy & Analytics",
    description: "Optimize your earning potential using data-driven insights. Driver Resources fuel cards and expense tools help maximize net income.",
    items: [
      "Set Consistent Schedule: Treat gig work like a real business - maintain weekly schedule (e.g., Mon-Fri 7am-6pm or evenings/weekends)",
      "Review Dashboard Analytics: Track earnings, completion rates, efficiency metrics, customer ratings",
      "Maximize Fuel Savings: Driver Resources → Fuel Cards - Stack rewards (Example: Costco Gas wholesale pricing + Upside cashback can save 30-50¢/gal total)",
      "Track True Profitability: Driver Resources → Financial Tools has QuickBooks, Hurdlr, TaxBot for real-time profit/loss analysis after expenses",
      "Map Hot Zones & Peak Hours: Identify high-demand areas and times per platform (lunch rush 11am-1pm, dinner 5-8pm, weekend mornings)",
      "Multi-App Strategy: Choose primary app + 2-3 backup apps to minimize idle time during slow periods",
      "Track Key Performance Indicators (KPIs): $/hour (gross and net after expenses), $/mile, idle time percentage, deliveries per hour - automated with Everlance or Stride Tax",
      "Weekly Performance Review: Analyze which routes/times/platforms are most profitable, eliminate low-pay patterns, double down on high-earners",
      "Safety & Quality Standards: Photo proof on every delivery (protects against false claims), maintain professional demeanor, use text templates for ETAs and delivery confirmations",
    ]
  },
  { id: "commercial-vehicle", label: "17) Commercial Vehicle Operations (Sprinter/Box Truck)",
    description: "Scale to commercial vehicles for higher-paying freight and enterprise contracts. Requires significant capital and regulatory compliance.",
    items: [
      "Vehicle Selection Decision: Sprinter/Cargo Van (high roof preferred) for e-commerce routes, medical courier, high-volume parcels ($30,000-$60,000) OR Box Truck 16-26 ft for palletized freight, furniture, appliances ($20,000-$80,000)",
      "Commercial Insurance Requirements: Commercial auto liability (often $1M minimum), general liability ($1M-$2M), cargo insurance ($100k typical), workers comp if employing drivers",
      "USDOT & MC Number (When Required): FMCSA DOT number if operating 10,001+ lbs GVWR interstate OR transporting 9+ passengers. MC Authority number if acting as for-hire motor carrier crossing state lines. Not needed for most car/SUV courier work under 10,001 lbs",
      "DOT Compliance (If Applicable): Drug & alcohol testing consortium enrollment, annual vehicle inspections, electronic logging device (ELD) if subject to hours-of-service rules, IFTA/IRP registration for interstate operations",
      "Load Sources & Contracts: DAT Load Board ($40-150/mo), Truckstop.com ($50-100/mo), Direct Freight, Amazon Relay (box truck program), Curry Fleet Portal, local wholesalers/distributors",
      "Commercial Vehicle Equipment: E-track rails and load bars, pallet jack (manual $200-500 or electric $1,500-3,000), lift gate for box trucks ($3,000-8,000 installed), ratchet straps, moving blankets, corner protectors",
      "Operations Technology Stack: ELD/GPS tracking (Samsara $50-100/vehicle/mo, KeepTruckin), route planning software (Circuit, Onfleet), proof of delivery apps (LoadProof, Transflo), fuel card with IFTA reporting (WEX, AtoB)",
      "Financial Planning for Commercial: Vehicle financing (expect $500-$1,500/mo payment), maintenance reserve fund (target 5-8% of gross revenue = $400-$1,200/mo), insurance reserve ($400-$800/mo), fuel costs increase significantly, factoring services if using load boards (2-5% fee for quick payment)",
      "Commercial Vehicle Transition Timeline: Save $10,000-$25,000 down payment (or lease with $3,000-$5,000 down), build commercial insurance history (6-12 months car/SUV courier work), establish business credit (12+ months), get DOT/MC authority if needed (90-day application process)",
    ]
  },
  { id: "scaling", label: "18) Fleet Scaling, Team Building & Full Operations",
    description: "Expand your operation with fleet management systems, load boards, and broker relationships. Driver Resources Small Fleet Bundle has complete scaling package.",
    items: [
      "Add Second High-Demand Niche: Diversify beyond on-demand food orders by adding medical, parts, or scheduled B2B routes for more stable, predictable income",
      "Acquire Second Vehicle: Add when your bookings regularly exceed single-vehicle capacity (80%+ utilization for 90+ days) and financing terms fit your cash flow plan",
      "Draft Driver Handbook: Create standard operating procedures covering: POD protocol, delivery app instructions, customer service scripts, emergency procedures, uniform requirements, safety rules, equipment checklist, return-to-station procedures. Every driver signs acknowledgment before first shift",
      "Set Hiring Standard: Require valid license, current delivery-appropriate insurance, vehicle registration, background authorization, signed agreement (IC agreement or employment contract)",
      "Decide Employment Model: Choose between W2 employees (you provide vehicle/equipment, withhold taxes, provide benefits, more control, higher cost) vs 1099 independent contractors (they use own vehicle, handle own taxes, no benefits, more flexibility, less control). Start with 1099 to test market demand, or mixed model",
      "Begin with Subcontractors: Start with one or two independent contractors who bring their own vehicles to test your process before scaling further",
      "Strategic Hiring Advertisements: Post on Indeed, Craigslist, Facebook Groups (Local Delivery Drivers, Gig Economy Drivers). Highlight in ad: '100 packages/day on fast residential routes', 'Prior Amazon/FedEx/UPS experience preferred', 'Earn $200-300/day', '6am-2pm finish early'. This attracts experienced parcel drivers who already complete 200-300 packages/day and will easily finish 100 packages within 8 hours",
      "Clear Job Post Requirements: Include exact details to speed recruiting: Daily pay amount ($200-300), start time (6am), finish time estimate (1-3pm), geographic zone (North Dallas, Fort Worth West), required vehicle type (cargo van, minivan, or large SUV), minimum insurance requirements ($300k liability). Clarity eliminates unqualified applicants",
      "Rapid Screening Flow (1 Week Start): Day 1-2: Phone interview (10min to verify experience, vehicle, availability), Day 3: Document collection (license, insurance, vehicle registration), Day 4: Insurance verification through carrier, Day 5: Short road test (30min observation of driving safety, loading efficiency, customer interaction), Day 6-7: Start date scheduling. Total process: applicant to first shift within 7 days",
      "Target Experienced Parcel Drivers: Recruit drivers with prior Amazon DSP, FedEx Ground, UPS, or USPS experience. They already know: package scanning systems, route density optimization, apartment delivery protocols, customer service standards, time management for 150-300 stops/day. Training time reduced from 2 weeks to 2 days",
      "Maintain Bench List of Standbys: Keep active roster of 3-5 backup drivers in every city where you hold contracts. Pay them $50-75 to stay on call weekly, or offer guaranteed 1 day/week minimum. Cost: $200-300/month insurance against route coverage failures. Never lose a contract because one driver called in sick",
      "Implement Contractor Management: Use onboarding, scheduling, and compliance services to automate payments and reduce misclassification risk when working with independent contractors",
      "Add Non-Owned Auto Liability & General Liability: Protect the company when subcontractors drive their own vehicles. Non-owned auto liability covers accidents in contractor-owned vehicles, general liability covers facility access and loading dock work",
      "Choose Specialization Niche: Medical courier (premium pay, HIPAA compliance required), Auto parts delivery (time-sensitive, business hours), Catering/restaurant supply (early morning, heavy lifting), B2B routes (predictable, recurring) - Focus builds expertise and command premium pricing",
      "Small Fleet Package: Driver Resources → Curated Bundles → Add 1-3 Drivers Bundle ($1,500-3,000 setup + $300-600/mo) includes Wave/QuickBooks multi-user accounting, WEX/AtoB fleet fuel cards, $1M liability insurance, fleet dashcams, Route4Me/Onfleet TMS, 1099 IC templates, occupational accident insurance for contractors, background check services",
      "Establish Invoicing & Payment Systems: Set up for direct clients and enforce payment terms consistently. Use QuickBooks Online ($30-90/mo), Wave (free), or FreshBooks ($17-55/mo). Integrate ACH/credit card processing (2.9% + 30¢), set up automated recurring invoices, maintain Net 7/14/30 terms based on client size",
      "Fleet Fuel Management: Driver Resources → Insurance & Fuel Cards has WEX Fleet Card and AtoB Fuel Card with driver spending controls, volume discounts, detailed reporting per vehicle, mobile apps for real-time fleet management",
      "Dispatch Operations: Hire in-house dispatcher ($15-20/hr or 10-15% of route revenue) OR use virtual dispatch service ($300-800/mo). Dispatcher handles customer calls, load intake, driver assignment, real-time tracking, exception management (delays, damages, customer issues)",
      "TMS (Transportation Management System) - What It Is: Software to track orders, drivers, routes, PODs (proof of delivery), invoicing, and customer communications. Essential when managing 3+ vehicles or 20+ deliveries daily",
      "TMS for Solo/2 Vehicles (Free/Low-Cost): Route4Me ($30/mo, route optimization for up to 10 stops), Onfleet ($149/mo, customer notifications and driver app), Tookan ($99/mo, dispatch management), WorkWave ($35/mo, scheduling and invoicing)",
      "TMS for Small Fleets (3-5 vehicles): Samsara ($50-100/vehicle/mo, GPS tracking + maintenance alerts), Verizon Connect ($50/vehicle/mo, fleet management), Fleetio ($4/vehicle/mo for maintenance tracking only)",
      "TMS for Larger Operations (6+ vehicles): Trimble TMS ($200+/mo, enterprise route optimization), McLeod LoadMaster (custom pricing, full freight/LTL management), TMW Systems (large carrier TMS for 20+ trucks)",
      "TMS Key Features You Need: Real-time GPS tracking for all vehicles, automated dispatch and driver assignment, customer SMS/email notifications with ETA updates, electronic proof of delivery (e-POD with photo/signature), accounting/invoicing integration, driver performance analytics (on-time %, customer ratings), maintenance scheduling and alerts",
      "Load Boards - What They Are: Digital marketplaces where shippers and freight brokers post available loads. Drivers/carriers bid or accept posted rates. Typically pays $1.50-$3.50/mile (higher than gig apps) but requires negotiation skills and MC Authority",
      "Courier & Freight Load Boards: DAT Load Board ($40-150/mo, largest network with 400M+ loads/year), Truckstop.com ($50-100/mo, broker credit ratings), 123Loadboard ($30/mo, budget option), Coyote Load Board (free for approved carriers), uShip (auction-based for specialty freight)",
      "Load Board Strategy: Get MC Authority first (required for most boards, 90-day application via FMCSA), start with partial loads (LTL) to build broker relationships, never accept first offer (counter 10-20% higher), verify broker credit score on DAT/Truckstop (avoid F-rated brokers who don't pay), understand Quick Pay (2-5% fee for same-day payment) vs Net 30 (standard 30-day payment terms)",
      "Working with Brokers vs Direct Shippers: Freight Brokers take 15-30% margin but provide consistent daily volume and handle billing/collections, Direct Shippers (manufacturers, retailers) pay better rates but harder to find and slower to onboard (30-90 day contract process). Mix both: 60-70% broker loads for stability + 30-40% direct shippers for higher margins",
      "Broker Rate Negotiation Tactics: Research market rates on DAT RateView before accepting, never accept first offer (broker expects negotiation), counter 10-20% higher than initial offer, build relationships with 3-5 reliable brokers who post consistent lanes, get all payment terms in writing before accepting load, ask about accessorial fees (detention, layover, TONU)",
      "Standardize Route Design & Operations: Optimize vehicle assignments, load procedures, route sequences to reduce idle time and overtime across fleet. Review routes weekly to eliminate excessive left turns, deadhead miles, long cross-town jumps. Reduce miles by 10-15% = fuel savings + more deliveries per day",
      "Track Driver Performance Comprehensively: Monitor on-time percentage (target 98%+), customer feedback, POD completeness, safety incidents. Coach weekly on performance metrics and improvement areas",
      "Offer Performance Incentives: Tie bonuses to safety, on-time delivery (98%+), POD quality, five-star reviews to raise standards across fleet. Examples: +$50-100/week for perfect on-time rate, +$25-50/week for 100% scan accuracy, +$50/week for zero customer complaints",
      "Quality Management & KPIs: Track on-time delivery % (target 98%+), claims/damage rate (target <0.5%), cost per mile (fuel + maintenance + driver pay), revenue per vehicle per day (target $300-600 for van, $500-$1,000 for box truck), driver performance scores (customer ratings, safety incidents)",
      "Sales Pipeline for Direct Contracts: Maintain consistent outreach to potential clients (5-10 cold calls/emails daily), use CRM (HubSpot free tier, Zoho $14/mo) to track leads and follow-ups, create case studies from successful deliveries, attend local Chamber of Commerce and industry trade shows, offer trial period (first 5 deliveries at 10-15% discount) to prove reliability",
      "Compliance & Renewals Calendar: Set annual reminders for commercial insurance renewals (45 days before expiration), DOT vehicle inspections (if applicable), business license renewals, workers comp audits, ELD provider subscription renewals, maintain DOT drug testing consortium enrollment if applicable",
      "Entity & Tax Optimization: Consider S-Corp election once net profit exceeds $60,000/year (can save 10-15% on self-employment taxes), work with logistics-focused CPA to maximize deductions (Section 179 vehicle depreciation, home office, meals, phone, mileage), implement quarterly tax payments to avoid penalties, separate owner salary from business distributions",
      "Fleet Expansion Decision: Assess current vehicle utilization (if 80%+ capacity consistently for 90 days = time to expand), review Personal Credit scores for vehicle financing approval (680+ credit = better rates), calculate ROI on additional vehicle (projected revenue $8,000-$12,000/mo minus payment $500-$1,500, insurance $400-$800, driver pay $3,000-$5,000, fuel/maintenance $1,500-$2,500 = net profit target $1,000-$3,000/vehicle/mo)",
      "Growth Levers to Consider: Add dedicated routes with recurring clients (predictable revenue), lease cross-dock warehouse space for consolidation (200-1,000 sq ft = $400-$1,500/mo), pursue niche verticals (medical specimens, white-glove furniture, construction materials), expand to adjacent cities (Dallas → Austin corridor), acquire competitor routes or small courier companies",
      "Build Cash Reserves Before Scaling: Maintain 3-6 months operating expenses ($10,000-$50,000 depending on fleet size), vehicle maintenance emergency fund ($2,000-$5,000 per vehicle annually), expansion capital for down payments on new vehicles ($10,000-$25,000 per vehicle)",
      "Establish Professional Invoicing: Driver Resources → Financial Tools has QuickBooks Online ($30-90/mo for multi-user), Wave (free with transaction fees), FreshBooks ($17-55/mo) for accounting and invoicing, integrate ACH/credit card processing (2.9% + 30¢ per transaction), set up automated recurring invoices for contract clients, maintain Net 7/14/30 payment terms based on client size",
      "Geographic Expansion Strategy: Expand into new cities by researching underserved areas, testing routes with on-demand platforms, and hiring remotely through local job boards. Target second-tier and third-tier cities with high e-commerce shipping growth but less competition than major metros. Examples: Austin vs Dallas, Tampa vs Miami, Sacramento vs San Francisco. Research using: Census data (population growth 5%+ annually), Amazon warehouse locations (new facilities = route opportunities), local courier competition (fewer = better entry), cost of living (lower = easier to find drivers at competitive pay)",
      "Test New Markets Before Committing: Before signing long-term contracts in new city, test with: 30-day temporary driver hire (Craigslist 'Gig' section, offer $150-200/day for trial period), small 2-week pilot contract (prove you can deliver before committing to 6-12 month contract), backup plan (identify 2-3 local drivers to call if your driver quits). If test succeeds, then commit capital",
      "Dispatcher Role Trigger Point: Once you reach 5 active routes running simultaneously, hire dedicated dispatcher role. Cost: $15-20/hr (full-time $2,400-3,200/month) or virtual dispatcher service ($300-800/mo). Dispatcher ROI: handles real-time driver support, customer update calls, exception management (delays, damages, missed pickups), route backup coordination. Frees you to focus on sales and growth",
      "Business Growth Cycle (Repeat Until Target): Step 1: Win new route (via sales outreach or platform application), Step 2: Assign reliable driver (from bench list or recruit), Step 3: Protect the margin (monitor driver performance, client satisfaction weekly), Step 4: Measure performance (on-time %, customer feedback, margin per route), Step 5: Add one more route. Repeat this cycle until weekly company margin alone meets or exceeds $2,500 (= $10,000/month target without you delivering)",
    ]
  },
  { id: "maintenance", label: "19) Ongoing Compliance & Platform Maintenance",
    description: "Keep your DriverGigsPro account and business running smoothly with regular compliance reviews.",
    items: [
      "Weekly Review Cycle: Review reminders, update company statuses, check analytics, complete any outstanding applications",
      "Monthly Maintenance: Update vehicle maintenance records, certification renewals, reconcile monthly income/expenses, review driver performance if applicable",
      "Quarterly Compliance Check: Review business entity compliance (annual reports), tax obligations (quarterly tax payments), insurance coverage adequacy, platform performance analysis",
      "Annual Strategic Review: Assess growth goals, insurance policy renewals (45 days before expiration), platform strategy, DOT vehicle inspections (if applicable), business license renewals, workers comp audits, ELD provider subscriptions",
      "Compliance Calendar Automation: Set annual reminders for commercial insurance renewals (45 days before expiration), DOT vehicle inspections (if applicable), business license renewals, workers comp audits, ELD provider subscription renewals, maintain DOT drug testing consortium enrollment if applicable",
      "Continuous Updates: Maintain document uploads, profile accuracy, background check renewals, MVR monitoring",
    ]
  },
];

function useLocalState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

interface ChecklistMap { [stepId: string]: boolean[]; }
const cx = (...xs: Array<string|false|undefined>) => xs.filter(Boolean).join(" ");

function Checklist({ stepId, items, state, setState }: {
  stepId: string; items: readonly string[];
  state: ChecklistMap; setState: React.Dispatch<React.SetStateAction<ChecklistMap>>;
}) {
  const flags = useMemo(() => {
    const current = state[stepId] || [];
    if (current.length === items.length) return current;
    return Array.from({ length: items.length }, (_, i) => current[i] || false);
  }, [items.length, stepId, state]);
  
  useEffect(() => {
    const current = state[stepId] || [];
    if (!state[stepId] || current.length !== items.length) {
      const resized = Array.from({ length: items.length }, (_, i) => current[i] || false);
      setState(prev => ({ ...prev, [stepId]: resized }));
    }
  }, [items.length, stepId, state, setState]);
  const toggle = (idx: number) => {
    setState(prev => {
      const arr = [...(prev[stepId] || [])];
      arr[idx] = !arr[idx];
      return { ...prev, [stepId]: arr };
    });
  };
  return (
    <ul className="space-y-3 mt-4">
      {items.map((text, i) => (
        <li key={i} className="flex items-start gap-3">
          <button
            onClick={() => toggle(i)}
            className={cx(
              "mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors",
              flags[i] ? "bg-black border-black" : "bg-white border-gray-300"
            )}
            aria-pressed={flags[i]}
            aria-label={flags[i] ? "Mark as incomplete" : "Mark as complete"}
          >
            {flags[i] && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
          <span className={cx("text-sm md:text-base", flags[i] && "line-through text-gray-400")}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function StepByStepInstructions() {
  const [state, setState] = useLocalState<ChecklistMap>("driver-steps-v1", {});
  const [activeId, setActiveId] = useState<string>(steps[0].id);
  const progress = useMemo(() =>
    steps.map(s => {
      const arr = state[s.id] || [];
      const done = arr.filter(Boolean).length;
      return { id: s.id, pct: s.items.length ? done / s.items.length : 0 };
    }), [state]
  );
  const activeStep = steps.find(s => s.id === activeId) || steps[0];
  
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/download/step-by-step-pdf');
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DriverGigsPro-Step-by-Step-Instructions.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show helpful message
      setTimeout(() => {
        alert('File downloaded! Open it in your browser and use Print → Save as PDF to create a PDF version.');
      }, 500);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] min-h-screen bg-white text-gray-900">
      <aside className="border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-3">Step by Step Instructions</h2>
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
        <nav>
          {steps.map(s => {
            const pct = Math.round((progress.find(p => p.id === s.id)?.pct || 0) * 100);
            return (
              <button key={s.id} onClick={() => setActiveId(s.id)}
                className={cx(
                  "w-full text-left px-4 py-3 border-t border-gray-100 transition-all duration-200",
                  activeId === s.id 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-sm" 
                    : "hover:bg-gray-50 hover:border-l-2 hover:border-l-gray-300"
                )}>
                <div className="flex items-center justify-between">
                  <span className={cx(
                    "font-medium transition-colors",
                    activeId === s.id ? "text-blue-900" : "text-gray-700"
                  )}>{s.label}</span>
                  <span className={cx(
                    "text-xs font-semibold px-2 py-1 rounded-full transition-colors",
                    activeId === s.id 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-gray-100 text-gray-500"
                  )}>{pct}%</span>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="p-6 md:p-8">
        <h1 className="text-xl font-bold">{activeStep.label}</h1>
        {activeStep.description && (
          <p className="mt-2 text-gray-600 text-sm">{activeStep.description}</p>
        )}
        {activeStep.cta && (
          <div className="mt-4">
            <a href={activeStep.cta.href} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {activeStep.cta.text}
            </a>
          </div>
        )}
        <Checklist stepId={activeStep.id} items={activeStep.items} state={state} setState={setState} />
      </main>
    </div>
  );
}