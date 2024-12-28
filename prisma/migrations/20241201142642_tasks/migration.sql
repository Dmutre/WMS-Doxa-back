-- CreateFunction
CREATE OR REPLACE FUNCTION gen_code()
RETURNS TEXT AS $$
BEGIN
    RETURN to_char(CURRENT_DATE, 'YYMMDD') || 
           upper(substr(md5(random()::text), 1, 4));
END;
$$ LANGUAGE plpgsql;

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('BACKLOG', 'PLANNED', 'IN_PROGRESS', 'DONE', 'CANCELED');

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL DEFAULT gen_code(),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(4000),
    "status" "TaskStatus" NOT NULL,
    "is_overdue" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER,
    "estimate" INTEGER,
    "spent" INTEGER,
    "start_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "assignee_id" TEXT,
    "reporter_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
