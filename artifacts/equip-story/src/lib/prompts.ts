export const BUSINESS_TYPES = [
  { value: "Landscape Contractor", description: "Residential and commercial property maintenance, design and build." },
  { value: "Outdoor Power Equipment Dealer", description: "Sales, service, and support for outdoor equipment." },
  { value: "Hardscape & Paver Installer", description: "Patios, retaining walls, and outdoor living spaces." },
  { value: "Tree Care & Arborist Services", description: "Pruning, removal, and plant health care." },
  { value: "Irrigation & Lighting Company", description: "Water management and outdoor illumination." },
  { value: "Nursery & Greenhouse", description: "Plant production, growing, and distribution." },
  { value: "Distributor / Manufacturer", description: "Equipment and materials supply chain." },
  { value: "Property & Fleet Management", description: "Large-scale grounds and vehicle management." },
  { value: "Other", description: "Tell us more in your story." }
];

export const INTERESTS = [
  "Equipment & Technology",
  "Labor & Workforce",
  "Business Growth",
  "Financing",
  "Fleet",
  "Education",
  "Sustainability",
  "Operations",
  "New Products",
  "Networking",
  "Other"
];

export const GENERIC_PROMPTS = [
  "WHAT BROUGHT YOU TO EQUIP THIS YEAR?",
  "WHAT ARE YOU TRYING TO SOLVE IN YOUR BUSINESS?",
  "WHAT HAVE YOU SEEN HERE THAT CAUGHT YOUR ATTENTION?",
  "WHAT DO YOU WISH YOU COULD FIND MORE OF?",
  "WHAT SHOULD EQUIP KNOW ABOUT YOUR INDUSTRY RIGHT NOW?",
  "WHAT WOULD MAKE NEXT YEAR EVEN MORE VALUABLE?"
];

export const PROMPTS_BY_BUSINESS: Record<string, string[]> = {
  "Landscape Contractor": [
    "What's the biggest thing getting in the way of growing your business?",
    "Where could equipment or technology help your team do more?",
    "What's getting harder about running a landscaping business today?"
  ],
  "Outdoor Power Equipment Dealer": [
    "What are your customers asking for that is changing how you run your business?",
    "What products or technologies are customers asking about most?",
    "What's your biggest challenge as a dealer right now?"
  ],
  "Hardscape & Paver Installer": [
    "Where are you seeing the greatest demand from customers?",
    "What's slowing your crews down today?"
  ],
  "Tree Care & Arborist Services": [
    "Where could equipment make your crews safer or more productive?",
    "What's your biggest operational challenge right now?"
  ],
  "Irrigation & Lighting Company": [
    "What trends are changing your business right now?",
    "Where could smarter technology improve your operation?"
  ],
  "Nursery & Greenhouse": [
    "What's making it harder to grow or distribute your products?",
    "How are labor, weather or supply challenges affecting you?"
  ],
  "Distributor / Manufacturer": [
    "What are you hearing most often from customers?",
    "What market changes are affecting your business?"
  ],
  "Property & Fleet Management": [
    "What's your biggest challenge managing equipment or grounds at scale?",
    "Where are labor or maintenance costs creating pressure?"
  ]
};

export const PROMPTS_BY_INTEREST: Record<string, string> = {
  "Labor & Workforce": "What's happening with labor in your business right now?",
  "Business Growth": "What's the biggest thing standing between your business and its next stage of growth?",
  "Equipment & Technology": "What are you hoping new equipment or technology can help you accomplish?",
  "Financing": "How are financing needs changing for your operation?",
  "Fleet": "What's your biggest challenge managing your fleet?",
  "Education": "What skills are your team lacking right now?",
  "Sustainability": "How is the push for sustainability impacting your choices?",
  "Operations": "Where are the biggest bottlenecks in your daily operations?",
  "New Products": "What gap in your lineup are you hoping to fill?",
  "Networking": "Who are you hoping to connect with here?",
  "Other": "Tell us what's on your mind."
};
