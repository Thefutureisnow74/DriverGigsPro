// Direct company extraction from PDF content
const companies = [
  {
    name: "Dropoff",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Van (less than 10 years old)",
    areasServed: "New York City, Albany, Rochester, Syracuse, Newark, Miami, Fort Lauderdale, Fort Myers, Jacksonville, Tampa, Orlando, Atlanta, Austin, Dallas, El Paso, Fort Worth, Houston, San Antonio, Los Angeles, Las Vegas, Nashville, Memphis, New Orleans, Lafayette, Philadelphia, Pittsburgh, Harrisburg, Raleigh, Durham, Chicago, Denver, Phoenix, Oklahoma City, Birmingham, Huntsville, Detroit, Grand Rapids, Lansing",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Medical Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "Washington State, Oregon, California, Nevada, Montana, Idaho, Wyoming, Utah, Arizona, Colorado, New Mexico, Kansas, Oklahoma, Texas, Minneapolis, Iowa, Missouri, Arizona, Louisiana, Wisconsin, Illinois, Mississippi, Missouri, Indiana, Tennessee, Alabama, Ohio, Georgia, Florida, New York, Pennsylvania, Virginia, North Carolina, Vermont, New Jersey, Delaware, Washington DC, New Hampshire, Massachusetts, Connecticut, Maryland, Rhode Island",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Lab Logistics",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "All 50 states",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Associated Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-Up, Mini-Van, SUV, Cargo Van, Sprinter, Box Truck",
    areasServed: "New York, Missouri, Ohio, Georgia, Massachusetts, North Carolina, Illinois, Ohio, Texas, Michigan, New Jersey, Florida, Tennessee, Minneapolis, New England, Arizona, Missouri",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Fleet Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-Up, Mini-Van, SUV, Cargo Van, Sprinter, Box Truck",
    areasServed: "New England, New Hampshire, Rhode Island",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Diligent Delivery Systems",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Cars, Pickup trucks, Open Bed, Pipe Racks, Cargo Van, Box Truck, Flatbed, Stake Bed, Trailer & Goose Neck, Tractor-Trailer Combinations",
    areasServed: "Fort Smith, Little Rock, Huntington, Huntsville, Fort Lauderdale, Jacksonville, Miami, Orlando, Pensacola, Albuquerque, Philadelphia, Pittsburg, Allentown, Bethlehem, Greensburg, Harrisburg, San Diego, Anaheim, Fresno, Atlanta, Alpharetta, Bessemer, Austin, Abilene, Dallas, Fort Worth, Grand Prairie, Houston, Indianapolis, Baltimore, Mechanicsville, New Orleans, Baton Rouge, Lafayette, Shreveport, Berlin, Hartford, Richmond, Norfolk, Newport News, Raleigh, Salt Lake City, Charlotte, Cranbury, Boston, Broomfield, New York City, Buffalo, Rochester, Detroit, Charleston, Columbia, Nashville, Chattanooga, Cookeville, Nashville, Alcoa, Knoxville, Cincinnati, Cleveland, Columbus, Delaware, Roanoke, Colorado Springs, Denver, Concord, San Antonio, Portland, Oklahoma City, Tulsa, El Paso, Las Vegas, Jackson, Pearl, Portland, Kent, Eugene, Seattle, Kent, Spokane, Louisville, Phoenix, Lubbock, Maine, McAllen, Memphis, Minneapolis, Saraland, Montgomery, New Hampshire, Salem, Renton, Paramus, Pittson, Plano, Providence, Scott",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Reliable Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Cargo Van, Box Truck",
    areasServed: "Phoenix, Scottsdale, Tucson, Flagstaff",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Senpex",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Box Truck, Cargo Van",
    areasServed: "Los Angeles, San Francisco, Sacramento, San Jose, Lake Tahoe, Palo Alto, San Diego, Las Vegas, Washington State, Texas, Georgia, New York, Ohio, North Carolina, Virginia, Massachusetts",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "CB Driver",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Minivan, Full sized SUV",
    areasServed: "All 50 states",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "MNX",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "DE, CO, IL, TX, WA, MA, CA, VT",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Fair Logistics",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "Charlotte, Raleigh, Latrobe, Mt. Pleasant, Saltsburg, Pittsburgh, Export, Monroeville, Langhorne, Baltimore, Brecksville, Cleveland, Akron, Boston, Birmingham, Florence, Huntsville, Chesapeake, Newport News, Nashville, Memphis, Austin, San Antonio, Houston, Mt. Laurel Township, Morristown, Chicago, Hartford, Meridian",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "SGI Delivery Solutions",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "Alabama, Georgia, Tennessee, Mississippi, Florida",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Capsule",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "Philadelphia, Miami, Tampa, Chicago, Dallas, Houston, Austin, Charlotte, Atlanta, Jacksonville, Boston, Los Angeles, New York, Phoenix, Denver",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Excel Group",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "Washington D.C. Metro Area, Virginia: Alexandria, Arlington, Chantilly, Falls Church, Fairfax, Manassas, McLean, Vienna, Tysons, Reston, Sterling, Herndon, Maryland: Baltimore, Elkridge, Bel Air, Catonsville, Columbia, Dundalk, Eldersburg, Ellicott City, Glen Burnie, Hanover, Jessup, Linthicum Heights, Towson, Owings Mills, Westminster, Woodlawn, Bethesda, Gaithersburg, Rockville, Silver Spring, Frederick, Richmond, Colonial Heights, Hopewell, Petersburg, Henrico, Chesterfield, Hanover, Midlothian, Glen Allen, Mechanicsville",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "BeeLine Courier Service",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Cars, Mini Vans, Cargo Vans, Cube Trucks, Box Trucks",
    areasServed: "Kentucky: Louisville, Lexington, Paducah, Indiana: Evansville, Indianapolis, Tennessee: Nashville, Missouri: Scott City, Ohio: Cincinnati, Columbus, Dayton, Ohio, Toledo",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "American Expediting",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Van, Box Truck",
    areasServed: "PA, GA, TX, MD, AL, MA, NY, SC, WV, NC, TN, IL, OH, SC, CO, MI, OR, FL, IN, MI, CT, IN, MS, MO, NV, KY, WI, MN, WV, NJ, VA, AZ, NV, VA, CA, WA, LA, AZ, DC, NY",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Crossroads Courier",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Cars, Mini Vans, Cargo Vans, Cube Trucks, Box Trucks",
    areasServed: "St. Louis, Kansas City, Phoenix, Las Vegas, Chicago, Dallas",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Courier Connection",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-up Truck, Mini Van, Cargo Van",
    areasServed: "Georgia: Atlanta Metro and surrounding areas",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "One Blood",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-up Truck, Mini Van, Cargo Van",
    areasServed: "Florida: Lakeland, Pensacola, Palm Beach Gardens, Melbourne, North Carolina: Charlotte",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "RedLine Courier Service",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-up Truck, Mini Van, Cargo Van",
    areasServed: "California Only",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Philadelphia Couriers",
    serviceVertical: "Medical Courier",
    vehicleTypes: "Car, Pick-up Truck, Mini Van, Cargo Van",
    areasServed: "Pennsylvania",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Dispatch (Dispatchit)",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "NY, TX, MA, NC, CO, OH, FL, SC, CA, NE, TN, AZ, UT, NM, CT, IL, PA, VA, WA, OK, MD, IA, MI, WI, NJ, OR, DC, GA, AL, IN, LV, KY, MN, LA, RI, MA",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Rapidus",
    serviceVertical: "General Courier",
    vehicleTypes: "Sedans, SUVs, Minivans, Pickup Trucks",
    areasServed: "California, Colorado, Washington State, Texas",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Veho Driver",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van",
    areasServed: "All 50 States",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Frayt",
    serviceVertical: "General Courier",
    vehicleTypes: "Car and Mid-sized, SUV, Cargo/Sprinter Van, Box Truck",
    areasServed: "Atlanta, Boston, Austin, Dallas, Houston, San Antonio, Chula Vista, Bakersfield, Fresno, Los Angeles, San Bernardino, San Francisco Bay Area, San Jose, Baltimore, Birmingham, Huntsville, Mobile, Montgomery, Canton, Columbus, Dayton, Cincinnati, Cleveland, Charlotte, Durham, Raleigh, Chicago, Detroit, Colorado Springs, Denver, Fort Myers, Orlando, Tampa, Fort Wayne, Indianapolis, Greenville, Kansas City, Las Vegas, Lexington, Louisville, Little Rock, Nashville, Memphis, Milwaukee, Minneapolis, New Orleans, New York City, Oklahoma City, Tulsa, Ontario, Philadelphia, Pittsburgh, Phoenix, Portland, Salt Lake City, Seattle, Virginia Beach, Washington",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Dolly App",
    serviceVertical: "General Courier",
    vehicleTypes: "Pickup Truck, Cargo Van, SUV W/Trailer, Box Truck",
    areasServed: "Los Angeles, San Diego, Orange County, San Francisco, San Jose, Sacramento, Oregon, Seattle, Las Vegas, Salt Lake City, Denver, Phoenix, St. Louis, Milwaukee, Chicago, Minneapolis, Kansas City, Indianapolis, Detroit, Cleveland, Pittsburgh, Columbus, Cincinnati, Nashville, Atlanta, Charlotte, Raleigh, Durham, Orlando, Tampa, Ft. Lauderdale, Miami, Washington DC, Baltimore, Wilmington DE, Philadelphia, New York City, New Haven, Hartford, Boston, Dallas, Austin, San Antonio, Houston",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Bunji Driver",
    serviceVertical: "General Courier",
    vehicleTypes: "1998 or Newer Pickup Truck, Cargo/Sprinter Van, SUV with Trailer",
    areasServed: "Atlanta, Texas: Austin, Baltimore, Massachusetts: Boston, Charlotte, Chicago, Columbus, Dallas, Denver, Fort Myers, Fairfield, Greenville, Indianapolis, Houston, Jacksonville, Kansas City, Louisville, Las Vegas, Memphis, Miami, Minneapolis, Nashville, Orlando, Phoenix, Philadelphia, Port St Lucie, Richmond, Salt Lake City, San Antonio, Sarasota, St Louis, Seattle, Tampa Bay, Virginia Beach, Washington DC, Wichita",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Curri Driver",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Minivan, Truck, Sprinter & Cargo Van, Box Truck, Flatbed Truck, Semi Truck, Stake Bed Truck, Straight Truck",
    areasServed: "Multiple markets nationwide",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "GoShare Driver",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Pickup Truck, Cargo Van, Box Truck",
    areasServed: "Akron, Anaheim, Annapolis, Arlington, Atlanta, Austin, Baltimore, Bethesda, Boston, Brooklyn, Bronx, Charlotte, Charlottesville, Cherry Hill, Chicago, Cincinnati, Cleveland, Columbus, Dallas, Dayton, Denver, Detroit, Fort Lauderdale, Fort Worth, Greensboro, Greenville, Hartford, Houston, Indianapolis, Jacksonville, Jersey City, Kansas City, Las Vegas, Long Island, Los Angeles, Louisville, Manhattan, Memphis, Miami, Minneapolis, Murfreesboro, Nashville, New Orleans, New York, Oakland",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Point Pickup",
    serviceVertical: "General Courier",
    vehicleTypes: "Any Type Of Vehicle 2000 and Newer",
    areasServed: "All 50 states",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Tonquin",
    serviceVertical: "Auto Parts Deliveries",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "Birmingham, Boston, Buffalo, Durham, Fort Myers, Greenville, Hartford, Raleigh, Rochester, Springfield, Syracuse, Tampa, Denver, Phoenix, Knoxville, Sarasota, Orlando, Jacksonville, Chicago, Minneapolis, West Palm Beach, Savannah, Austin, Houston, Charlotte, Erie, Atlanta",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  },
  {
    name: "Ontrac",
    serviceVertical: "General Courier",
    vehicleTypes: "Car, SUV, Minivan, Cargo Van, Box Truck",
    areasServed: "TX, NH, MA, CT, RI, NY, PA, MD, DE, MI, OH, IN, WV, VA, KY, TN, AR, MS, SC, GA, FL, AZ, CO, UT, NV, CA, ID, OR, WA, DC",
    contractType: "Independent Contractor",
    payRange: "Varies",
    insuranceRequired: "Commercial Auto Required",
    licenseRequired: "Valid Driver License"
  }
];

export default companies;