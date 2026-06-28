/*
  Warnings:

  - Changed the type of `action` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'REGISTER', 'CREATE_ITEM', 'UPDATE_ITEM', 'DELETE_ITEM', 'RESTORE_ITEM');

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "action",
ADD COLUMN     "action" "AuditAction" NOT NULL;

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
