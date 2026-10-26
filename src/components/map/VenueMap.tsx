"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { localePath } from "@/i18n";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

type LeafletNS = typeof import("leaflet");
import { MAP_CENTER, MAP_ZOOM, ZONE_META, type LatLng } from "@/lib/geo";

export type MapPin = {
  slug: string;
  name: string;
  zone: string;
  capacity: number;
  tier: string;
  lat: number;
  lng: number;
  photoUrl?: string;
  photoAlt?: string;
  photoSearch?: string;
};

const FAR_ZONES = new Set(["Essaouira", "Skoura / Desert"]);

function ensureLeafletCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

export function VenueMap({ pins, compact = false }: { pins: MapPin[]; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const LRef = useRef<LeafletNS | null>(null);
  const [ready, setReady] = useState(false);
  const [zone, setZone] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<MapPin | null>(null);
  const { locale } = useI18n();

  const zones = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of pins) counts.set(p.zone, (counts.get(p.zone) ?? 0) + 1);
    return Object.keys(ZONE_META).filter((z) => counts.has(z));
  }, [pins]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pins.filter((p) => {
      if (zone !== "all" && p.zone !== zone) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.zone.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pins, zone, query]);

  useEffect(() => {
    ensureLeafletCss();
    const el = hostRef.current;
    if (!el) return;
    let disposed = false;
    let map: LeafletMap | undefined;

    (async () => {
      const leafletMod = (await import("leaflet")) as LeafletNS & { default?: LeafletNS };
      const L = leafletMod.default ?? leafletMod;
      if (disposed || !hostRef.current) return;
      LRef.current = L;
      map = L.map(hostRef.current, {
        center: [MAP_CENTER.lat, MAP_CENTER.lng],
        zoom: MAP_ZOOM,
        scrollWheelZoom: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      requestAnimationFrame(() => map?.invalidateSize());
      setReady(true);
    })();

    return () => {
      disposed = true;
      setReady(false);
      map?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;
    layer.clearLayers();

    for (const pin of visible) {
      const color = ZONE_META[pin.zone]?.color ?? "#0d6b5c";
      const marker = L.marker([pin.lat, pin.lng], {
        icon: L.divIcon({
          className: "wpm-pin",
          iconSize: [22, 28],
          iconAnchor: [11, 26],
          popupAnchor: [0, -22],
          html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgb(28 22 20 / 0.35)"></span>`,
        }),
      });
      const img = pin.photoUrl
        ? `<img src="${escapeHtml(pin.photoUrl)}" alt="${escapeHtml(pin.photoAlt ?? pin.name)}" title="${escapeHtml(pin.photoSearch ?? pin.name)}" width="240" height="140" style="width:100%;height:140px;object-fit:cover;display:block;margin:0 0 8px" />`
        : "";
      marker.bindPopup(
        `${img}<strong>${escapeHtml(pin.name)}</strong><br/>${escapeHtml(pin.zone)} · ${pin.capacity} seated<br/><a href="${localePath(locale, `/venues/${pin.slug}`)}">View venue</a>`,
        { minWidth: 220 },
      );
      marker.on("click", () => setPicked(pin));
      marker.addTo(layer);
    }

    const fit = visible.filter((p) => (zone === "all" ? !FAR_ZONES.has(p.zone) : true));
    if (fit.length >= 2) {
      map.fitBounds(
        L.latLngBounds(fit.map((p) => [p.lat, p.lng] as [number, number])),
        { padding: [40, 40], maxZoom: zone === "all" ? 11 : 13 },
      );
    } else if (fit.length === 1) {
      map.flyTo([fit[0].lat, fit[0].lng], 13, { duration: 0.6 });
    } else if (zone !== "all" && ZONE_META[zone]) {
      const z = ZONE_META[zone];
      map.flyTo([z.lat, z.lng], 12, { duration: 0.6 });
    }
  }, [visible, ready, zone, locale]);

  function flyTo(point: LatLng, zoom = 12) {
    mapRef.current?.flyTo([point.lat, point.lng], zoom, { duration: 0.7 });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a venue or zone"
            className="h-10 flex-1 rounded-full border border-sand-deep bg-white px-4 text-sm outline-none focus:border-teal"
          />
          <p className="text-xs text-muted">{visible.length} pins</p>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <ZoneChip active={zone === "all"} onClick={() => setZone("all")} label="All zones" />
          {zones.map((z) => (
            <ZoneChip
              key={z}
              active={zone === z}
              onClick={() => {
                setZone(z);
                const meta = ZONE_META[z];
                if (meta) flyTo(meta, FAR_ZONES.has(z) ? 11 : 12);
              }}
              label={ZONE_META[z]?.label ?? z}
              color={ZONE_META[z]?.color}
            />
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-sand-deep bg-white shadow-card">
          <div ref={hostRef} className={`w-full ${compact ? "h-[38vh] min-h-[280px]" : "h-[62vh] min-h-[420px]"}`} />
        </div>
      </div>

      <aside className="space-y-3">
        {zone !== "all" && ZONE_META[zone] ? (
          <div className="rounded-2xl border border-sand-deep bg-white p-4 shadow-card">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Zone</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{ZONE_META[zone].label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ZONE_META[zone].blurb}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
              <div>{ZONE_META[zone].drive}</div>
              <div>{ZONE_META[zone].guests} guests</div>
            </dl>
            <LocaleLink href={`/venues?zone=${encodeURIComponent(zone)}`} className="mt-3 inline-block text-sm font-semibold text-teal">
              Browse venues here →
            </LocaleLink>
          </div>
        ) : (
          <div className="rounded-2xl border border-sand-deep bg-white p-4 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink">Wedding zones</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Tap a zone to zoom. Pins are placed on known sites; others sit near the heart of their neighbourhood.
            </p>
          </div>
        )}

        {picked ? (
          <div className="overflow-hidden rounded-2xl bg-[#14221e] text-cream">
            {picked.photoUrl ? (
              <img
                src={picked.photoUrl}
                alt={picked.photoAlt ?? picked.name}
                title={picked.photoSearch}
                className="h-36 w-full object-cover"
              />
            ) : null}
            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">{picked.zone}</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{picked.name}</h3>
              <p className="mt-1 text-sm text-white/70">
                {picked.tier} · {picked.capacity} seated
              </p>
              {picked.photoSearch ? (
                <p className="mt-2 text-[11px] leading-relaxed text-white/45">Image search: {picked.photoSearch}</p>
              ) : null}
              <LocaleLink
                href={`/venues/${picked.slug}`}
                className="mt-3 inline-flex rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white"
              >
                Venue page
              </LocaleLink>
            </div>
          </div>
        ) : null}

        <ul className={`space-y-1 overflow-y-auto rounded-2xl border border-sand-deep bg-white/80 p-2 ${compact ? "max-h-[28vh]" : "max-h-[42vh]"}`}>
          {visible.slice(0, 40).map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => {
                  setPicked(p);
                  flyTo({ lat: p.lat, lng: p.lng }, 14);
                }}
                className={`flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sand ${
                  picked?.slug === p.slug ? "bg-sand" : ""
                }`}
              >
                <span>
                  <span className="block font-medium text-ink">{p.name}</span>
                  <span className="block text-[11px] text-muted">{p.zone}</span>
                </span>
                <span className="shrink-0 tabular-nums text-[11px] text-muted">{p.capacity}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function ZoneChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        active ? "bg-teal text-white" : "bg-white text-ink-soft ring-1 ring-sand-deep"
      }`}
    >
      {color ? (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: active ? "#fff" : color }} />
      ) : null}
      {label}
    </button>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
