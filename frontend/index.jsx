import { useCallback } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "react-query";
import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { i18nUtility } from "./utilities";
import { NotFoundPage } from "./components/commons";

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
function QueryProvider({ children }) {
	const client = new QueryClient({ queryCache: new QueryCache(), mutationCache: new MutationCache() });
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function AppBridgeLink({ url, children, external, ...rest }) {
	const handleClick = useCallback(() => window.open(url, "_self"), [url]);
	const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

	if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
		return (
			<a {...rest} href={url} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	} else {
		return (
			<a {...rest} onClick={handleClick}>
				{children}
			</a>
		);
	}
}

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 * Use it by importing Link from Polaris, e.g:
 *
 * ```
 * import {Link} from '@shopify/polaris'
 *
 * function MyComponent() {
 *  return (
 *    <div><Link url="/tab2">Tab 2</Link></div>
 *  )
 * }
 * ```
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
function PolarisProvider({ children }) {
	const translations = i18nUtility.getPolarisTranslations();
	return (
		<AppProvider i18n={translations} linkComponent={AppBridgeLink}>
			{children}
		</AppProvider>
	);
}

function useRoutes(pages) {
	const routes = Object.keys(pages)
		.map(function (key) {
			let path = key
				.replace("./pages", "")
				.replace(/\.(t|j)sx?$/, "")
				/**
				 * Replace /index with /
				 */
				.replace(/\/index$/i, "/")
				/**
				 * Only lowercase the first letter. This allows the developer to use camelCase
				 * dynamic paths while ensuring their standard routes are normalized to lowercase.
				 */
				.replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
				/**
				 * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
				 */
				.replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

			if (path.endsWith("/") && path !== "/") {
				path = path.substring(0, path.length - 1);
			}

			if (!pages[key].default) {
				console.warn(`${key} doesn't export a default React component`);
			}

			return { path, component: pages[key].default };
		})
		.filter((route) => route.component);

	return routes;
}

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.glob(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
function Routes({ pages }) {
	const routes = useRoutes(pages);
	const routeComponents = routes.map(({ path, component: Component }) => <Route key={path} path={path} element={<Component />} />);

	return (
		<ReactRouterRoutes>
			{routeComponents}
			<Route path="*" element={<NotFoundPage />} />
		</ReactRouterRoutes>
	);
}

// Ensure that locales are loaded before rendering the app
i18nUtility.initI18n().then(() => {
	const root = createRoot(document.getElementById("root"));
	const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });
	const { t } = useTranslation();

	root.render(
		<PolarisProvider>
			<BrowserRouter>
				<QueryProvider>
					<NavMenu>
						<a href="/" rel="home" />
						<a href="/pagename">{t("NavigationMenu.pageName")}</a>
					</NavMenu>
					<Routes pages={pages} />
				</QueryProvider>
			</BrowserRouter>
		</PolarisProvider>
	);
});
