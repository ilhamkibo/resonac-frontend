import React from "react";

type SectionAreaProps = {
  area: string;
  children: React.ReactNode;
};

export default function SectionArea({ area, children }: SectionAreaProps) {
  return (
    <section className="relative rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
      {/* Label di atas box */}
      <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">
        {area}
      </div>
      {children}
    </section>
  );
}
