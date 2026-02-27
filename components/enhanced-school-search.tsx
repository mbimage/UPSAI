"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, School, Users, Search } from "lucide-react"
import { debounce } from "lodash"

interface TexasHighSchool {
  id: string
  name: string
  district: string
  city: string
  county: string
  region: number
  classification: string
  enrollment: number
  is_rural: boolean
}

interface EnhancedSchoolSearchProps {
  value: string
  onChange: (school: string) => void
  placeholder?: string
  className?: string
}

export function EnhancedSchoolSearch({
  value,
  onChange,
  placeholder = "Type your Texas high school name...",
  className = "",
}: EnhancedSchoolSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value)
  const [suggestions, setSuggestions] = useState<TexasHighSchool[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/schools/search?q=${encodeURIComponent(query)}&limit=12&prioritize_rural=true`,
        )
        const data = await response.json()

        if (data.success) {
          setSuggestions(data.schools)
        } else {
          setSuggestions([])
        }
      } catch (error) {
        console.error("School search error:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  useEffect(() => {
    if (searchTerm !== value) {
      setSearchTerm(value)
    }
  }, [value])

  useEffect(() => {
    debouncedSearch(searchTerm)
    setShowSuggestions(searchTerm.length > 0)
  }, [searchTerm, debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    onChange(newValue)
  }

  const handleSchoolSelect = (school: TexasHighSchool) => {
    const schoolName = school.name
    setSearchTerm(schoolName)
    onChange(schoolName)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleInputFocus = () => {
    if (searchTerm.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="school-search" className="text-neon-200 font-medium flex items-center gap-2">
        <School className="w-4 h-4" />
        Texas High School *
      </Label>

      <div className="relative">
        <div className="relative">
          <Input
            id="school-search"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className="bg-midnight-800/60 border-midnight-700 text-white placeholder-neon-400/50 focus:border-neon-500 focus:ring-neon-500/20 pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-neon-400/30 border-t-neon-400 rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-neon-400/60" />
            )}
          </div>
        </div>

        {/* Enhanced Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-midnight-800/95 border border-midnight-700 rounded-lg shadow-2xl backdrop-blur-sm max-h-80 overflow-y-auto">
            <div className="p-3 text-xs text-neon-400/70 border-b border-midnight-700 bg-midnight-900/50">
              <div className="flex items-center justify-between">
                <span>Found {suggestions.length} schools (rural schools prioritized)</span>
                <Badge variant="outline" className="border-neon-500/50 text-neon-300 text-xs">
                  Texas Schools
                </Badge>
              </div>
            </div>

            {suggestions.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => handleSchoolSelect(school)}
                className="w-full text-left px-4 py-3 hover:bg-midnight-700/60 transition-colors border-b border-midnight-700/50 last:border-b-0 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white group-hover:text-neon-300 transition-colors truncate">
                        {school.name}
                      </h4>
                      {school.is_rural && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                          Rural
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neon-400/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {school.city}, {school.county} County
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{school.enrollment} students</span>
                      </div>
                    </div>

                    <div className="text-xs text-neon-500/60 mt-1">
                      {school.district} • Region {school.region} • Class {school.classification}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {suggestions.length === 12 && (
              <div className="p-3 text-xs text-neon-400/70 text-center border-t border-midnight-700 bg-midnight-900/30">
                Keep typing to see more specific results...
              </div>
            )}
          </div>
        )}

        {/* No Results Message */}
        {showSuggestions && searchTerm.length > 2 && suggestions.length === 0 && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-midnight-800/95 border border-midnight-700 rounded-lg shadow-2xl backdrop-blur-sm p-4">
            <div className="text-center">
              <School className="w-8 h-8 text-neon-400/50 mx-auto mb-2" />
              <p className="text-sm text-neon-300 mb-1">School not found in our database</p>
              <p className="text-xs text-neon-400/70">
                No worries! You can still type your school's full name and we'll save it for future students.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-neon-400/70">
        🎯 <strong>Rural Texas schools are prioritized</strong> in search results. If your school isn't listed, just
        type the full name - we'll add it to help future students!
      </p>
    </div>
  )
}
