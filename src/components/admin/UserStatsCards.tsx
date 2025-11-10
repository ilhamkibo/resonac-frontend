import { User2Icon, CheckCircleIcon, XCircleIcon, LucideGauge } from "lucide-react";
import StatsCard from "./StatsCard";

interface Props {
  userStats?: {
    userCount?: number;
    approvedUserCount?: number;
    unapprovedUserCount?: number;
  };
  isLoading: boolean;
}

export default function UserStatsCards({ userStats, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <StatsCard
        icon={<User2Icon className="w-8 h-8 text-gray-600 dark:text-gray-300" />}
        label="Total User"
        value={userStats?.userCount}
        color="bg-brand-300 dark:bg-brand-700"
        isLoading={isLoading}
      />
      <StatsCard
        icon={<LucideGauge className="w-8 h-8 text-blue-600 dark:text-blue-200" />}
        label="Max User"
        value={10}
        color="bg-blue-100 dark:bg-blue-700"
        isLoading={isLoading}
      />
      <StatsCard
        icon={<CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-200" />}
        label="Approved User"
        value={userStats?.approvedUserCount}
        color="bg-green-100 dark:bg-green-700"
        isLoading={isLoading}
      />
      <StatsCard
        icon={<XCircleIcon className="w-8 h-8 text-red-600 dark:text-red-200" />}
        label="Unapproved User"
        value={userStats?.unapprovedUserCount}
        color="bg-red-100 dark:bg-red-700"
        isLoading={isLoading}
      />
    </div>
  );
}
