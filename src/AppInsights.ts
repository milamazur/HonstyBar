import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js'

const APPINSIGHTS_KEY = '00f1010d-cd95-471e-bd85-c1ea9b143c37'

var reactPlugin = new ReactPlugin();
var ai = new ApplicationInsights({
    config: {
        instrumentationKey: APPINSIGHTS_KEY,
        enableAutoRouteTracking: true,
        extensions: [reactPlugin]
    }
});
ai.loadAppInsights();


export default (Component: any) => withAITracking(reactPlugin, Component)
export const appInsights = ai.appInsights;
export { reactPlugin };
