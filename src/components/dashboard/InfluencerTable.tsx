'use client';

import { Influencer } from "@/store/useDashboardStore";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfluencerTableProps {
  data: Influencer[];
  limit?: number;
}

type SortField = 'account' | 'total_revenue' | 'roas' | 'avg_roi';
type SortDirection = 'asc' | 'desc';

export default function InfluencerTable({ data, limit = 10 }: InfluencerTableProps) {
  const [sortField, setSortField] = useState<SortField>('total_revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  }).slice(0, limit);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-500" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4 text-cyan-400" />
      : <ArrowDown className="ml-2 h-4 w-4 text-cyan-400" />;
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-xl rounded-xl glass-card border border-white/10">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('account')}>
                    <div className="flex items-center">
                      Influencer
                      <SortIcon field="account" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-white">
                    Platform
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('total_revenue')}>
                     <div className="flex items-center">
                      Revenue
                      <SortIcon field="total_revenue" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('roas')}>
                     <div className="flex items-center">
                      ROAS
                      <SortIcon field="roas" />
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => handleSort('avg_roi')}>
                     <div className="flex items-center">
                      ROI
                      <SortIcon field="avg_roi" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {sortedData.map((person) => (
                  <tr key={person.account} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      {person.account}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                        person.platform === 'tiktok' 
                          ? "bg-pink-500/10 text-pink-400 border-pink-500/20" 
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      )}>
                        {person.platform === 'tiktok' ? 'TikTok' : 'YouTube'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      ${person.total_revenue.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      {person.roas.toFixed(2)}x
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-400 font-medium">
                      {person.avg_roi.toLocaleString()}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}