"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getStoredToken } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="bg-background text-on-surface font-body antialiased">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#f6fafb]/80 backdrop-blur-xl border-b border-[#f0f4f5]">
        <div className="flex justify-between items-center px-12 py-4 max-w-[1440px] mx-auto">
          <div className="text-xl font-bold tracking-tight text-[#006383] font-headline">limpid</div>
          <div className="hidden md:flex gap-8 items-center font-label text-xs">
            <a className="text-[#006383] border-b border-[#006383] pb-1" href="#">PLATFORM</a>
            <a className="text-[#5c6264] hover:text-[#006383] border-b border-transparent pb-1 hover:border-[#006383] transition-colors cursor-pointer" href="#how-it-works">HOW_IT_WORKS</a>
            <a className="text-[#5c6264] hover:text-[#006383] border-b border-transparent pb-1 hover:border-[#006383] transition-colors cursor-pointer" href="#data-map">DATA_MAP</a>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-[10px] font-label font-bold uppercase tracking-widest text-primary border border-primary/20 px-4 py-2 rounded transition-colors hover:bg-primary/5">Login</Link>
            <Link href="/login" className="text-[10px] font-label font-bold uppercase tracking-widest bg-primary text-on-primary px-4 py-2 rounded hover:bg-primary-container transition-all shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">

        {/* HERO */}
        <section className="relative max-w-[1440px] mx-auto px-6 md:px-12 py-16 flex items-center overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">

            {/* Left copy */}
            <div className="lg:col-span-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded mb-8">
                <span className="material-symbols-outlined text-[14px] text-primary">terminal</span>
                <span className="font-label text-[10px] font-bold tracking-widest text-primary uppercase">EDGE_AI: MICROPLASTIC_DETECTION</span>
              </div>
              <h1 className="font-headline text-4xl md:text-5xl leading-[1.1] font-bold mb-6 text-on-surface">
                Real-Time <span className="gradient-text">Microplastic Detection</span> from Field to Dashboard.
              </h1>
              <p className="font-body text-base text-on-surface-variant mb-10 max-w-lg leading-relaxed">
                An end-to-end system combining iPhone microscopy, Arduino UNO Q edge inference, and AWS-powered cloud ingestion to map microplastic contamination in water sources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="bg-primary text-on-primary font-label text-xs font-bold uppercase tracking-widest px-8 py-4 rounded border border-primary shadow-lg hover:bg-primary-container transition-all text-center">Explore Dashboard</Link>
              </div>
            </div>

            {/* Right: pipeline status card */}
            <div className="lg:col-span-6 relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
              <div className="relative rounded-xl overflow-hidden bg-surface-container border border-outline-variant/50 clinical-shadow aspect-[4/3]">
                <div className="absolute inset-0 blueprint-bg pointer-events-none"></div>
                <div className="absolute top-3 left-3 font-label text-[9px] text-outline font-bold bg-white/80 px-2 py-1 border border-outline-variant/30">SYSTEM_PIPELINE</div>

                <div className="relative z-10 flex flex-col justify-center h-full p-8 gap-6">
                  {/* Pipeline layers */}
                  {[
                    { icon: "smartphone",    layer: "LAYER_01", label: "iPhone Capture",       detail: "400× microscopy · GPS-tagged",    status: "ACTIVE" },
                    { icon: "memory",        layer: "LAYER_02", label: "Arduino Edge AI",       detail: "TFLite Micro · <2 s inference",   status: "ACTIVE" },
                    { icon: "cloud_upload",  layer: "LAYER_03", label: "AWS Cloud Ingest",      detail: "IoT Core → Lambda → DynamoDB",   status: "ACTIVE" },
                    { icon: "dashboard",     layer: "LAYER_04", label: "Dashboard Analytics",   detail: "Live map · filters · export",    status: "ACTIVE" },
                  ].map((step, i) => (
                    <div key={step.layer} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-base">{step.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-label text-[9px] font-bold text-outline uppercase">{step.layer}</span>
                          <span className="font-label text-[10px] font-bold text-on-surface uppercase">{step.label}</span>
                        </div>
                        <span className="font-body text-[10px] text-on-surface-variant">{step.detail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="font-label text-[9px] font-bold text-primary">{step.status}</span>
                      </div>
                      {i < 3 && (
                        <div className="absolute left-[2.75rem] mt-8 w-px h-6 bg-primary/20" style={{ marginTop: `${(i + 1) * 64 + 12}px` }} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded border border-primary/20">
                  <span className="block font-label text-[9px] text-primary font-bold">DETECTION_STATUS</span>
                  <span className="block font-headline text-lg font-bold text-on-surface">NOMINAL_±0.2μm</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-surface-container-low py-24 px-6 md:px-12 border-y border-outline-variant/20">
          <div className="max-w-[1440px] mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-3xl font-bold mb-4 text-on-surface">The Limpid Pipeline</h2>
              <p className="font-body text-on-surface-variant max-w-2xl">Four integrated layers transform a field water sample into actionable environmental contamination data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Step 01: Field Capture */}
              <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/30 flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-100">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <h3 className="font-headline text-lg font-bold mb-3 text-on-surface">01. Field Capture</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">iPhone app captures 400x magnified microscope images of water samples. GPS coordinates and timestamp are recorded automatically at the point of collection.</p>

                {/* iPhone capture illustration */}
                <div className="relative rounded overflow-hidden bg-surface-container border border-outline-variant/30 aspect-[16/9] mb-6">
                  <div className="absolute inset-0 blueprint-bg pointer-events-none"></div>
                  <div className="relative z-10 h-full flex items-center justify-around px-6">

                    {/* Phone mockup */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-20 border-2 border-primary/40 rounded-lg bg-surface-container-highest relative flex items-center justify-center">
                        <div className="absolute top-1 w-4 h-0.5 bg-outline-variant rounded-full"></div>
                        <span className="material-symbols-outlined text-primary text-2xl">photo_camera</span>
                        <div className="absolute bottom-1 w-3 h-3 rounded-full border border-outline-variant"></div>
                      </div>
                      <span className="font-label text-[8px] font-bold text-primary uppercase">iPhone App</span>
                    </div>

                    {/* Arrow */}
                    <span className="material-symbols-outlined text-outline/60 text-lg">arrow_forward</span>

                    {/* Sample data readout */}
                    <div className="bg-surface-container-highest border border-outline-variant/40 rounded p-3 space-y-1.5 min-w-[130px]">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span className="font-label text-[8px] font-bold text-primary uppercase">Capturing…</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-body text-[9px] text-on-surface-variant">Magnification</span>
                        <span className="font-label text-[9px] font-bold text-on-surface">400×</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-body text-[9px] text-on-surface-variant">GPS</span>
                        <span className="font-label text-[9px] font-bold text-primary">32.68°N</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-body text-[9px] text-on-surface-variant">Timestamp</span>
                        <span className="font-label text-[9px] font-bold text-on-surface">14:32:11Z</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="font-body text-[9px] text-on-surface-variant">Format</span>
                        <span className="font-label text-[9px] font-bold text-on-surface">HEIC/RAW</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="font-label text-[10px] font-bold text-primary uppercase">iOS App / AVFoundation + CoreLocation</span>
                  <span className="font-label text-[10px] text-outline-variant">LAYER_01</span>
                </div>
              </div>

              {/* Step 02: Edge Inference */}
              <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/30 flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <h3 className="font-headline text-lg font-bold mb-3 text-on-surface">02. Edge Inference</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-4">Arduino UNO Q runs a quantized TFLite model on-device. Outputs a microplastic particle estimate and confidence score in under 2 seconds — no cloud compute required.</p>
                <div className="code-snippet rounded p-4 text-[11px] mb-6 border border-on-surface/10 overflow-x-auto">
                  <pre className="leading-tight"><code>{`// AquaScan Edge Inference v1
void run_inference(uint8_t* frame) {
  model.setInput(frame, FRAME_SIZE);
  TfLiteStatus s = interpreter.Invoke();
  if (s == kTfLiteOk) {
    float est  = output->data.f[0];
    float conf = output->data.f[1];
    upload_result(est, conf, gps_fix);
  }
}`}</code></pre>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="font-label text-[10px] font-bold text-primary uppercase">Arduino UNO Q / TFLite Micro</span>
                  <span className="font-label text-[10px] text-outline-variant">LAYER_02</span>
                </div>
              </div>

              {/* Step 03: Cloud Ingest */}
              <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/30 flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined">cloud_upload</span>
                </div>
                <h3 className="font-headline text-lg font-bold mb-3 text-on-surface">03. Cloud Ingest</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">The Arduino UNO Q publishes inference results and device metadata to AWS IoT Core via MQTT. An IoT Rule triggers a Lambda function to validate and write records to DynamoDB. The iPhone uploads sample images directly to S3 via presigned URL — keeping binary data out of the device ingest path.</p>

                {/* AWS architecture illustration */}
                <div className="relative rounded overflow-hidden bg-surface-container border border-outline-variant/30 aspect-[16/9] mb-6">
                  <div className="absolute inset-0 blueprint-bg pointer-events-none"></div>
                  <div className="relative z-10 h-full flex flex-col justify-center px-4 gap-3">

                    {/* MQTT row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/30 rounded px-2 py-1">
                        <span className="material-symbols-outlined text-primary text-sm">memory</span>
                        <span className="font-label text-[8px] font-bold text-on-surface">Arduino</span>
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <div className="flex-1 border-t border-dashed border-outline-variant/50"></div>
                        <span className="font-label text-[8px] text-outline uppercase">MQTT</span>
                        <div className="flex-1 border-t border-dashed border-outline-variant/50"></div>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/30 rounded px-2 py-1">
                        <span className="material-symbols-outlined text-primary text-sm">wifi_tethering</span>
                        <span className="font-label text-[8px] font-bold text-on-surface">IoT Core</span>
                      </div>
                      <span className="material-symbols-outlined text-outline/60 text-sm">arrow_forward</span>
                      <div className="flex items-center gap-1 bg-surface-container-highest border border-outline-variant/30 rounded px-2 py-1">
                        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                        <span className="font-label text-[8px] font-bold text-on-surface">Lambda</span>
                      </div>
                    </div>

                    {/* Storage row */}
                    <div className="flex items-center gap-2 pl-8">
                      <div className="w-px h-4 bg-outline-variant/40 ml-2"></div>
                      <span className="material-symbols-outlined text-outline/40 text-sm rotate-90">arrow_forward</span>
                    </div>
                    <div className="flex items-center gap-3 pl-6">
                      <div className="flex items-center gap-1 bg-primary/5 border border-primary/20 rounded px-2 py-1">
                        <span className="material-symbols-outlined text-primary text-sm">table_chart</span>
                        <span className="font-label text-[8px] font-bold text-primary">DynamoDB</span>
                      </div>
                      <span className="font-label text-[8px] text-outline">+</span>
                      <div className="flex items-center gap-1 bg-primary/5 border border-primary/20 rounded px-2 py-1">
                        <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                        <span className="font-label text-[8px] font-bold text-primary">S3 Images</span>
                      </div>
                      <span className="font-label text-[8px] text-outline ml-auto">presigned URL ↑</span>
                    </div>

                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="font-label text-[10px] font-bold text-primary uppercase">AWS IoT Core / Lambda / DynamoDB + S3</span>
                  <span className="font-label text-[10px] text-outline-variant">LAYER_03</span>
                </div>
              </div>

              {/* Step 04: Dashboard & Map */}
              <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/30 flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-[400ms]">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-6 text-primary">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <h3 className="font-headline text-lg font-bold mb-3 text-on-surface">04. Dashboard &amp; Map</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6">Researchers view contamination heatmaps, filter by date/device/confidence, and export data. Role-based access for admin, researcher, and viewer accounts.</p>

                {/* Dashboard CTA */}
                <Link
                  href="/login"
                  className="relative rounded overflow-hidden bg-surface-container border border-primary/30 aspect-[16/9] mb-6 flex items-center justify-center group hover:border-primary/60 transition-colors"
                >
                  <div className="absolute inset-0 blueprint-bg pointer-events-none"></div>
                  <div className="relative z-10 text-center px-6">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-2xl text-primary">open_in_new</span>
                    </div>
                    <p className="font-label text-[11px] font-bold text-primary uppercase tracking-widest">Open Live Dashboard</p>
                    <p className="font-body text-[10px] text-on-surface-variant mt-1">Sign in to explore the contamination map</p>
                  </div>
                </Link>

                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                  <span className="font-label text-[10px] font-bold text-primary uppercase">Next.js / Leaflet</span>
                  <span className="font-label text-[10px] text-outline-variant">LAYER_04</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-inverse-surface py-16 px-6 md:px-12">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-headline text-4xl font-bold text-primary-fixed-dim mb-2">&lt; 2s</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline-variant">Edge Inference Latency</div>
            </div>
            <div>
              <div className="font-headline text-4xl font-bold text-primary-fixed-dim mb-2">±0.2μm</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline-variant">Detection Resolution</div>
            </div>
            <div>
              <div className="font-headline text-4xl font-bold text-primary-fixed-dim mb-2">99.9%</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline-variant">API Uptime SLA</div>
            </div>
            <div>
              <div className="font-headline text-4xl font-bold text-primary-fixed-dim mb-2">OSS</div>
              <div className="font-label text-[10px] uppercase tracking-widest text-outline-variant">Open Source Hardware</div>
            </div>
          </div>
        </section>

        {/* DATA MAP PREVIEW */}
        <section id="data-map" className="py-24 px-6 md:px-12 bg-background">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Map preview — links to live map */}
            <Link
              href="/login"
              className="order-2 lg:order-1 relative rounded-lg border border-outline-variant/40 overflow-hidden clinical-shadow h-[500px] bg-surface-container-highest group hover:border-primary/40 transition-colors"
            >
              <div className="absolute inset-0 blueprint-bg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary">travel_explore</span>
                  </div>
                  <p className="font-label text-[11px] font-bold text-primary uppercase tracking-widest">View Live Contamination Map</p>
                  <p className="font-body text-xs text-on-surface-variant mt-2">Sign in to explore geotagged sample data</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-primary font-label text-[10px] font-bold uppercase border border-primary/20 px-4 py-2 rounded group-hover:bg-primary/10 transition-colors">
                    <span>Open Map</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="glass-panel px-3 py-1 border border-outline-variant/30 text-[9px] font-label font-bold text-on-surface">SYSTEM_HEALTH: ACTIVE</div>
                  <div className="flex gap-2">
                    <div className="bg-primary/90 text-on-primary px-2 py-1 rounded text-[9px] font-label font-bold">LAT: 32.6819° N</div>
                    <div className="bg-primary/90 text-on-primary px-2 py-1 rounded text-[9px] font-label font-bold">LON: 117.1835° W</div>
                  </div>
                </div>
                <div className="glass-panel w-64 rounded p-4 border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between mb-3">
                    <span className="font-label text-[9px] font-bold text-primary uppercase">Node_Register_SD1A</span>
                    <span className="material-symbols-outlined text-xs">settings</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                      <span className="font-body text-[10px] text-on-surface-variant">Packet Count</span>
                      <span className="font-label font-bold text-[10px]">2,847</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/10 pb-1">
                      <span className="font-body text-[10px] text-on-surface-variant">Signal Strength</span>
                      <span className="font-label font-bold text-[10px] text-primary">-61 dBm</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Right: Copy */}
            <div className="order-1 lg:order-2">
              <h2 className="font-headline text-3xl font-bold mb-6 text-on-surface leading-tight">Global Contamination Mapping. Live.</h2>
              <p className="font-body text-on-surface-variant text-base mb-8 leading-relaxed">
                Every field scan is geotagged and uploaded in real time. The dashboard aggregates readings from all active devices into a live contamination map — enabling researchers to spot pollution hotspots and track remediation progress.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">my_location</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface uppercase mb-1">Clustered Markers</h4>
                    <p className="font-body text-xs text-on-surface-variant">Interactive popup with sample metadata, estimate, confidence, and device ID on click.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">filter_list</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface uppercase mb-1">Filter Controls</h4>
                    <p className="font-body text-xs text-on-surface-variant">Date range, device, minimum confidence threshold, and estimate range filters update the map instantly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-4 border border-outline-variant/20 rounded bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">data_array</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm text-on-surface uppercase mb-1">Raw Data Export</h4>
                    <p className="font-body text-xs text-on-surface-variant">Download filtered sample datasets as JSON or CSV for independent analysis and model training.</p>
                  </div>
                </li>
              </ul>
              <Link href="/login" className="bg-primary text-on-primary font-label text-xs font-bold uppercase tracking-widest px-8 py-4 rounded border border-primary shadow-md hover:bg-primary-container transition-all inline-flex items-center gap-2">
                <span>VIEW_LIVE_MAP</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-surface-container-low border-y border-outline-variant/20 py-24 px-6 md:px-12">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded mb-6">
                <span className="material-symbols-outlined text-[14px] text-primary">science</span>
                <span className="font-label text-[10px] font-bold tracking-widest text-primary uppercase">OPEN_SOURCE // COMMUNITY_DRIVEN</span>
              </div>
              <h2 className="font-headline text-3xl font-bold mb-4 text-on-surface leading-tight">Start Monitoring Your Water Source.</h2>
              <p className="font-body text-on-surface-variant max-w-lg leading-relaxed">Pair an iPhone and Arduino UNO Q to collect and analyze water samples in the field. Results upload to AWS in real time and appear on the live contamination map.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link href="/login" className="bg-primary text-on-primary font-label text-xs font-bold uppercase tracking-widest px-8 py-4 rounded border border-primary shadow-lg hover:bg-primary-container transition-all text-center">Deploy a Node</Link>
              <Link href="/login" className="bg-surface-container-lowest text-on-surface font-label text-xs font-bold uppercase tracking-widest px-8 py-4 rounded border border-outline-variant/40 hover:bg-surface-variant transition-colors text-center">Browse Dataset</Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-on-surface text-white w-full py-12 px-12 border-t border-outline/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-[1440px] mx-auto">
          <div>
            <div className="text-lg font-bold text-primary-fixed mb-4 font-headline uppercase tracking-tighter">Limpid_Platform_Lab</div>
            <p className="font-body text-xs text-secondary-fixed-dim max-w-sm mb-6">Open-source tools for planetary-scale microplastic detection and remediation monitoring. Built at DataHacks 2026.</p>
            <div className="font-label text-[10px] tracking-widest uppercase text-outline-variant">
              © 2026 LIMPID // BUILD: 0xB3E1
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 font-label text-[10px] tracking-widest uppercase">
            <div className="flex flex-col gap-4">
              <span className="text-primary-fixed-dim">PLATFORM</span>
              <Link className="text-outline-variant hover:text-white transition-colors" href="/login">Dashboard</Link>
              <Link className="text-outline-variant hover:text-white transition-colors" href="/login">Sample Map</Link>
              <Link className="text-outline-variant hover:text-white transition-colors" href="/login">Devices</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-primary-fixed-dim">ACCOUNT</span>
              <Link className="text-outline-variant hover:text-white transition-colors" href="/login">Sign In</Link>
              <Link className="text-outline-variant hover:text-white transition-colors" href="/login">Get Started</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
