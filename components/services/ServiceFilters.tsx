"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ServiceFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSearch: (query: string) => void;
}

export interface FilterState {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  sortBy: string;
}

const categories = [
  { value: "DESIGN", label: "Desain" },
  { value: "DATA", label: "Data" },
  { value: "CODING", label: "Pemrograman" },
  { value: "WRITING", label: "Penulisan" },
  { value: "EVENT", label: "Acara" },
  { value: "TUTOR", label: "Tutor" },
  { value: "TECHNICAL", label: "Teknis" },
  { value: "OTHER", label: "Lainnya" },
];

const ServiceFilters = ({ onFilterChange, onSearch }: ServiceFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "newest",
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);

    const newFilters = {
      ...filters,
      priceMin: value[0] > 0 ? value[0] : undefined,
      priceMax: value[1] < 5000000 ? value[1] : undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = { sortBy: "newest" };
    setFilters(resetFilters);
    setPriceRange([0, 5000000]);
    setVerifiedOnly(false);
    onFilterChange(resetFilters);
    onSearch("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Kategori</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            handleFilterChange("category", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Harga</Label>
        <div className="pt-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={5000000}
            step={100000}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Rating Minimum</Label>
        <Select
          value={filters.ratingMin?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "ratingMin",
              value === "all" ? undefined : Number(value)
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rating</SelectItem>
            <SelectItem value="4.5">4.5+ ⭐</SelectItem>
            <SelectItem value="4.0">4.0+ ⭐</SelectItem>
            <SelectItem value="3.5">3.5+ ⭐</SelectItem>
            <SelectItem value="3.0">3.0+ ⭐</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
        />
        <label
          htmlFor="verified"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Hanya penyedia terverifikasi
        </label>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={handleReset}
      >
        Reset Filter
      </Button>
    </div>
  );
};

export default ServiceFilters;
