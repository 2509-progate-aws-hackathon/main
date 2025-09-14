import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { CfnAPIKey } from "aws-cdk-lib/aws-location";
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
});

// Location Service用のスタック
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

// RDS Data API用のスタックとIAM設定
const rdsStack = backend.createStack("rds-data-api-stack");

// Cognitoの未認証ロールにRDS Data API権限を追加
backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "rds-data:ExecuteStatement",
      "rds-data:BeginTransaction", 
      "rds-data:CommitTransaction",
      "rds-data:RollbackTransaction"
    ],
    resources: [
      `arn:aws:rds:${rdsStack.region}:${rdsStack.account}:cluster:jiko-database`
    ]
  })
);

// Secrets Manager権限も追加
backend.auth.resources.unauthenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "secretsmanager:GetSecretValue"
    ],
    resources: [
      `arn:aws:secretsmanager:${rdsStack.region}:${rdsStack.account}:secret:jiko-database-secret-*`
    ]
  })
);