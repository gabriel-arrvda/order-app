import { Route } from "@angular/router";
import { CameraPage } from "./camera/camera.page";
import { Tab2Page } from "./tab2.page";

export const TAB2_ROUTES: Route[] = [
    { path: '', component: Tab2Page },
    { path: 'camera', component: CameraPage },
    // ...
];