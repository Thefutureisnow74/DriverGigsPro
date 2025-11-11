// Responsive grid utility helpers for mobile-first design across the app
export const RESPONSIVE_GRIDS = {
  // Semantic presets for common layouts
  twoCol: "grid grid-cols-1 md:grid-cols-2 gap-4",
  threeCol: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  fourCol: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  
  // Legacy aliases (kept for backward compatibility)
  cols2: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  cols2Dense: "grid grid-cols-1 sm:grid-cols-2 gap-3",
  cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  cols4: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  dense: "grid grid-cols-1 sm:grid-cols-2 gap-3",
  form: "grid grid-cols-1 md:grid-cols-2 gap-4",
};

export const RESPONSIVE_FLEX = {
  row: "flex flex-col sm:flex-row gap-3 sm:gap-4",
  wrap: "flex flex-col sm:flex-row flex-wrap gap-3",
  stack: "flex flex-col gap-3",
  // Horizontal scrolling for tabs/buttons that don't fit on mobile
  tabStrip: "flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory scrollbar-hide",
};

export const TOUCH_FRIENDLY = {
  button: "min-h-[44px] px-4",
  input: "min-h-[44px]",
  select: "min-h-[44px]",
};

// Responsive container for pages that need max-width constraints
export const CONTAINER = {
  default: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  tight: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8",
  wide: "max-w-full px-4 sm:px-6 lg:px-8",
  full: "w-full", // No padding or max-width for edge-to-edge layouts
};

// Overflow prevention utilities
export const OVERFLOW = {
  // Prevent horizontal scrolling
  preventX: "overflow-x-hidden max-w-full",
  // Scrollable container with hidden scrollbar
  scrollable: "overflow-auto scrollbar-hide",
  // Scrollable horizontally only
  scrollX: "overflow-x-auto overflow-y-hidden scrollbar-hide",
  // Safe wrapper for wide content (charts, tables)
  safeWide: "w-full max-w-full overflow-x-auto",
};
