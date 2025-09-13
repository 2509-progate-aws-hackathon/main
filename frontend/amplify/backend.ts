import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { CfnAPIKey } from "aws-cdk-lib/aws-location";

export const backend = defineBackend({
  auth,
  data,
});

const locationStack = backend.createStack("location-stack");
const locationApiKey = new CfnAPIKey(locationStack, "LocationApiKey", {
  keyName: "amplify-location-service-api-key",
  description: "API key for Amazon Location Service v2",
  noExpiry: true,
  restrictions: {
    allowActions: [
      "geo-maps:*"
    ],
    allowResources: [
      `arn:aws:geo-maps:${locationStack.region}::provider/default`
    ]
  }
});