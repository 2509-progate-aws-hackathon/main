"use client";

import maplibregl from 'maplibre-gl';
import { useRef, useEffect } from 'react';

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);

  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE;

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://maps.geo.${region}.amazonaws.com/v2/styles/${mapStyle}/descriptor?key=${mapApiKey}`,
      center: [139.767, 35.681],
      zoom: 11,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      })
    );

    // クリーンアップ関数
    return () => {
      map.remove();
    };
  }, [region, mapApiKey, mapStyle]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
  );
}
