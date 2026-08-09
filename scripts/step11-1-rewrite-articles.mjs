// PRAG Step 11.1 — Rewrite 8 REWRITE Articles
//
// Rewrites thin/generic articles with improved content:
// - Proper H1 + H2 structure
// - Nigerian power context
// - Technical usefulness
// - Commercial relevance
// - No invented statistics/specs/prices
//
// Run from prag-b2b root:
//   node scripts/step11-1-rewrite-articles.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
const envText = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const WP_API_URL = env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WP_APP_USER = env.WP_APP_USER;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;
const authHeader = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const SITE_BASE = env.NEXT_PUBLIC_B2B_SITE_URL ?? 'https://www.prag.global';

// ─── Rewritten content for 8 articles ──────────────────────────────────────
// Each article gets: H1, intro, H2 sections, conclusion, CTA
// No invented specs/prices/statistics. Only verified PRAG/product information.

const rewrites = {
  // #12 — Affordable Inverter (was 312wc, generic)
  57252: `<h1>Affordable Inverter Options in Nigeria</h1>
<p>Power outages are a regular challenge for Nigerian homes and businesses. An inverter provides reliable backup power without the noise, fuel costs, and maintenance of a generator — but many people assume inverters are too expensive. In reality, there are affordable inverter options that deliver dependable performance for Nigerian power conditions.</p>

<h2>What Makes an Inverter Affordable?</h2>
<p>An affordable inverter is not simply the cheapest model on the market. It is one that delivers the right capacity for your needs at a fair price, with features that protect your investment over time. Key factors that affect inverter pricing include:</p>
<ul>
<li><strong>Capacity (kVA):</strong> Higher capacity inverters cost more but power more appliances. Matching capacity to your actual load avoids overspending.</li>
<li><strong>Battery voltage:</strong> 12V systems are typically more affordable for small setups, while 24V and 48V systems offer better efficiency for larger loads.</li>
<li><strong>Waveform:</strong> Pure sine wave inverters cost slightly more than modified sine wave models but protect sensitive electronics.</li>
<li><strong>Battery type:</strong> Lead-acid batteries are cheaper upfront, while lithium batteries cost more initially but last significantly longer.</li>
</ul>

<h2>Sizing Your Inverter to Your Budget</h2>
<p>The most common mistake when buying an affordable inverter is choosing one that is too small for the intended load. An undersized inverter will overload, shut down, and potentially damage connected appliances. To find an affordable option that actually works:</p>
<ol>
<li>List the appliances you need to power during outages.</li>
<li>Add up their running wattage.</li>
<li>Account for starting surge (motors in fridges and pumps need 2-3x running power).</li>
<li>Choose an inverter with at least 20% headroom above your total.</li>
</ol>
<p>For a typical Nigerian home needing lights, TV, fans, and a small fridge during outages, a 1-2.5 kVA inverter is often sufficient. For more guidance, see our <a href="${SITE_BASE}/knowledge-center/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply">inverter sizing guide</a>.</p>

<h2>Features to Look for in a Budget Inverter</h2>
<p>Even at an affordable price point, certain features are worth prioritizing:</p>
<ul>
<li><strong>Pure sine wave output:</strong> Protects TVs, computers, and other sensitive electronics.</li>
<li><strong>Built-in charge controller:</strong> Allows future solar expansion without buying additional equipment.</li>
<li><strong>Overload and short-circuit protection:</strong> Prevents damage to the inverter and your appliances.</li>
<li><strong>Smart charging:</strong> Extends battery life by adjusting charge current based on battery condition.</li>
</ul>

<h2>Keeping Long-Term Costs Down</h2>
<p>The upfront price of an inverter is only part of the cost. To keep your total investment affordable over time:</p>
<ul>
<li>Choose an inverter compatible with lithium batteries — they last 5-10x longer than lead-acid, reducing replacement costs.</li>
<li>Size your battery bank correctly to avoid deep discharging, which shortens battery life.</li>
<li>Perform basic maintenance: check terminals, keep ventilation clear, and monitor charge levels.</li>
</ul>

<p><strong>Looking for an affordable inverter?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> to find options that fit your budget.</p>`,

  // #13 — Inverter with Energy-Saving Mode (was 319wc, generic)
  57250: `<h1>Inverter Energy-Saving Mode: How It Works</h1>
<p>For Nigerian homes and businesses dealing with frequent power outages, an inverter is essential for backup power. But inverters themselves consume energy — even when your appliances are off, the inverter draws power to stay ready. Energy-saving mode reduces this idle consumption, helping you get more runtime from your battery bank and lower your electricity costs.</p>

<h2>What Is Energy-Saving Mode?</h2>
<p>Energy-saving mode (sometimes called "eco mode" or "power-saving mode") is a feature that reduces an inverter's power consumption when the connected load is low or zero. When no appliances are drawing power, the inverter partially shuts down or reduces its output, consuming significantly less energy from the battery.</p>
<p>When an appliance is switched on, the inverter detects the load and returns to full output within milliseconds. This happens automatically — you do not need to manually switch between modes.</p>

<h2>How Energy-Saving Mode Reduces Battery Drain</h2>
<p>A standard inverter without energy-saving mode may consume 1-3% of battery capacity per hour even with no load connected. Over a full day of idle time, that can drain 24-72% of your battery — meaning less runtime when you actually need it.</p>
<p>With energy-saving mode enabled, idle consumption drops dramatically. The inverter periodically checks for load rather than maintaining full output continuously. This means:</p>
<ul>
<li>More battery capacity available when power fails.</li>
<li>Longer battery life (less frequent deep discharging).</li>
<li>Lower electricity bills when charging from grid power.</li>
</ul>

<h2>When to Use Energy-Saving Mode</h2>
<p>Energy-saving mode is ideal when:</p>
<ul>
<li>Your inverter powers appliances that are switched off most of the time (e.g., a fridge that cycles on and off).</li>
<li>You want maximum battery runtime during extended outages.</li>
<li>Your inverter is primarily a backup system rather than running continuously.</li>
</ul>
<p>However, energy-saving mode may not be suitable for appliances that require constant power without any interruption (such as sensitive medical equipment or servers). In those cases, standard mode ensures seamless power delivery.</p>

<h2>Choosing an Inverter with Energy-Saving Features</h2>
<p>When selecting an inverter with energy-saving mode, look for:</p>
<ul>
<li><strong>Automatic load detection:</strong> The inverter should switch modes without manual intervention.</li>
<li><strong>Fast wake-up time:</strong> The transition from eco mode to full output should be fast enough to avoid appliance disruption.</li>
<li><strong>Adjustable sensitivity:</strong> Some inverters let you set the minimum load threshold that triggers full output.</li>
</ul>

<p><strong>Want an energy-efficient inverter?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> with energy-saving features.</p>`,

  // #14 — Inverter for Energy Storage (was 298wc, generic)
  57248: `<h1>Inverters for Energy Storage Systems</h1>
<p>Energy storage is becoming increasingly important in Nigeria, where grid power can be unreliable and generator fuel costs continue to rise. An inverter for energy storage is the central component that manages how energy flows between your batteries, solar panels (if connected), and your home or business appliances.</p>

<h2>How an Energy Storage Inverter Works</h2>
<p>An energy storage inverter does more than convert DC power from batteries into AC power for your appliances. It also manages charging — taking power from the grid, solar panels, or a generator and storing it in your battery bank for later use. When grid power fails, the inverter automatically switches to battery power, providing seamless backup.</p>
<p>The key functions of an energy storage inverter include:</p>
<ul>
<li><strong>DC-to-AC conversion:</strong> Converts battery power (DC) to appliance power (AC).</li>
<li><strong>Battery charging:</strong> Charges batteries from grid, solar, or generator power.</li>
<li><strong>Automatic transfer:</strong> Switches between power sources without interruption.</li>
<li><strong>Load management:</strong> Prioritizes which appliances receive power during outages.</li>
</ul>

<h2>Types of Energy Storage Inverters</h2>
<h3>Pure Sine Wave Inverters</h3>
<p>Pure sine wave inverters produce clean power that is safe for all electronics, including sensitive equipment like computers, TVs, and medical devices. This is the recommended type for most Nigerian homes and businesses.</p>
<h3>Hybrid Inverters</h3>
<p>Hybrid inverters combine an inverter, battery charger, and solar charge controller in one unit. They can manage power from grid, solar panels, and batteries simultaneously, automatically selecting the most cost-effective source. If you plan to add solar panels now or in the future, a hybrid inverter is the most cost-effective choice.</p>
<h3>Inverters with MPPT</h3>
<p>Maximum Power Point Tracking (MPPT) is a technology that optimizes energy harvest from solar panels. An inverter with integrated MPPT ensures you get the maximum possible energy from your solar array, especially during partial shade or cloudy conditions. Learn more in our <a href="${SITE_BASE}/knowledge-center/inverter-with-integrated-mppt">MPPT inverter guide</a>.</p>

<h2>Battery Compatibility</h2>
<p>When choosing an energy storage inverter, battery compatibility is critical. Most modern inverters support both lead-acid and lithium batteries, but the charging parameters differ significantly. Ensure your inverter can be configured for your battery type to avoid undercharging or overcharging.</p>
<p>Lithium batteries (especially LiFePO4) are increasingly popular for energy storage in Nigeria because they offer longer lifespan, deeper discharge capability, and better safety. See our <a href="${SITE_BASE}/knowledge-center/lifepo4-battery-in-nigeria">LiFePO4 battery guide</a> for more information.</p>

<h2>Sizing Your Energy Storage System</h2>
<p>Properly sizing your inverter and battery bank ensures you have enough power when you need it. The inverter capacity must handle your peak load (all appliances running simultaneously), while the battery bank must store enough energy for your desired backup duration. For detailed sizing guidance, see our <a href="${SITE_BASE}/knowledge-center/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply">inverter sizing guide</a>.</p>

<p><strong>Building an energy storage system?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> or <a href="${SITE_BASE}/solutions/backup-power">learn about backup power solutions</a>.</p>`,

  // #15 — Inverter with Integrated MPPT (was 278wc, generic)
  57245: `<h1>Inverters with Integrated MPPT: Complete Guide</h1>
<p>If you are setting up a solar power system in Nigeria, one of the most important components to understand is the MPPT charge controller — and whether to choose an inverter with integrated MPPT. This guide explains what MPPT is, how it works, and why an integrated MPPT inverter can save you money and improve your solar system's performance.</p>

<h2>What Is MPPT?</h2>
<p>MPPT stands for Maximum Power Point Tracking. It is an algorithm used in solar charge controllers to extract the maximum possible power from solar panels under varying conditions.</p>
<p>Solar panels produce different amounts of power depending on sunlight intensity, temperature, and shading. The "maximum power point" is the voltage and current combination where the panel produces its peak output. MPPT technology continuously tracks this point and adjusts the load to keep the panels operating at maximum efficiency.</p>

<h2>MPPT vs PWM Charge Controllers</h2>
<p>There are two main types of solar charge controllers:</p>
<ul>
<li><strong>PWM (Pulse Width Modulation):</strong> Simpler and cheaper, but less efficient. PWM controllers essentially connect the solar panel directly to the battery, which means the panel operates at battery voltage rather than its optimal voltage — wasting potential energy.</li>
<li><strong>MPPT:</strong> More expensive but significantly more efficient. MPPT controllers convert excess voltage into additional current, typically extracting 20-30% more energy from the same solar panels compared to PWM.</li>
</ul>
<p>For Nigerian solar systems where maximizing energy harvest is important — especially during the rainy season when sunlight is reduced — MPPT is strongly recommended.</p>

<h2>Benefits of an Integrated MPPT Inverter</h2>
<p>An inverter with integrated MPPT combines the solar charge controller and inverter into a single unit. This offers several advantages:</p>
<ul>
<li><strong>Lower cost:</strong> One unit replaces two separate components.</li>
<li><strong>Simpler installation:</strong> Fewer connections and less wiring reduce installation time and potential points of failure.</li>
<li><strong>Space savings:</strong> Ideal for homes and businesses with limited installation space.</li>
<li><strong>Better coordination:</strong> The inverter and charge controller share data internally, optimizing overall system performance.</li>
<li><strong>Single monitoring interface:</strong> Track solar input, battery status, and inverter output from one display or app.</li>
</ul>

<h2>How MPPT Maximizes Solar Energy in Nigerian Conditions</h2>
<p>Nigeria's solar conditions vary significantly — from intense midday sun to overcast rainy seasons. MPPT technology is particularly valuable because:</p>
<ul>
<li>During partial shading (common in urban areas with nearby buildings), MPPT tracks the best available power point rather than dropping to the lowest panel output.</li>
<li>In high temperatures (which reduce panel efficiency), MPPT compensates by adjusting the operating voltage.</li>
<li>During cloudy weather, MPPT extracts whatever power is available, while PWM controllers may produce very little.</li>
</ul>

<h2>Choosing the Right MPPT Inverter</h2>
<p>When selecting an inverter with integrated MPPT, consider:</p>
<ul>
<li><strong>Solar input voltage range:</strong> Ensure the inverter accepts the voltage from your solar panel array.</li>
<li><strong>Maximum charge current:</strong> Must match or exceed your solar array's output current.</li>
<li><strong>Battery compatibility:</strong> Ensure it supports your battery type (lead-acid, lithium, LiFePO4).</li>
<li><strong>Hybrid capability:</strong> If you want to combine solar with grid charging, choose a hybrid inverter with MPPT.</li>
</ul>

<p><strong>Looking for a solar inverter with MPPT?</strong> <a href="${SITE_BASE}/products/hybrid-inverters">Explore PRAG hybrid inverters</a> with integrated MPPT charge controllers.</p>`,

  // #25 — Inverters to the Rescue (was 635wc, casual blog style)
  56627: `<h1>Power Outage Solutions: How Inverters Provide Reliable Backup</h1>
<p>Power outages are a fact of life in Nigeria. Whether caused by grid instability, load shedding, or severe weather, losing electricity disrupts work, comfort, and safety. An inverter provides a quiet, clean, and reliable alternative to generators — automatically switching on when grid power fails and keeping your essential appliances running.</p>

<h2>How an Inverter Provides Backup Power</h2>
<p>An inverter stores energy in batteries when grid power is available. When the grid fails, the inverter automatically converts the stored DC battery power into AC power that your appliances can use. The switch happens within milliseconds — fast enough that most appliances continue running without interruption.</p>
<p>Unlike generators, inverters produce no noise, no exhaust fumes, and require no fuel. Once installed, they operate automatically with no manual intervention needed.</p>

<h2>What an Inverter Can Power During an Outage</h2>
<p>The appliances you can run during an outage depend on your inverter's capacity and your battery bank size. Common configurations include:</p>
<ul>
<li><strong>1-2 kVA inverter:</strong> Lights, fans, TV, Wi-Fi router, laptop/phone charging. Suitable for a small apartment or office.</li>
<li><strong>3-5 kVA inverter:</strong> Above plus a small fridge, washing machine, or microwave. Suitable for a medium home.</li>
<li><strong>5+ kVA inverter:</strong> Above plus air conditioning, larger refrigerators, or small office equipment. Suitable for larger homes or businesses.</li>
</ul>
<p>For help calculating the right size, see our <a href="${SITE_BASE}/knowledge-center/inverter-sizing-and-load-capacity-ensuring-efficient-power-supply">inverter sizing guide</a>.</p>

<h2>Inverter vs Generator: Key Advantages</h2>
<p>Many Nigerian homes and businesses rely on generators for backup power. Inverters offer several important advantages:</p>
<ul>
<li><strong>No fuel costs:</strong> Inverters charge from grid power or solar panels — no petrol or diesel needed.</li>
<li><strong>Silent operation:</strong> No engine noise, making inverters suitable for indoor use and residential areas.</li>
<li><strong>No emissions:</strong> No exhaust fumes, no carbon monoxide risk.</li>
<li><strong>Automatic switchover:</strong> No need to start the inverter manually — it switches on instantly when power fails.</li>
<li><strong>Low maintenance:</strong> No oil changes, no spark plugs, no moving parts to wear out.</li>
</ul>

<h2>Adding Solar Panels for Extended Backup</h2>
<p>If outages last longer than your battery bank can support, adding solar panels extends your backup indefinitely. A hybrid inverter can charge batteries from both grid power and solar panels, ensuring your batteries stay charged even during extended grid failures. During the day, solar panels can power your appliances directly while simultaneously charging your batteries for nighttime use.</p>

<h2>Battery Options for Inverter Systems</h2>
<p>The battery bank determines how long your inverter can provide backup power. Two main options are available:</p>
<ul>
<li><strong>Lead-acid batteries:</strong> Lower upfront cost but shorter lifespan (1-3 years) and limited discharge depth.</li>
<li><strong>Lithium (LiFePO4) batteries:</strong> Higher upfront cost but much longer lifespan (8-10+ years), deeper discharge, and better safety. See our <a href="${SITE_BASE}/knowledge-center/lifepo4-battery-in-nigeria">LiFePO4 battery guide</a> for details.</li>
</ul>

<h2>Maintaining Your Inverter System</h2>
<p>Inverters require minimal maintenance compared to generators, but basic care ensures reliable performance:</p>
<ul>
<li>Keep the inverter ventilation clear of dust and obstructions.</li>
<li>Check battery terminals periodically for corrosion.</li>
<li>Monitor battery charge levels — avoid leaving batteries fully discharged for extended periods.</li>
<li>For lead-acid batteries, check water levels (if applicable) and top up with distilled water.</li>
</ul>
<p>For more maintenance guidance, see our <a href="${SITE_BASE}/knowledge-center/maintaining-and-troubleshooting-inverters">inverter maintenance and troubleshooting guide</a>.</p>

<p><strong>Tired of power outages?</strong> <a href="${SITE_BASE}/products/inverters">Explore PRAG inverters</a> for reliable backup power in Nigeria.</p>`,

  // #29 — Stabilizer Batteries vs Traditional Backup (was confusing concept, needs rewrite)
  56604: `<h1>Voltage Stabilizer vs Backup Power: Which Do You Need?</h1>
<p>In Nigeria, power supply problems come in two forms: voltage fluctuations (too high or too low voltage from the grid) and complete power outages. These are different problems that require different solutions. A voltage stabilizer addresses the first; a backup power system (inverter or generator) addresses the second. This guide explains what each does and how to determine which you need — or whether you need both.</p>

<h2>What a Voltage Stabilizer Does</h2>
<p>A voltage stabilizer (also called an Automatic Voltage Regulator or AVR) takes unstable input voltage from the grid and delivers a stable output voltage to your appliances. In Nigeria, grid voltage often fluctuates — sometimes dropping too low for equipment to function, sometimes spiking high enough to damage electronics.</p>
<p>A voltage stabilizer continuously monitors incoming voltage and adjusts it to a safe, stable output. If the voltage goes too high or too low for the stabilizer to correct, it automatically cuts off power to protect your equipment.</p>
<p>Key points about voltage stabilizers:</p>
<ul>
<li>They do <strong>not</strong> provide backup power — when the grid goes off, the stabilizer has no power to regulate.</li>
<li>They <strong>protect equipment</strong> from voltage-related damage.</li>
<li>They are rated by capacity (kVA) and should match or exceed the total load of connected equipment.</li>
</ul>

<h2>What a Backup Power System Does</h2>
<p>A backup power system — typically an inverter with batteries or a generator — provides electricity when the grid is unavailable. It does not regulate voltage; it simply supplies power from an alternative source.</p>
<p>Key points about backup power systems:</p>
<ul>
<li>They provide power <strong>during outages</strong> but do not protect against voltage fluctuations.</li>
<li>Inverters with batteries offer silent, clean, automatic backup.</li>
<li>Generators offer higher capacity and longer runtime but require fuel and maintenance.</li>
</ul>

<h2>Do You Need a Stabilizer, Backup Power, or Both?</h2>
<h3>You need a voltage stabilizer if:</h3>
<ul>
<li>Your lights dim or brighten noticeably when other appliances switch on.</li>
<li>Electronic equipment malfunctions, restarts, or is damaged during normal grid operation.</li>
<li>You have expensive equipment (ACs, refrigerators, medical devices, industrial machinery) that needs protection from voltage spikes or drops.</li>
</ul>
<h3>You need backup power if:</h3>
<ul>
<li>Power outages regularly disrupt your home or business operations.</li>
<li>You need to keep appliances running during grid failures.</li>
<li>You want to avoid the fuel costs and noise of a generator.</li>
</ul>
<h3>You need both if:</h3>
<ul>
<li>Your area experiences both voltage fluctuations and frequent outages.</li>
<li>You have equipment that must be protected from voltage damage AND kept running during outages.</li>
</ul>

<h2>Using a Stabilizer with an Inverter System</h2>
<p>If you need both voltage stabilization and backup power, you can use a voltage stabilizer with an inverter system. The stabilizer sits between the grid and the inverter's charger, ensuring the inverter receives stable voltage for battery charging. Alternatively, many modern inverters include built-in voltage protection that handles minor fluctuations. For severe voltage problems, a dedicated stabilizer is still recommended.</p>

<h2>Choosing the Right Solution</h2>
<p>To determine the right solution for your situation:</p>
<ol>
<li>Identify whether your main problem is voltage fluctuation, outages, or both.</li>
<li>List the equipment you need to protect or keep running.</li>
<li>Calculate the total load (in watts or kVA) of that equipment.</li>
<li>Choose a stabilizer and/or inverter with capacity that matches your load.</li>
</ol>

<p><strong>Not sure whether you need a stabilizer, backup power, or both?</strong> <a href="${SITE_BASE}/products/voltage-stabilizers">Find the right voltage stabilizer</a> or <a href="${SITE_BASE}/solutions/backup-power">explore backup power solutions</a>.</p>`,

  // #36 — Why You Need Servo Stabilizer (was 254wc, ALL CAPS)
  56493: `<h1>Why You Need a Servo Voltage Stabilizer</h1>
<p>Voltage fluctuations are one of the most common power problems in Nigeria. Grid voltage can swing well above or below the levels your equipment is designed to handle, causing damage, reduced lifespan, and unexpected failures. A servo voltage stabilizer provides the most precise voltage regulation available, making it the preferred choice for protecting valuable equipment in homes, offices, and industrial settings.</p>

<h2>What Is a Servo Voltage Stabilizer?</h2>
<p>A servo voltage stabilizer uses a servo motor to continuously adjust the output voltage, maintaining a stable level regardless of input voltage fluctuations. Unlike relay stabilizers that switch between fixed voltage taps, a servo stabilizer provides smooth, continuous correction — typically achieving ±1% output accuracy even when input voltage varies by ±50%.</p>
<p>For a detailed comparison of stabilizer types, see our <a href="${SITE_BASE}/knowledge-center/what-is-the-difference-between-relay-servo-voltage-stabilizer">relay vs servo voltage stabilizer guide</a>.</p>

<h2>Why Servo Stabilizers Are Essential in Nigeria</h2>
<p>Nigerian power supply is characterized by frequent voltage fluctuations. Low voltage can cause motors in air conditioners, refrigerators, and pumps to overheat and burn out. High voltage can instantly damage electronic circuit boards in TVs, computers, and other equipment. The cost of replacing damaged equipment far exceeds the cost of a quality stabilizer.</p>
<p>Servo stabilizers are particularly important for:</p>
<ul>
<li><strong>Air conditioners and refrigerators:</strong> Compressors are especially sensitive to low voltage, which causes them to draw excess current and overheat.</li>
<li><strong>Medical equipment:</strong> Requires stable voltage for accurate operation and patient safety.</li>
<li><strong>Industrial machinery:</strong> Voltage fluctuations cause production errors, equipment damage, and downtime.</li>
<li><strong>IT and communication equipment:</strong> Sensitive electronics can be permanently damaged by voltage spikes.</li>
<li><strong>Home entertainment systems:</strong> TVs, sound systems, and gaming consoles have delicate circuitry that voltage fluctuations can destroy.</li>
</ul>

<h2>Advantages of Servo Stabilizers Over Relay Stabilizers</h2>
<p>While relay stabilizers are cheaper, servo stabilizers offer significant advantages that justify the higher cost for valuable equipment:</p>
<ul>
<li><strong>Higher precision:</strong> ±1% output accuracy vs ±10% for relay stabilizers.</li>
<li><strong>Faster correction:</strong> Servo motor adjusts continuously rather than switching between fixed taps.</li>
<li><strong>Higher capacity:</strong> Servo stabilizers are available in much larger capacities (up to hundreds of kVA) for industrial applications.</li>
<li><strong>Better durability:</strong> Servo stabilizers handle sustained fluctuations better than relay types, which wear out from frequent switching.</li>
<li><strong>Smoother output:</strong> No voltage jumps between taps — the output transitions smoothly.</li>
</ul>

<h2>Key Features to Look For</h2>
<p>When choosing a servo voltage stabilizer, look for these essential features:</p>
<ul>
<li><strong>Wide input voltage range:</strong> Should handle the full range of fluctuations in your area.</li>
<li><strong>High/low voltage cutoff:</strong> Automatically disconnects if voltage exceeds the stabilizer's range.</li>
<li><strong>Overload protection:</strong> Protects the stabilizer itself from damage.</li>
<li><strong>Surge and spike suppression:</strong> Handles sudden voltage spikes from lightning or grid switching.</li>
<li><strong>Bypass switch:</strong> Allows you to bypass the stabilizer for maintenance without disconnecting power.</li>
<li><strong>Single-phase prevention and phase reversal protection:</strong> Important for three-phase systems.</li>
</ul>

<h2>Sizing Your Servo Stabilizer</h2>
<p>Choose a servo stabilizer with a capacity (kVA) that matches or exceeds the total load of the equipment it will protect. For equipment with motors (ACs, refrigerators, pumps), account for starting surge current, which can be 2-3 times the running current. Undersizing the stabilizer will cause it to trip frequently and may damage both the stabilizer and your equipment.</p>

<p><strong>Need a servo voltage stabilizer?</strong> <a href="${SITE_BASE}/products/servo-voltage-stabilizers">Explore PRAG servo voltage stabilizers</a> for reliable equipment protection.</p>`,

  // #42 — PRAG Inverter Not Charging (was 280wc, ALL CAPS, had broken email)
  105: `<h1>PRAG Inverter Not Charging? Troubleshooting Guide</h1>
<p>If your PRAG inverter is not charging the batteries, there are several common causes you can check before contacting technical support. This guide walks you through the troubleshooting steps for PRAG inverters in the 1kVA to 2.5kVA range.</p>

<h2>Step 1: Check Input Power</h2>
<p>First, confirm that your inverter is receiving input power at the terminals:</p>
<ul>
<li>Verify that the power cable is properly connected and not loose.</li>
<li>Check that the wall socket or power source is functioning (test with another device).</li>
<li>If the inverter is not receiving power, rectify the connection and ensure it is plugged in properly.</li>
<li>If the inverter is receiving power but still not charging, proceed to the next step.</li>
</ul>

<h2>Step 2: Check Input Breakers</h2>
<p>Your inverter system has breakers that can trip and prevent charging:</p>
<ul>
<li>Check the breaker on the back of the PRAG inverter — if it is off, turn it on.</li>
<li>Check the breaker inside the control box on the wall — if it is off, turn it on.</li>
<li>If both breakers are in the correct position and the inverter still is not charging, proceed to the next step.</li>
</ul>

<h2>Step 3: Test Different Power Sources</h2>
<p>Determine whether the inverter charges from grid power but not from a generator (or vice versa):</p>
<ul>
<li>Check if the inverter charges when on grid power (NEPA/utility). If yes, proceed to test generator power.</li>
<li>Check if the inverter charges while on generator power. If it does not charge on generator but does on grid, the issue is likely generator frequency or capacity.</li>
</ul>

<h3>If the inverter does not charge on generator:</h3>
<ul>
<li><strong>Check generator frequency:</strong> The PRAG inverter requires a frequency of 50Hz to charge. If the generator frequency is off, reset it to 50Hz.</li>
<li><strong>Check generator capacity:</strong> The generator capacity should be greater than the inverter capacity by at least 5kVA. An undersized generator cannot provide enough power to both run appliances and charge the inverter batteries.</li>
</ul>

<h2>Step 4: Contact PRAG Support</h2>
<p>If you have completed all the steps above and the inverter still is not charging, contact PRAG technical support. Bring the inverter to one of our service centers:</p>
<ul>
<li><strong>Lagos:</strong> 4, Obanikoro Street, off Ikorodu Road, Obanikoro</li>
<li><strong>Port Harcourt:</strong> 18, Ezimgbu Link Road, GRA Phase IV, Mopol 19, Mummy B By-Pass</li>
<li><strong>Abuja:</strong> Shop 6, Duplex Shops, Block 5, Section 5 (Beside Daviva), Garki II Ultra-Modern Market</li>
</ul>
<p><strong>Service Hotlines:</strong></p>
<ul>
<li>Lagos: 0810 400 8414</li>
<li>Port Harcourt: 0816 625 8106</li>
<li>Abuja: 0808 101 0747</li>
</ul>
<p>Service hours: Monday to Friday, 9am to 5pm.</p>

<p><strong>Still having inverter charging issues?</strong> <a href="${SITE_BASE}/technical-support">Talk to a PRAG engineer</a> for professional support.</p>`,
};

// ─── Apply rewrites ────────────────────────────────────────────────────────

async function applyRewrites() {
  console.log('=== Step 11.1: Rewrite 8 REWRITE Articles ===');
  console.log('Articles to rewrite:', Object.keys(rewrites).length);

  const results = [];

  for (const [id, newContent] of Object.entries(rewrites)) {
    const postId = parseInt(id);
    console.log(`\n--- Post ID:${postId} ---`);

    // Read current post to get slug for logging
    const readRes = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}?context=edit`, {
      headers: { Authorization: authHeader },
    });
    if (!readRes.ok) {
      console.log(`  READ FAILED: ${readRes.status}`);
      results.push({ id: postId, status: 'READ_FAILED' });
      continue;
    }
    const post = await readRes.json();
    console.log(`  Slug: ${post.slug}`);
    console.log(`  Old content length: ${post.content?.raw?.length}`);
    console.log(`  New content length: ${newContent.length}`);

    // Update post content
    const updateRes = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}?context=edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (updateRes.ok) {
      console.log(`  REWRITE: SUCCESS`);
      results.push({ id: postId, slug: post.slug, status: 'REWRITTEN', oldLength: post.content?.raw?.length, newLength: newContent.length });
    } else {
      const body = await updateRes.text();
      console.log(`  REWRITE FAILED: ${updateRes.status} ${body.slice(0, 200)}`);
      results.push({ id: postId, slug: post.slug, status: 'REWRITE_FAILED' });
    }
  }

  // Summary
  console.log('\n=== REWRITE SUMMARY ===');
  const rewritten = results.filter(r => r.status === 'REWRITTEN').length;
  const failed = results.filter(r => r.status.includes('FAILED')).length;
  console.log(`Articles rewritten: ${rewritten}`);
  console.log(`Failed: ${failed}`);

  const summary = {
    timestamp: new Date().toISOString(),
    totalArticles: Object.keys(rewrites).length,
    rewritten,
    failed,
    results,
  };

  const outPath = path.join(__dirname, 'out', 'step11-1-rewrites-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nSummary saved: ${outPath}`);
}

applyRewrites().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
