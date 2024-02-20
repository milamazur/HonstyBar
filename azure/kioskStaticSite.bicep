param location string
param appName string

resource appKioskResource 'Microsoft.Web/staticSites@2021-03-01' = {
  name: appName
  location: location
  tags: {
    app: 'honestybar'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://dev.azure.com/kenze/Kenze-HonestyBar/_git/honestybar-kiosk'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    provider: 'DevOps'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}
