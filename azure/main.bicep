param environment string
param location string = 'West Europe'

targetScope = 'subscription'

resource kioskFrontendResourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-frontend-kiosk-app-${environment}'
  location: location
}

module kioskFrontend 'kioskStaticSite.bicep' = {
  name: 'kiosk-frontend-module'
  scope: kioskFrontendResourceGroup
  params: {
    location: location
    appName: 'app-kiosk-${environment}'
  }
}
