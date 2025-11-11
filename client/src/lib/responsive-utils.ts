// Responsive grid utility helpers for mobile-first design across the app
export const RESPONSIVE_GRIDS = {
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
