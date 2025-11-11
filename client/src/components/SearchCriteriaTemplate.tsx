import React from "react";
import { ArrowLeft, Search, Shield, CheckCircle, XCircle, FileText, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SearchCriteriaConfig } from "@/lib/searchCriteriaConfig";
import { RESPONSIVE_GRIDS, TOUCH_FRIENDLY, CONTAINER } from "@/lib/responsive-utils";

interface SearchCriteriaTemplateProps {
  config: SearchCriteriaConfig;
}

export default function SearchCriteriaTemplate({ config }: SearchCriteriaTemplateProps) {
  const Icon = config.icon;

  // Split search terms into two columns
  const midpoint = Math.ceil(config.searchTerms.length / 2);
  const leftColumn = config.searchTerms.slice(0, midpoint);
  const rightColumn = config.searchTerms.slice(midpoint);

  return (
    <div className={`min-h-screen bg-gray-50 ${CONTAINER.default} py-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Link href="/search-criteria">
          <Button variant="outline" size="sm" className={TOUCH_FRIENDLY.button}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Search Criteria</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${config.iconColor}`} />
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            {config.title} - Search Criteria
          </h1>
        </div>
      </div>

      {/* Overview Stats */}
      <Card className={`mb-6 ${config.cardColor}`}>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className={`h-4 w-4 ${config.iconColor}`} />
            <h2 className="text-base md:text-lg font-semibold">{config.title} Overview</h2>
          </div>
          <div className={RESPONSIVE_GRIDS.threeCol}>
            {config.stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.count}{stat.label.includes("%") ? "%" : ""}
                </div>
                <div className="text-xs text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Terms */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${config.textColor}`}>
            <Search className="h-5 w-5" />
            {config.title} Search Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={RESPONSIVE_GRIDS.twoCol}>
            <div className="space-y-2">
              {leftColumn.map((term, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className={`w-2 h-2 ${config.iconColor.replace("text-", "bg-")} rounded-full`}></div>
                  {term}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {rightColumn.map((term, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <div className={`w-2 h-2 ${config.iconColor.replace("text-", "bg-")} rounded-full`}></div>
                  {term}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements & Insights Grid */}
      <div className={`${RESPONSIVE_GRIDS.twoCol} mb-6`}>
        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              {config.requirements.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {config.requirements.items.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Shield className="h-5 w-5" />
              {config.insights.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {config.insights.items.map((insight, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <FileText className="h-5 w-5" />
            {config.tips.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={RESPONSIVE_GRIDS.twoCol}>
            {config.tips.items.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5"></div>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button Footer */}
      <div className="mt-6 flex justify-center">
        <Link href="/search-criteria">
          <Button variant="outline" className={TOUCH_FRIENDLY.button}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to All Search Criteria
          </Button>
        </Link>
      </div>
    </div>
  );
}
