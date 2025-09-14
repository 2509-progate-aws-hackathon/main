"use client";

import { useState } from 'react';
import Map from '../components/Map';
import BedrockChat from '../components/BedrockChat';
import AccidentReportDetail from '../components/AccidentReport/AccidentReportDetail';
import { mockAccidentReports } from '../data/mockAccidentReports';
import type { AccidentReport } from '../types/AccidentReport';

export default function Home() {
  const [bedrockAccidentReports, setBedrockAccidentReports] = useState<AccidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AccidentReport | null>(null);

  // チャットから事故データを受信したときの処理
  const handleAccidentDataReceived = (reports: AccidentReport[]) => {
    console.log('Bedrockから事故データを受信:', reports);
    setBedrockAccidentReports(reports);
  };

  // マップに表示する事故データ（既存のモックデータ + Bedrockデータ）
  const allAccidentReports = [...mockAccidentReports, ...bedrockAccidentReports];

  const handleAccidentMarkerClick = (report: AccidentReport) => {
    console.log('事故マーカークリック:', report.title, report);
    setSelectedReport(report);
  };
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100 relative">
      {/* 左側/上側: マップ */}
      <div className="flex-1 min-h-0">
        <Map 
          accidentReports={allAccidentReports}
          onAccidentMarkerClick={handleAccidentMarkerClick}
        />
      </div>
      
      {/* 右側/下側: チャット */}
      <div className="w-full lg:w-96 h-96 lg:h-full p-4 relative">
        <BedrockChat 
          className="h-full"
          height="flex-1"
          onAccidentDataReceived={handleAccidentDataReceived}
        />
        
      </div>

    </div>
  );
}
