import { Route } from "@angular/router";
import { CartPage } from "./cart/cart.page";
import { Tab1Page } from "./tab1.page";

export const TAB1_ROUTES: Route[] = [
    { path: '', component: Tab1Page },
    { path: 'cart', component: CartPage },
    // ...
];