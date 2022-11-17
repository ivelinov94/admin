-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_userId_fkey";

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
