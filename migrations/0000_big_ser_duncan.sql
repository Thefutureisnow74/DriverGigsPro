CREATE TABLE "admin_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_user_id" varchar NOT NULL,
	"target_user_id" varchar,
	"action" text NOT NULL,
	"details" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"position" text NOT NULL,
	"status" text DEFAULT 'Interested' NOT NULL,
	"workflow_status" text,
	"date_added" timestamp DEFAULT now(),
	"date_applied" timestamp,
	"date_accepted" timestamp,
	"notes" text,
	"follow_up_date" timestamp,
	"interview_date" timestamp,
	"reminder_notes" text,
	"priority" text DEFAULT 'Medium',
	"last_contact_date" timestamp,
	"on_waiting_list" boolean DEFAULT false,
	"active_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "banking_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"provider" text NOT NULL,
	"institution_id" text,
	"institution_name" text,
	"access_token" text,
	"item_id" text,
	"accounts" jsonb,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_entity_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"document_name" text NOT NULL,
	"document_type" text NOT NULL,
	"file_url" text,
	"google_file_link" text,
	"document_category" text NOT NULL,
	"notes" text,
	"issued_date" date,
	"expiry_date" date,
	"status" text DEFAULT 'active',
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" text NOT NULL,
	"business_type" text NOT NULL,
	"registered_agent" text,
	"registered_agent_address" text,
	"registered_agent_city" text,
	"registered_agent_state" text,
	"registered_agent_zip_code" text,
	"registered_agent_phone" text,
	"sos_file_number" text,
	"sos_file_link" text,
	"formation_date" date,
	"company_address" text,
	"mailbox_provider" text,
	"mailbox_provider_website" text,
	"mailbox_provider_login" text,
	"company_phone" text,
	"phone_provider" text,
	"ein" text,
	"state_of_organization" text,
	"current_managing_members" text[],
	"banking" text,
	"status" text DEFAULT 'active',
	"organizer" text,
	"website" text,
	"website_host" text,
	"website_host_login" text,
	"email" text,
	"email_login" text,
	"franchise_tax_filing_date" date,
	"franchise_tax_login" text,
	"franchise_tax_number" text,
	"franchise_xt_number" text,
	"dun_bradstreet_number" text,
	"dun_bradstreet_website" text,
	"nicis" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_formation_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" text NOT NULL,
	"business_name" text NOT NULL,
	"domain_name" text,
	"domain_provider" text,
	"gmail_account" text,
	"youtube_channel" text,
	"facebook_page" text,
	"tiktok_username" text,
	"trademark_status" text,
	"trademark_number" text,
	"trademark_filing_date" date,
	"executive_summary" text,
	"business_description" text,
	"services_offered" text,
	"target_market" text,
	"market_size" text,
	"competitive_analysis" text,
	"competitive_advantage" text,
	"marketing_strategy" text,
	"sales_strategy" text,
	"operations_plan" text,
	"management_team" text,
	"organization_structure" text,
	"startup_costs" text,
	"monthly_expenses" text,
	"revenue_projections" text,
	"break_even_analysis" text,
	"funding_requirements" text,
	"risk_analysis" text,
	"growth_strategy" text,
	"exit_strategy" text,
	"business_model" text,
	"marketing_plan" text,
	"entity_type" text,
	"tax_structure" text,
	"ownership_structure" text,
	"liability_protection" text,
	"registered_agent" text,
	"registered_agent_service" text,
	"business_address" text,
	"mailbox_service" text,
	"mailbox_provider" text,
	"operating_agreement_status" text,
	"member_roles" text,
	"profit_distribution" text,
	"voting_procedures" text,
	"vehicle_type" text,
	"vehicle_year" text,
	"vehicle_make" text,
	"vehicle_model" text,
	"insurance_provider" text,
	"equipment_needed" text,
	"filing_state" text,
	"ein_number" text,
	"business_phone" text,
	"listing_service" text,
	"sos_file_number" text,
	"asset_protection_plan" text,
	"business_insurance" text,
	"personal_asset_separation" text,
	"state_tax_registration" text,
	"federal_tax_setup" text,
	"accounting_method" text,
	"quarterly_payments" text,
	"retirement_plan" text,
	"business_bank_account" text,
	"merchant_account" text,
	"business_credit" text,
	"accounting_system" text,
	"business_licenses" text,
	"general_liability" text,
	"professional_liability" text,
	"industry_permits" text,
	"logo_design" text,
	"trademark_application" text,
	"brand_guidelines" text,
	"brand_assets" text,
	"website_url" text,
	"business_email" text,
	"domain_registration" text,
	"digital_business_cards" text,
	"facebook_business" text,
	"linkedin_profile" text,
	"youtube_channel_business" text,
	"instagram_business" text,
	"tiktok_business" text,
	"completed_steps" jsonb DEFAULT '[]'::jsonb,
	"completed_sub_tasks" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_formation_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"business_id" varchar NOT NULL,
	"step_id" integer NOT NULL,
	"step_title" text NOT NULL,
	"is_completed" boolean DEFAULT false,
	"completed_tasks" jsonb,
	"form_data" jsonb,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"vehicle_types" text[],
	"average_pay" text,
	"service_vertical" text NOT NULL,
	"contract_type" text NOT NULL,
	"areas_served" text[],
	"insurance_requirements" text,
	"license_requirements" text,
	"certifications_required" text[],
	"website" text,
	"contact_email" text,
	"contact_phone" text,
	"description" text,
	"logo_url" text,
	"workflow_status" text,
	"year_established" text,
	"company_size" text,
	"headquarters" text,
	"business_model" text,
	"company_mission" text,
	"target_customers" text,
	"company_culture" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "company_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"company_id" integer NOT NULL,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"date_called" timestamp NOT NULL,
	"message_left" text,
	"response" text,
	"notes" text,
	"follow_up_required" boolean DEFAULT false,
	"follow_up_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"vertical" text NOT NULL,
	"duration_minutes" integer,
	"difficulty" text DEFAULT 'Beginner',
	"thumbnail_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"expiration_date" timestamp,
	"is_verified" boolean DEFAULT false,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "earnings_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"company_id" integer,
	"company_name" text NOT NULL,
	"data_source" text NOT NULL,
	"date" date NOT NULL,
	"daily_earnings" numeric(10, 2),
	"weekly_earnings" numeric(10, 2),
	"monthly_earnings" numeric(10, 2),
	"trip_count" integer,
	"delivery_count" integer,
	"rating" numeric(3, 2),
	"acceptance_rate" numeric(5, 2),
	"completion_rate" numeric(5, 2),
	"online_hours" numeric(5, 2),
	"active_hours" numeric(5, 2),
	"miles_driven" numeric(8, 2),
	"raw_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"category" text,
	"receipt_url" text,
	"mileage" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fuel_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"card_name" text NOT NULL,
	"provider" text NOT NULL,
	"card_type" text NOT NULL,
	"card_number" text NOT NULL,
	"expiry_date" text,
	"status" text DEFAULT 'active',
	"credit_limit" numeric(10, 2) DEFAULT '0',
	"monthly_limit" numeric(10, 2) DEFAULT '0',
	"balance" numeric(10, 2) DEFAULT '0',
	"monthly_spent" numeric(10, 2) DEFAULT '0',
	"last_used" timestamp,
	"pin_required" boolean DEFAULT false,
	"restrictions" text[],
	"rewards" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_search_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"application_id" integer NOT NULL,
	"company_id" integer NOT NULL,
	"date_applied" timestamp,
	"contact_date" timestamp,
	"interview_date" timestamp,
	"contact_name" text,
	"phone_number" text,
	"email_address" text,
	"person_spoken_with" text,
	"conversation_summary" text,
	"notes" text,
	"follow_up_date" timestamp,
	"follow_up_reminder" boolean DEFAULT false,
	"reminder_date" timestamp,
	"reminder_time" varchar,
	"reminder_text" text,
	"application_status" text DEFAULT 'Applied',
	"is_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "oauth_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"platform" text NOT NULL,
	"oauth_provider" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"token_expiry" timestamp,
	"account_id" text,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"email" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "progress_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"export_id" integer NOT NULL,
	"commenter_name" varchar,
	"commenter_email" varchar,
	"comment" text NOT NULL,
	"is_private" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "progress_exports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"export_type" text NOT NULL,
	"export_format" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"export_data" jsonb NOT NULL,
	"share_token" varchar,
	"is_public" boolean DEFAULT false,
	"allow_comments" boolean DEFAULT false,
	"expires_at" timestamp,
	"download_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "progress_exports_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_progress_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"export_id" integer NOT NULL,
	"accessor_email" varchar,
	"accessor_name" varchar,
	"access_type" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"accessed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sync_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"company_id" integer,
	"company_name" text NOT NULL,
	"sync_enabled" boolean DEFAULT false,
	"sync_method" text,
	"auto_sync_interval" integer DEFAULT 24,
	"last_sync_attempt" timestamp,
	"last_successful_sync" timestamp,
	"sync_errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"background_color" text DEFAULT '#f8fafc',
	"position" integer DEFAULT 0,
	"is_starred" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_card_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"card_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_path" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 0,
	"priority" text DEFAULT 'Medium',
	"start_date" timestamp,
	"due_date" timestamp,
	"reminder_days" integer DEFAULT 1,
	"completed_date" timestamp,
	"labels" text[],
	"assigned_to" text,
	"cover_image" text,
	"attachments" text[],
	"checklist" jsonb,
	"comments" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"title" text NOT NULL,
	"position" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"action" text NOT NULL,
	"resource" text,
	"resource_id" text,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"session_id" varchar,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_course_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"progress" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"started_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"active_jobs" integer DEFAULT 0,
	"weekly_earnings" numeric(10, 2) DEFAULT '0',
	"total_applications" integer DEFAULT 0,
	"completion_rate" numeric(5, 2) DEFAULT '0',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar,
	"profile_image" text,
	"profile_completion" integer DEFAULT 0,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"phone" varchar,
	"address" text,
	"city" varchar,
	"state" varchar(2),
	"zip_code" varchar(10),
	"date_of_birth" date,
	"bio" text,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"file_name" text NOT NULL,
	"original_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_path" text NOT NULL,
	"document_category" text NOT NULL,
	"upload_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"nickname" text NOT NULL,
	"year" text NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"color" text,
	"vin" text,
	"license_plate" text,
	"state" text,
	"mileage" integer DEFAULT 0,
	"fuel_type" text DEFAULT 'Gasoline',
	"mpg" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"registration_expiry" timestamp,
	"inspection_expiry" timestamp,
	"insurance_expiry" timestamp,
	"last_maintenance" timestamp,
	"next_maintenance_due" timestamp,
	"purchase_date" timestamp,
	"purchase_price" numeric(10, 2) DEFAULT '0',
	"current_value" numeric(10, 2) DEFAULT '0',
	"date_of_entry" timestamp,
	"monthly_payment" numeric(10, 2) DEFAULT '0',
	"active_apps" text[],
	"total_length" numeric(8, 1),
	"cubic_feet" numeric(8, 1),
	"inside_length" numeric(8, 1),
	"inside_width" numeric(8, 1),
	"interest_rate" numeric(8, 2),
	"loan_term" integer,
	"finance_company" text,
	"down_payment" numeric(10, 2),
	"loan_start_date" timestamp,
	"first_payment_due" timestamp,
	"final_payment_due" timestamp,
	"remaining_balance" numeric(10, 2),
	"loan_account_number" text,
	"finance_company_phone" text,
	"finance_company_contact" text,
	"vehicle_weight" integer,
	"exterior_length" numeric(8, 1),
	"exterior_width" numeric(8, 1),
	"exterior_height" numeric(8, 1),
	"cargo_length" numeric(8, 1),
	"cargo_width" numeric(8, 1),
	"cargo_height" numeric(8, 1),
	"cargo_volume" numeric(8, 1),
	"payload_capacity" integer,
	"towing_capacity" integer,
	"engine_type" text,
	"transmission" text,
	"insurance_company_name" text,
	"insurance_type" text,
	"insurance_type_other" text,
	"insurance_monthly_premium" numeric(10, 2),
	"insurance_premium_due_date" timestamp,
	"insurance_total_coverage" numeric(12, 2),
	"insurance_phone_number" text,
	"insurance_representative_name" text,
	"insurance_policy_number" text,
	"insurance_start_date" timestamp,
	"bodily_injury_coverage_limit" text,
	"bodily_injury_premium" text,
	"bodily_injury_deductible" text,
	"property_damage_coverage_limit" text,
	"property_damage_premium" text,
	"property_damage_deductible" text,
	"personal_injury_protection_status" text DEFAULT 'REJECTED BY INSURED',
	"personal_injury_protection_limit" text,
	"personal_injury_protection_premium" text,
	"personal_injury_protection_deductible" text,
	"uninsured_motorist_bi_status" text DEFAULT 'REJECTED BY INSURED',
	"uninsured_motorist_bi_limit" text,
	"uninsured_motorist_bi_premium" text,
	"uninsured_motorist_bi_deductible" text,
	"uninsured_motorist_pd_status" text DEFAULT 'REJECTED BY INSURED',
	"uninsured_motorist_pd_limit" text,
	"uninsured_motorist_pd_premium" text,
	"uninsured_motorist_pd_deductible" text,
	"accidental_death_benefit_amount" text,
	"full_term_premium" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banking_connections" ADD CONSTRAINT "banking_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_business_entity_id_business_entities_id_fk" FOREIGN KEY ("business_entity_id") REFERENCES "public"."business_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_documents" ADD CONSTRAINT "business_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_entities" ADD CONSTRAINT "business_entities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_formation_data" ADD CONSTRAINT "business_formation_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_formation_progress" ADD CONSTRAINT "business_formation_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_actions" ADD CONSTRAINT "company_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_actions" ADD CONSTRAINT "company_actions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earnings_data" ADD CONSTRAINT "earnings_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earnings_data" ADD CONSTRAINT "earnings_data_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_search_notes" ADD CONSTRAINT "job_search_notes_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_search_notes" ADD CONSTRAINT "job_search_notes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_connections" ADD CONSTRAINT "oauth_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_comments" ADD CONSTRAINT "progress_comments_export_id_progress_exports_id_fk" FOREIGN KEY ("export_id") REFERENCES "public"."progress_exports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_exports" ADD CONSTRAINT "progress_exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shared_progress_access" ADD CONSTRAINT "shared_progress_access_export_id_progress_exports_id_fk" FOREIGN KEY ("export_id") REFERENCES "public"."progress_exports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_settings" ADD CONSTRAINT "sync_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_settings" ADD CONSTRAINT "sync_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_card_attachments" ADD CONSTRAINT "task_card_attachments_card_id_task_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."task_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_cards" ADD CONSTRAINT "task_cards_list_id_task_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."task_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_lists" ADD CONSTRAINT "task_lists_board_id_task_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."task_boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");