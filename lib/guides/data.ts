export interface LocalGuide {
  slug: string
  title: string
  metaTitle: string
  description: string
  readTime: string
  publishedDate: string
  updatedDate: string
  category: "attractions" | "food" | "transit" | "student" | "heritage" | "emergency"
  coverImage: string
  author: {
    name: string
    role: string
  }
  highlights: string[]
  contentHtml: string
}

export const KATRAJ_GUIDES: LocalGuide[] = [
  {
    slug: "rajiv-gandhi-zoo-katraj-guide",
    title: "Complete Visitor Guide to Rajiv Gandhi Zoological Park (Katraj Zoo) — Timings, Safari & Ticket Rates",
    metaTitle: "Rajiv Gandhi Zoological Park (Katraj Zoo) Guide 2026 — Timings, Ticket Prices & Safari",
    description: "Everything you need to know before visiting Katraj Zoo & Snake Park in Pune: entry ticket prices, battery vehicle fares, animal exhibits (Bengal Tiger, White Tiger), Wednesday holiday rules, and parking tips.",
    readTime: "6 min read",
    publishedDate: "2026-11-01",
    updatedDate: "2026-11-20",
    category: "attractions",
    coverImage: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Team KatrajPune",
      role: "Hyperlocal Editorial Board",
    },
    highlights: [
      "Crucial Rule: Katraj Zoo is CLOSED on every Wednesday.",
      "Ticket Counter Timings: 9:30 AM to 5:00 PM (Park closes at 6:00 PM).",
      "Entry Fares: Adult ₹40, Child (below 12) ₹25, Foreign Nationals ₹100.",
      "Electric Battery Vehicles available inside for senior citizens and families.",
      "Key Attractions: Royal Bengal Tigers, White Tiger enclosure, Leopard rescue zone, and the world-famous Katraj Snake Park."
    ],
    contentHtml: `
      <h2>Overview of Katraj Zoo</h2>
      <p>The <strong>Rajiv Gandhi Zoological Park and Wildlife Research Centre</strong>, popularly known across Maharashtra as <em>Katraj Zoo</em> or <em>Katraj Snake Park</em>, spans over 130 acres on the Pune-Satara Highway. Managed by the Pune Municipal Corporation (PMC), it is one of the most prominent conservation centers in Western India, featuring over 360 animals across mammalian, avian, and reptilian species.</p>

      <h2>Important Visitor Timings & Wednesday Closure</h2>
      <p>The most common mistake first-time visitors make is traveling to Katraj on a Wednesday. <strong>The zoo is strictly closed every Wednesday for maintenance, veterinary checkups, and enclosure sanitization.</strong></p>
      <ul>
        <li><strong>Open Days:</strong> Thursday through Tuesday (Closed Wednesdays).</li>
        <li><strong>Summer Hours (April – June):</strong> 9:30 AM to 5:30 PM (Gates close at 6:00 PM).</li>
        <li><strong>Winter Hours (July – March):</strong> 9:30 AM to 5:00 PM (Gates close at 5:30 PM).</li>
      </ul>

      <h2>Entry Ticket Prices & Photography Charges</h2>
      <p>Ticket counters are located directly at the main entrance gate on Katraj-Kondhwa Link Road / Satara Road. Digital UPI payments (PhonePe, Google Pay, Paytm) and cash are accepted.</p>
      <table>
        <thead>
          <tr>
            <th>Visitor Category</th>
            <th>Ticket Fare (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Adults (12 years and above)</td>
            <td>₹40 per person</td>
          </tr>
          <tr>
            <td>Children (Ages 3 to 11)</td>
            <td>₹25 per child</td>
          </tr>
          <tr>
            <td>School Students (Group Educational Tour)</td>
            <td>₹15 per student</td>
          </tr>
          <tr>
            <td>Foreign Nationals</td>
            <td>₹100 per visitor</td>
          </tr>
          <tr>
            <td>Still Digital Camera</td>
            <td>₹50</td>
          </tr>
          <tr>
            <td>Video Camera</td>
            <td>₹200</td>
          </tr>
        </tbody>
      </table>

      <h2>Major Animal Exhibits Inside the Park</h2>
      <p>The park is divided into three distinct zones: the Central Zoo, the Snake Park & Reptile House, and Katraj Lake perimeter.</p>
      <ul>
        <li><strong>The Tiger & Leopard Enclosures:</strong> Home to both golden Royal Bengal Tigers and rare White Tigers in large, natural open-moat enclosures mimicking deep deciduous forest terrain.</li>
        <li><strong>The Katraj Snake Park:</strong> Founded in 1986 by renowned wildlife conservationist Neelam Kumar Khaire, it showcases over 22 species of snakes including King Cobras, Indian Pythons, Russell's Vipers, and Saw-scaled Vipers alongside educational charts debunking local superstitions.</li>
        <li><strong>Herbivore Safari:</strong> Sambar deer, Blackbucks, Chital (spotted deer), and Nilgai roaming expansive grasslands.</li>
      </ul>

      <h2>Internal Transport: Eco Battery Cars (Buggy)</h2>
      <p>Because the park is massive (130+ acres with substantial hill gradients), PMC operates battery-powered eco golf buggies for visitors who prefer not to walk the full 4 km path:</p>
      <ul>
        <li><strong>Battery Car Ticket:</strong> ₹40 per adult, ₹25 per child.</li>
        <li>Priority boarding is given to senior citizens, pregnant women, and families with toddlers.</li>
      </ul>

      <h2>How to Reach Katraj Zoo & Parking</h2>
      <p>Katraj Zoo is located directly across from Katraj Lake on the Pune-Satara Highway. You can take any PMPML bus heading to Katraj Bus Depot from Swargate, Pune Railway Station, or Shivajinagar. Ample paid two-wheeler and four-wheeler parking is available right outside the main gate.</p>
    `
  },
  {
    slug: "best-misal-in-katraj",
    title: "Top 10 Authentic Misal Spots in Katraj: The Ultimate Pune Foodie Ranking",
    metaTitle: "Best Misal in Katraj Pune (2026) — Top 10 Ranked Misal Pav Addas",
    description: "Craving authentic, spicy Puneri Misal in Katraj? Here is the definitive local guide to the best misal spots near Katraj Chowk, Bharati Vidyapeeth, and Pune-Satara Road with spice ratings, pricing, and exact locations.",
    readTime: "5 min read",
    publishedDate: "2026-11-03",
    updatedDate: "2026-11-21",
    category: "food",
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Ajit Ovhal",
      role: "Lead City Curator, KatrajPune",
    },
    highlights: [
      "Tested & reviewed across spice profile, rassa consistency, farsan freshness, and value.",
      "Price range: ₹70 to ₹120 per plate with unlimited rassa/tarri.",
      "Features Katakirr Misal, Hotel Samarth, Sai Misal, and hidden student gems near Bharati Vidyapeeth.",
      "Pairing recommendations: Solkadhi, Taak (spiced buttermilk), and Katraj Dairy Shrikhand."
    ],
    contentHtml: `
      <h2>The Misal Culture in Katraj</h2>
      <p>In Pune, Misal Pav is not merely breakfast; it is an institution. In Katraj, with its blend of highway commuters, weekend trekkers heading to Sinhagad or Mahabaleshwar, and tens of thousands of Bharati Vidyapeeth college students, the local Misal culture is competitive, fiery, and deeply satisfying.</p>

      <h2>1. Katakirr Misal (Katraj Branch)</h2>
      <p>Known across Pune for its standardized three-tier spice system (Tikha, Medium, and Light), Katakirr's Katraj outlet delivers exceptionally crisp farsan, tender sprouted matki, and a signature red-hot tarri. The buttermilk (Taak) here is mandatory to soothe the palate.</p>
      <ul>
        <li><strong>Location:</strong> Pune-Satara Road, near Katraj Chowk.</li>
        <li><strong>Average Price:</strong> ₹100 – ₹120 per plate.</li>
        <li><strong>Spice Level:</strong> High (Order Medium unless you have true Puneri spice tolerance!).</li>
      </ul>

      <h2>2. Hotel Samarth Misal</h2>
      <p>A classic highway-style stop loved by early morning travelers and locals alike. Samarth specializes in a slow-cooked black-masala (kala rassa) misal that emphasizes earthy roasted spices over raw chili heat.</p>
      <ul>
        <li><strong>Location:</strong> Katraj-Dehu Road Bypass, Ambegaon BK.</li>
        <li><strong>Average Price:</strong> ₹85 per plate.</li>
        <li><strong>Must-Try:</strong> Matki Special Misal with extra butter pav.</li>
      </ul>

      <h2>3. Sai Misal House (Bharati Vidyapeeth Back Gate)</h2>
      <p>The student favorite. Affordable, generous, and served with piping hot bread and bottomless jugs of aromatic rassa. During college lunch hours, finding a table requires patience, but the crispy sev and zesty lemon-onion garnish make it well worth the wait.</p>
      <ul>
        <li><strong>Location:</strong> Behind Bharati Vidyapeeth Campus, Katraj.</li>
        <li><strong>Average Price:</strong> ₹70 – ₹80 per plate.</li>
        <li><strong>Value Rating:</strong> 5.0 / 5.0 for students.</li>
      </ul>

      <h2>4. Mamledar & Puneri Fusion Adda</h2>
      <p>Bridging traditional Puneri sweet-sour notes with Kolhapuri fire, this spot attracts family crowds on Sunday mornings. They serve crisp poori option alongside traditional ladi pav.</p>

      <h2>What to Look for in an Authentic Katraj Misal</h2>
      <ul>
        <li><strong>Freshly Sprouted Matki:</strong> Never mushy; always steamed to retain bite and nutrition.</li>
        <li><strong>Double Tarri:</strong> A proper Katraj misal must separate into clear red spiced oil on top and rich, savory lentil stock beneath.</li>
        <li><strong>Local Dairy Accompaniment:</strong> Finish with fresh <em>Katraj Dairy Mastani</em> or sweet curd to balance the spice.</li>
      </ul>
    `
  },
  {
    slug: "katraj-bus-depot-pmpml-transit-guide",
    title: "Katraj Bus Depot (PMPML) Route & Timetable Guide: Direct Buses to Hinjawadi, Swargate & Station",
    metaTitle: "Katraj Bus Depot PMPML Guide — Direct Routes, Timings & Fares (2026)",
    description: "Complete commuter guide to Katraj PMPML Bus Depot: Direct bus numbers, frequency, first & last bus timings to Hinjawadi IT Park, Pune Railway Station, Swargate, Hadapsar, and Kothrud.",
    readTime: "7 min read",
    publishedDate: "2026-11-05",
    updatedDate: "2026-11-22",
    category: "transit",
    coverImage: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Team KatrajPune",
      role: "Transit & Infrastructure Desk",
    },
    highlights: [
      "Key Depot: Katraj PMPML Bus Depot is one of the top 3 transit terminuses in Pune.",
      "Direct IT Route: Bus 100 & 100A connect Katraj directly to Hinjawadi Phase 3.",
      "Major Interchange: Direct 10-minute bus frequency to Swargate multimodal hub.",
      "Monthly pass counters and digital 'Apli PMPML' app QR ticketing available."
    ],
    contentHtml: `
      <h2>Why Katraj Bus Depot is Crucial for Pune Commuters</h2>
      <p>Located at the southern gateway of Pune city on the Mumbai-Bengaluru Highway bypass, <strong>Katraj PMPML Bus Depot</strong> serves over 85,000 daily commuters. It connects southern suburbs directly to the IT hubs in Hinjawadi, industrial belts in Bhosari and Chakan, and central junctions like Swargate and Pune Railway Station.</p>

      <h2>Top Direct PMPML Bus Routes from Katraj</h2>
      <table>
        <thead>
          <tr>
            <th>Route No.</th>
            <th>Destination</th>
            <th>Frequency</th>
            <th>First / Last Bus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>100 / 100A</strong></td>
            <td>Hinjawadi Maan Phase 3 (via Highway Bypass)</td>
            <td>Every 15 mins</td>
            <td>06:00 AM / 10:15 PM</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td>Shivajinagar / Pune Station (via Swargate)</td>
            <td>Every 8 mins</td>
            <td>05:30 AM / 11:30 PM</td>
          </tr>
          <tr>
            <td><strong>29</strong></td>
            <td>Hadapsar / Magarpatta City (via Kondhwa)</td>
            <td>Every 20 mins</td>
            <td>06:15 AM / 10:00 PM</td>
          </tr>
          <tr>
            <td><strong>30</strong></td>
            <td>Kothrud Stand / Karve Nagar (via Warje)</td>
            <td>Every 15 mins</td>
            <td>06:00 AM / 10:30 PM</td>
          </tr>
          <tr>
            <td><strong>299</strong></td>
            <td>Nigdi / Bhosari (via Highway Express)</td>
            <td>Every 25 mins</td>
            <td>06:30 AM / 09:45 PM</td>
          </tr>
        </tbody>
      </table>

      <h2>Katraj to Hinjawadi IT Corridor: The Tech Commuter Guide</h2>
      <p>For software engineers living in Katraj, Ambegaon, and Dhankawadi, the direct <strong>Route 100</strong> and <strong>100A AC Electric Buses</strong> are life-savers. Traveling via the Western Bypass (NH 48), these buses avoid city bottlenecks like Deccan and Senapati Bapat Road, reaching Hinjawadi Phase 1 in approximately 50 to 65 minutes during peak hours.</p>

      <h2>Pass Counters & Student Discount Concessions</h2>
      <p>The Katraj Depot houses a dedicated PMPML Pass Counter for:</p>
      <ul>
        <li><strong>Student Monthly & Quarterly Concession Passes:</strong> Up to 75% subsidized travel for school and university students (requires college bona fide certificate).</li>
        <li><strong>Senior Citizen Annual Passes:</strong> Subsidized unlimited travel across all PMPML routes.</li>
        <li><strong>Daily All-Route Pass (₹50/day PMC area, ₹70/day PMRDA area):</strong> Highly cost-effective for multi-stop city errands.</li>
      </ul>
    `
  },
  {
    slug: "student-living-guide-bharati-vidyapeeth-katraj",
    title: "The Ultimate Katraj Student Living Guide: Budget Mess, Hostels & Life around Bharati Vidyapeeth & PICT",
    metaTitle: "Katraj Student Guide 2026 — Budget Mess, PG Hostels & Cost of Living",
    description: "New to Katraj for college? A complete student roadmap covering monthly living costs, verified hostel/PG tips, best budget mess under ₹80/meal, xerox hubs, and student hangouts near Bharati Vidyapeeth.",
    readTime: "6 min read",
    publishedDate: "2026-11-08",
    updatedDate: "2026-11-23",
    category: "student",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Ajit Ovhal",
      role: "Lead City Curator, KatrajPune",
    },
    highlights: [
      "Katraj hosts over 50,000 university students across engineering, medical, dental, pharmacy, and law.",
      "Average monthly living cost: ₹7,000 to ₹12,000 (including sharing PG and daily mess).",
      "Best monthly thali mess: Unlimited vegetarian meals between ₹2,200 and ₹3,000/month.",
      "High-speed xerox and book binding lane behind Bharati Vidyapeeth Medical College."
    ],
    contentHtml: `
      <h2>Katraj: Pune's Thriving Student Capital</h2>
      <p>With massive educational campuses including <strong>Bharati Vidyapeeth Deemed University</strong>, <strong>Pune Institute of Computer Technology (PICT)</strong>, and <strong>Sinhgad Institutes</strong> right on its periphery, Katraj is custom-built for student life. Everything from 24-hour study libraries to budget laundry and bike repair shops is available within walking distance.</p>

      <h2>Monthly Cost of Living Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Expense Category</th>
            <th>Budget Option</th>
            <th>Comfort Option</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Room / PG (Double/Triple Sharing)</td>
            <td>₹3,500 – ₹5,000 / mo</td>
            <td>₹6,000 – ₹8,500 / mo</td>
          </tr>
          <tr>
            <td>Monthly Mess (2 meals/day)</td>
            <td>₹2,200 – ₹2,800 / mo</td>
            <td>₹3,200 – ₹4,000 / mo</td>
          </tr>
          <tr>
            <td>Laundry & Essentials</td>
            <td>₹500 / mo</td>
            <td>₹1,000 / mo</td>
          </tr>
          <tr>
            <td>Local Transit (PMPML Student Pass)</td>
            <td>₹350 / mo</td>
            <td>₹700 / mo</td>
          </tr>
          <tr>
            <td><strong>Total Estimated Monthly Spend</strong></td>
            <td><strong>₹6,550 – ₹8,650</strong></td>
            <td><strong>₹10,900 – ₹14,200</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>Top Budget Student Mess Around Bharati Vidyapeeth</h2>
      <p>Finding clean, nutritious, home-style food is every hostelite's top priority. The top student-reviewed mess around Katraj include:</p>
      <ul>
        <li><strong>Mauli Mess (Behind Law College):</strong> Known for chapati that stays soft, seasonal vegetables, and Sunday special sweet treats. Unlimited thali at ₹70.</li>
        <li><strong>Annapurna Bhojanalay (Wonder City Road):</strong> Authentic Maharashtrian and North Indian thalis with daily curd and dal tadka. Monthly subscription around ₹2,400.</li>
        <li><strong>Kolhapuri Swad Mess:</strong> For students craving spicy chicken and egg curry thalis on Wednesdays and Sundays.</li>
      </ul>

      <h2>Study Centers & 24/7 Reading Rooms</h2>
      <p>During university exams, Katraj's private reading rooms (Abhyasika) fill up fast. Most offer AC halls, high-speed Wi-Fi, personal charging sockets, and ergonomic chairs for ₹800 to ₹1,500/month.</p>
    `
  },
  {
    slug: "katraj-lake-peshwa-aqueduct-heritage",
    title: "Katraj Lake & The Historic Peshwa Underground Aqueduct: A Heritage Guide",
    metaTitle: "Katraj Lake & Peshwa Underground Aqueduct — Pune Heritage History",
    description: "Discover the architectural wonder of Katraj Lake: Built in 1750 by Peshwa Nanasaheb, featuring an ancient underground masonry aqueduct that supplied drinking water to Shaniwar Wada across 8 kilometers.",
    readTime: "5 min read",
    publishedDate: "2026-11-10",
    updatedDate: "2026-11-20",
    category: "heritage",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Team KatrajPune",
      role: "Heritage & Culture Desk",
    },
    highlights: [
      "Constructed around 1750–1755 AD by Shrimant Balaji Baji Rao (Nanasaheb Peshwa).",
      "Twin artificial reservoirs designed to harvest natural rainwater from Sahyadri slopes.",
      "An 8-kilometer gravity-fed underground terracotta and stone aqueduct.",
      "Peshwa engineering feat: Supplied fresh drinking water to Shaniwar Wada and Pune city without electricity or pumps!"
    ],
    contentHtml: `
      <h2>The Legacy of Shrimant Nanasaheb Peshwa</h2>
      <p>Before Pune had modern water treatment plants and municipal dams, the city relied on one of the greatest hydraulic engineering masterworks of 18th-century India: the <strong>Katraj Water Conduit System (कात्रज नळ योजना)</strong>.</p>
      <p>Commissioned around 1750 by <strong>Nanasaheb Peshwa</strong>, this engineering feat solved the severe water shortages of the expanding Maratha capital by creating two large cascading artificial reservoirs in the foothills of Katraj.</p>

      <h2>How the Gravity-Fed Underground Aqueduct Worked</h2>
      <p>What makes Katraj Lake legendary among civil engineers is its pure gravity design:</p>
      <ul>
        <li><strong>Zero Mechanical Pumps:</strong> Katraj sits at an altitude of approximately 640 meters above sea level, while central Pune (Shaniwar Wada) sits at 560 meters. The natural 80-meter slope allowed water to flow smoothly purely through gravity.</li>
        <li><strong>Underground Masonry Duct:</strong> Built with brick, stone, and lime mortar, the duct is large enough in parts for an adult to walk through for cleaning and maintenance.</li>
        <li><strong>Silt Interceptor Wells (Uchhwas):</strong> Every few hundred meters, circular inspection towers allowed water pressure to equalize and trapped mud and debris before the clear water flowed downstream.</li>
      </ul>

      <h2>Katraj Lake Today: Boating, Park & Jogging Track</h2>
      <p>Today, Katraj Lake is managed by the PMC as a key recreational and ecological zone. The lake features:</p>
      <ul>
        <li>A scenic paved 1.8 km jogging and walking track around the perimeter.</li>
        <li>A musical fountain and children's amusement park.</li>
        <li>A sanctuary for migratory wetland birds including egrets, herons, and cormorants.</li>
      </ul>
    `
  },
  {
    slug: "emergency-medicals-hospitals-katraj",
    title: "24-Hour Emergency Medicals, Hospitals & Ambulance Directory in Katraj, Pune 411046",
    metaTitle: "Katraj 24-Hour Medical Stores, Hospitals & Emergency Numbers 411046",
    description: "Need urgent medical help in Katraj? Verified list of 24/7 pharmacies, multispeciality trauma hospitals, ambulance dispatchers, and police station helplines in Katraj, Pune 411046.",
    readTime: "4 min read",
    publishedDate: "2026-11-12",
    updatedDate: "2026-11-23",
    category: "emergency",
    coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Team KatrajPune",
      role: "Public Health & Safety Desk",
    },
    highlights: [
      "Emergency Ambulance Helpline: 108 (Toll-Free, Govt. Maharashtra).",
      "Bharati Hospital & Research Centre operates 24/7 emergency casualty and blood bank.",
      "List of verified all-night medical stores open past midnight in Katraj Chowk.",
      "Local police chowki numbers for Bharati Vidyapeeth and Katraj Outpost."
    ],
    contentHtml: `
      <h2>Emergency Lifeline Contacts in Katraj</h2>
      <p>Save these essential emergency contacts on your mobile phone if you reside, study, or work in Katraj, Pune (PIN 411046):</p>
      <table>
        <thead>
          <tr>
            <th>Emergency Service</th>
            <th>Contact Number</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Emergency Ambulance (Govt)</strong></td>
            <td><strong>108</strong></td>
            <td>24 Hours (Free)</td>
          </tr>
          <tr>
            <td><strong>Police Control Room</strong></td>
            <td><strong>112 / 100</strong></td>
            <td>24 Hours</td>
          </tr>
          <tr>
            <td><strong>Bharati Vidyapeeth Police Station</strong></td>
            <td><strong>020 2437 2744</strong></td>
            <td>24 Hours</td>
          </tr>
          <tr>
            <td><strong>Katraj Fire Brigade Station</strong></td>
            <td><strong>101 / 020 2436 4101</strong></td>
            <td>24 Hours</td>
          </tr>
          <tr>
            <td><strong>Bharati Hospital Casualty / Trauma</strong></td>
            <td><strong>020 4055 5555</strong></td>
            <td>24 Hours</td>
          </tr>
        </tbody>
      </table>

      <h2>Major 24-Hour Multispeciality Hospitals in Katraj</h2>
      <ul>
        <li><strong>Bharati Hospital & Research Centre (Katraj-Dhankawadi):</strong> Over 850 beds with 24-hour emergency casualty, trauma team, ICU, and in-house blood bank.</li>
        <li><strong>Sai Sneh Hospital & Diagnostic Centre (Katraj Chowk):</strong> Critical care, orthopedic surgery, and maternity services.</li>
        <li><strong>Chintamani Hospital (Katraj-Kondhwa Road):</strong> General surgery, pediatric emergency, and diagnostic pharmacy.</li>
      </ul>

      <h2>24-Hour Chemists & Late-Night Pharmacies</h2>
      <p>If you need urgent medicines after 11:00 PM in Katraj, head to:</p>
      <ul>
        <li><strong>Bharati Hospital In-Campus Pharmacy:</strong> Open 24x7, 365 days with complete inventory of life-saving drugs and surgical supplies.</li>
        <li><strong>Apollo Pharmacy (Katraj Chowk Branch):</strong> Open until midnight with doorstep delivery.</li>
        <li><strong>Wellness Forever (Near Katraj Bypass):</strong> 24-hour retail chemist stocked with emergency pediatric and general medicines.</li>
      </ul>
    `
  }
]
