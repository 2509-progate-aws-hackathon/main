"use client";

import Map from './components/Map';
import { mockAccidentReports } from './data/mockAccidentReports';

export default function Home() {
  return (
    <Map 
      accidentReports={mockAccidentReports}
      onAccidentMarkerClick={(report) => {
        console.log('事故マーカークリック:', report);
        alert(`事故詳細: ${report.title}\n場所: ${report.location}`);
      }}
    />
  );
}
