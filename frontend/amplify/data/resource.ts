import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== ACCIDENT REPORT SCHEMA ==============================================
交通事故データ管理システム用のGraphQLスキーマ定義
58個のCSVカラムに対応した完全なデータモデル
=========================================================================*/
const schema = a.schema({
  AccidentReport: a
    .model({
      // 基本情報 (6項目)
      occurrenceDateTime: a.datetime().required(),
      weather: a.string(),
      location: a.string(),
      geography: a.string(),  // geography 型だが、ここでは string として扱う
      vehicleId: a.string(),
      
      // 事故詳細 (6項目)
      accidentTypeCategory: a.string(),
      orderOfAccidentOccurrence: a.integer(),
      fallHeight: a.float(),
      waterDepth: a.float(),
      collisionCondition: a.string(),
      accidentLocation: a.string(),
      
      // 車両情報 (8項目)
      vehicle1ModelName: a.string(),
      vehicle1ModelType: a.string(),
      vehicle1BodyType: a.string(),
      vehicle1YearOfRegistration: a.integer(),
      vehicle1SeatingCapacity: a.integer(),
      vehicle1LoadAtTime: a.float(),
      vehicle1MaxLoadCapacity: a.float(),
      cargoContents: a.string(),
      
      // 危険物情報 (2項目)
      transportOfHazardousMaterial: a.boolean(),
      typeOfHazardousMaterial: a.string(),
      
      // 道路環境 (6項目)
      roadType: a.string(),
      roadSurfaceCondition: a.string(),
      warningSignsInstalled: a.boolean(),
      speedLimitOnRoad: a.integer(),
      railwayCrossingCondition: a.string(),
      
      // リスク認識・行動 (4項目)
      speedAtRiskRecognition: a.float(),
      distanceAtRiskRecognition: a.float(),
      slipDistance: a.float(),
      vehicleBehaviorAtAccident: a.string(),
      
      // 負傷・損害情報 (4項目)
      conditionOfInjuredOrDeceased: a.string(),
      faultLocation: a.string(),
      permanentTemporary: a.string(),
      damageLevel: a.string(),
      
      // 運転者情報 (6項目)
      daysOffInPastMonth: a.integer(),
      workingHoursUntilAccident: a.float(),
      distanceDrivenUntilAccident: a.float(),
      daysWorkedSinceLastDayOff: a.integer(),
      totalDistanceDrivenSinceLastDayOff: a.float(),
      seatbeltUsage: a.boolean(),
      
      // 統計情報 (8項目)
      numberOfAccidents: a.integer(),
      numberOfViolations: a.integer(),
      numberOfDeaths: a.integer(),
      numberOfDeathsPassengers: a.integer(),
      numberOfSeriousInjuries: a.integer(),
      numberOfSeriousInjuriesPassengers: a.integer(),
      numberOfMinorInjuries: a.integer(),
      numberOfMinorInjuriesPassengers: a.integer(),
      
      // 総走行距離・改造情報 (8項目)
      totalDrivenDistance: a.float(),
      modificationContents: a.string(),
      dateOfModification: a.date(),
      brokenOrDetachedPartName: a.string(),
      drivenDistanceSinceInstallation: a.float(),
      modificationDate1: a.date(),
      modificationDate2: a.date(),
      modificationDate3: a.date(),
      
      // その他 (3項目)
      fatigueOrSuddenBreakageType: a.string(),
      title: a.string(),
      description: a.string(),
    })
    .authorization((allow) => [allow.guest()]),

  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
