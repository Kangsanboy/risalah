import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/index.ts';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  searchPlaceholder?: string;
  itemsPerPage?: number;
}

export function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = "Search records...",
  itemsPerPage = 10,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ 
    key: '', 
    direction: null 
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filtering
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some(
          (val) => val && val.toString().toLowerCase().includes(lowerSearch)
        )
      );
    }

    // Sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border-emerald-100 focus-visible:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Showing {paginatedData.length} of {filteredAndSortedData.length} records</span>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-emerald-50/50">
            <TableRow className="hover:bg-transparent border-emerald-100">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "py-4 text-emerald-900 font-semibold",
                    column.sortable && "cursor-pointer select-none",
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            "h-3 w-3 -mb-1",
                            sortConfig.key === column.key && sortConfig.direction === 'asc' ? "text-emerald-600" : "text-emerald-300"
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            "h-3 w-3",
                            sortConfig.key === column.key && sortConfig.direction === 'desc' ? "text-emerald-600" : "text-emerald-300"
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && (
                <TableHead className="text-right py-4 text-emerald-900 font-semibold">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow 
                  key={item.id || index} 
                  className="border-emerald-50 hover:bg-emerald-50/30 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("py-4", column.className)}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-emerald-600 hover:bg-emerald-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 border-emerald-100">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {onEdit && (
                            <DropdownMenuItem 
                              onClick={() => onEdit(item)}
                              className="cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem 
                              onClick={() => onDelete(item.id)}
                              className="cursor-pointer text-destructive focus:bg-rose-50 focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  No results found for your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "h-8 w-8 p-0",
                        currentPage === page 
                          ? "bg-emerald-700 text-white hover:bg-emerald-800" 
                          : "hover:bg-emerald-50 hover:text-emerald-700 text-muted-foreground"
                      )}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
