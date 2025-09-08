import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import {
  setCompleted,
  setPriority,
  setDateGte,
  setDateLte,
  setSort,
  setOrder,
  resetFilters,
} from '@/store/slices/filtersSlice';
import { setViewMode } from '@/store/slices/uiSlice';
import { Priority } from '@/types/todos';
import { RotateCcw, List, Scroll } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { viewMode } = useAppSelector((state) => state.ui);

  const handleCompletedChange = (value: string) => {
    if (value === 'all') {
      dispatch(setCompleted(undefined));
    } else {
      dispatch(setCompleted(value === 'completed'));
    }
  };

  const handlePriorityChange = (value: string) => {
    if (value === 'all') {
      dispatch(setPriority(undefined));
    } else {
      dispatch(setPriority(value as Priority));
    }
  };

  const handleSortChange = (value: string) => {
    if (value === 'none') {
      dispatch(setSort(undefined));
    } else {
      dispatch(setSort(value as 'date' | 'priority'));
    }
  };

  const handleOrderChange = (value: string) => {
    dispatch(setOrder(value as 'asc' | 'desc'));
  };

  const handleViewModeChange = (mode: 'page' | 'scroll') => {
    dispatch(setViewMode(mode));
  };

  const getCompletedValue = () => {
    if (filters.completed === undefined) return 'all';
    return filters.completed ? 'completed' : 'active';
  };

  const getPriorityValue = () => {
    return filters.priority || 'all';
  };

  const getSortValue = () => {
    return filters.sort || 'none';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View:</span>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'scroll' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('scroll')}
                className="rounded-r-none"
              >
                <Scroll className="h-4 w-4 mr-1" />
                Infinite
              </Button>
              <Button
                variant={viewMode === 'page' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('page')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-1" />
                Pages
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={getCompletedValue()} onValueChange={handleCompletedChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={getPriorityValue()} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium mb-1 block">Sort by</label>
              <Select value={getSortValue()} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order */}
            <div>
              <label className="text-sm font-medium mb-1 block">Order</label>
              <Select value={filters.order} onValueChange={handleOrderChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">From Date</label>
              <Input
                type="date"
                value={filters.dateGte || ''}
                onChange={(e) => dispatch(setDateGte(e.target.value || undefined))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">To Date</label>
              <Input
                type="date"
                value={filters.dateLte || ''}
                onChange={(e) => dispatch(setDateLte(e.target.value || undefined))}
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(resetFilters())}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
