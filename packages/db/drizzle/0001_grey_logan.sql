ALTER TABLE "papers_table" ADD COLUMN "is_processed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "processed_index" ON "papers_table" USING btree ("is_processed");