"use client";

import Map from './components/Map';
import { mockAccidentReports } from './data/mockAccidentReports';

export default function Home() {
  return (
    <Map 
      accidentReports={mockAccidentReports}
      onAccidentMarkerClick={(report) => {
        console.log('事故マーカークリック:', report);
      }}
    />
  );
}
