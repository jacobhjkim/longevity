CREATE TABLE "cursor_table" (
	"interval" text NOT NULL,
	"server" text NOT NULL,
	"status" text NOT NULL,
	"total" integer NOT NULL,
	"cursor" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "papers_table" (
	"doi" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"abstract" text NOT NULL,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"server" text NOT NULL,
	"is_relevant" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "result_table" (
	"id" text PRIMARY KEY NOT NULL,
	"paper_doi" text,
	"result" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "result_table" ADD CONSTRAINT "result_table_paper_doi_papers_table_doi_fk" FOREIGN KEY ("paper_doi") REFERENCES "public"."papers_table"("doi") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cursor_index" ON "cursor_table" USING btree ("server","interval");--> statement-breakpoint
CREATE INDEX "server_index" ON "cursor_table" USING btree ("server");--> statement-breakpoint
CREATE INDEX "status_index" ON "cursor_table" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "doi_index" ON "papers_table" USING btree ("doi");--> statement-breakpoint
CREATE INDEX "date_index" ON "papers_table" USING btree ("date");--> statement-breakpoint
CREATE INDEX "relevant_index" ON "papers_table" USING btree ("is_relevant");--> statement-breakpoint
CREATE INDEX "paper_doi_index" ON "result_table" USING btree ("paper_doi");