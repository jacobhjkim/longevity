CREATE TABLE "tweet_table" (
	"id" text PRIMARY KEY NOT NULL,
	"paper_doi" text,
	"content" text NOT NULL,
	"postedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tweet_table" ADD CONSTRAINT "tweet_table_paper_doi_papers_table_doi_fk" FOREIGN KEY ("paper_doi") REFERENCES "public"."papers_table"("doi") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tweet_paper_doi_index" ON "tweet_table" USING btree ("paper_doi");