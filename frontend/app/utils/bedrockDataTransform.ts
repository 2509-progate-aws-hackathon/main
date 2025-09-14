import type { AccidentReport } from '../types/AccidentReport';

/**
 * BedrockのAPIレスポンスをAccidentReport型に変換する
 */
export function transformBedrockDataToAccidentReports(bedrockData: any): AccidentReport[] {
    if (!bedrockData?.structured_data || !Array.isArray(bedrockData.structured_data)) {
        return [];
    }

    return bedrockData.structured_data.map((item: any): AccidentReport => ({
        id: item.id?.toString() || `bedrock-${Date.now()}-${Math.random()}`,

        // 基本情報
        occurrenceDateTime: item.occurrenceDateTime || '',
        weather: item.weather || undefined,
        location: item.location || undefined,
        latitude: typeof item.latitude === 'number' ? item.latitude : undefined,
        longitude: typeof item.longitude === 'number' ? item.longitude : undefined,
        vehicleId: item.vehicleId || undefined,

        // 事故詳細
        accidentTypeCategory: item.accidentTypeCategory || undefined,
        orderOfAccidentOccurrence: item.orderOfAccidentOccurrence || undefined,
        fallHeight: typeof item.fallHeight === 'number' ? item.fallHeight : undefined,
        waterDepth: typeof item.waterDepth === 'number' ? item.waterDepth : undefined,
        collisionCondition: item.collisionCondition || undefined,
        accidentLocation: item.accidentLocation || undefined,

        // 車両情報
        vehicle1ModelName: item.vehicle1ModelName || undefined,
        vehicle1ModelType: item.vehicle1ModelType || undefined,
        vehicle1BodyType: item.vehicle1BodyType || undefined,
        vehicle1YearOfRegistration: typeof item.vehicle1YearOfRegistration === 'number' ? item.vehicle1YearOfRegistration : undefined,
        vehicle1SeatingCapacity: typeof item.vehicle1SeatingCapacity === 'number' ? item.vehicle1SeatingCapacity : undefined,
        vehicle1LoadAtTime: typeof item.vehicle1LoadAtTime === 'number' ? item.vehicle1LoadAtTime : undefined,
        vehicle1MaxLoadCapacity: typeof item.vehicle1MaxLoadCapacity === 'number' ? item.vehicle1MaxLoadCapacity : undefined,
        cargoContents: item.cargoContents || undefined,

        // 危険物情報
        transportOfHazardousMaterial: typeof item.transportOfHazardousMaterial === 'boolean' ? item.transportOfHazardousMaterial : undefined,
        typeOfHazardousMaterial: item.typeOfHazardousMaterial || undefined,

        // 道路環境
        roadType: item.roadType || undefined,
        roadSurfaceCondition: item.roadSurfaceCondition || undefined,
        warningSignsInstalled: typeof item.warningSignsInstalled === 'boolean' ? item.warningSignsInstalled : undefined,
        speedLimitOnRoad: typeof item.speedLimitOnRoad === 'number' ? item.speedLimitOnRoad : undefined,
        railwayCrossingCondition: item.railwayCrossingCondition || undefined,

        // リスク認識・行動
        speedAtRiskRecognition: typeof item.speedAtRiskRecognition === 'number' ? item.speedAtRiskRecognition : undefined,
        distanceAtRiskRecognition: typeof item.distanceAtRiskRecognition === 'number' ? item.distanceAtRiskRecognition : undefined,
        slipDistance: typeof item.slipDistance === 'number' ? item.slipDistance : undefined,
        vehicleBehaviorAtAccident: item.vehicleBehaviorAtAccident || undefined,

        // 負傷・損害情報
        conditionOfInjuredOrDeceased: item.conditionOfInjuredOrDeceased || undefined,
        faultLocation: item.faultLocation || undefined,
        damageLevel: item.damageLevel || undefined,
        seatbeltUsage: typeof item.seatbeltUsage === 'boolean' ? item.seatbeltUsage : undefined,

        // 勤務情報
        permanentTemporary: item.permanentTemporary || undefined,
        daysOffInPastMonth: typeof item.daysOffInPastMonth === 'number' ? item.daysOffInPastMonth : undefined,
        workingHoursUntilAccident: typeof item.workingHoursUntilAccident === 'number' ? item.workingHoursUntilAccident : undefined,
        distanceDrivenUntilAccident: typeof item.distanceDrivenUntilAccident === 'number' ? item.distanceDrivenUntilAccident : undefined,
        daysWorkedSinceLastDayOff: typeof item.daysWorkedSinceLastDayOff === 'number' ? item.daysWorkedSinceLastDayOff : undefined,
        totalDistanceDrivenSinceLastDayOff: typeof item.totalDistanceDrivenSinceLastDayOff === 'number' ? item.totalDistanceDrivenSinceLastDayOff : undefined,

        // 事故統計
        numberOfAccidents: typeof item.numberOfAccidents === 'number' ? item.numberOfAccidents : undefined,
        numberOfViolations: typeof item.numberOfViolations === 'number' ? item.numberOfViolations : undefined,
        numberOfDeaths: typeof item.numberOfDeaths === 'number' ? item.numberOfDeaths : undefined,
        numberOfDeathsPassengers: typeof item.numberOfDeathsPassengers === 'number' ? item.numberOfDeathsPassengers : undefined,
        numberOfSeriousInjuries: typeof item.numberOfSeriousInjuries === 'number' ? item.numberOfSeriousInjuries : undefined,
        numberOfSeriousInjuriesPassengers: typeof item.numberOfSeriousInjuriesPassengers === 'number' ? item.numberOfSeriousInjuriesPassengers : undefined,
        numberOfMinorInjuries: typeof item.numberOfMinorInjuries === 'number' ? item.numberOfMinorInjuries : undefined,
        numberOfMinorInjuriesPassengers: typeof item.numberOfMinorInjuriesPassengers === 'number' ? item.numberOfMinorInjuriesPassengers : undefined,

        // 走行情報
        totalDrivenDistance: typeof item.totalDrivenDistance === 'number' ? item.totalDrivenDistance : undefined,

        // 改造・修理情報
        modificationContents: item.modificationContents || undefined,
        dateOfModification: item.dateOfModification || undefined,
        brokenOrDetachedPartName: item.brokenOrDetachedPartName || undefined,
        drivenDistanceSinceInstallation: typeof item.drivenDistanceSinceInstallation === 'number' ? item.drivenDistanceSinceInstallation : undefined,
        modificationDate1: item.modificationDate1 || undefined,
        modificationDate2: item.modificationDate2 || undefined,
        modificationDate3: item.modificationDate3 || undefined,
        fatigueOrSuddenBreakageType: item.fatigueOrSuddenBreakageType || undefined,

        // メタデータ
        title: item.title || `事故レポート ${item.id}`,
        description: item.description || undefined,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
    }));
}
