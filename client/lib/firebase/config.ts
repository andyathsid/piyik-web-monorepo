export function validateFirebaseConfig() {
  const requiredEnvVars = {
    admin: [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_DATABASE_URL',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
    ],
    client: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]
  };

  const missing: string[] = [];

  const checkEnvVars = (vars: string[]) => {
    vars.forEach(variable => {
      if (!process.env[variable]) {
        missing.push(variable);
      }
    });
  };

  checkEnvVars([...requiredEnvVars.admin, ...requiredEnvVars.client]);

  if (missing.length > 0) {
    throw new Error(`Missing required Firebase configuration variables: ${missing.join(', ')}`);
  }
} 